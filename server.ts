import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { Resend } from "resend";
import Stripe from "stripe";
import admin from "firebase-admin";

dotenv.config();

let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is missing in environment variables");
    }
    resendClient = new Resend(key || "re_placeholder");
  }
  return resendClient;
}

let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

let dbClient: admin.firestore.Firestore | null = null;
function getDb() {
  if (!dbClient) {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID
        });
      } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        throw error;
      }
    }
    dbClient = admin.firestore();
  }
  return dbClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Stripe webhook needs raw body
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (webhookSecret) {
        event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // Fallback for development if secret is missing
        event = JSON.parse(req.body);
      }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan as any;

          if (userId && plan) {
            const subscriptionId = session.subscription as string;
            const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
            
            await getDb().collection("users").doc(userId).update({
              "subscription": {
                plan,
                status: "active",
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscriptionId,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
                cancelAtPeriodEnd: false
              },
              "isPartner": plan === "or" || plan === "premium"
            });
          }
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          // Find user by customer ID
          const userSnapshot = await getDb().collection("users").where("subscription.stripeCustomerId", "==", customerId).limit(1).get();
          
          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const status = subscription.status === "active" ? "active" : 
                           subscription.status === "past_due" ? "past_due" : 
                           subscription.status === "unpaid" ? "unpaid" : "canceled";
            
            const plan = userDoc.data().subscription?.plan;

            await userDoc.ref.update({
              "subscription.status": status,
              "subscription.currentPeriodEnd": new Date((subscription as any).current_period_end * 1000).toISOString(),
              "subscription.cancelAtPeriodEnd": (subscription as any).cancel_at_period_end,
              "isPartner": status === "active" && (plan === "or" || plan === "premium")
            });
          }
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          
          const userSnapshot = await getDb().collection("users").where("subscription.stripeCustomerId", "==", customerId).limit(1).get();
          if (!userSnapshot.empty) {
            await userSnapshot.docs[0].ref.update({
              "subscription.status": "past_due",
              "isPartner": false
            });
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error processing webhook event:", error);
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // API route for Stripe Checkout
  app.post("/api/create-checkout-session", async (req, res) => {
    const { plan, userId, userEmail } = req.body;

    const priceIds: Record<string, string> = {
      bronze: process.env.STRIPE_PRICE_BRONZE || "price_bronze_placeholder",
      argent: process.env.STRIPE_PRICE_ARGENT || "price_argent_placeholder",
      or: process.env.STRIPE_PRICE_OR || "price_or_placeholder",
      premium: process.env.STRIPE_PRICE_PREMIUM || "price_premium_placeholder",
    };

    const priceId = priceIds[plan];

    if (!priceId) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    try {
      // Check if user already has a customer ID
      const userDoc = await getDb().collection("users").doc(userId).get();
      const userData = userDoc.data();
      let customerId = userData?.subscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await getStripe().customers.create({
          email: userEmail,
          metadata: { userId }
        });
        customerId = customer.id;
      }

      const session = await getStripe().checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/mon-espace-pro?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/devenir-prestataire`,
        metadata: {
          userId,
          plan
        }
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("--- FULL STRIPE CHECKOUT ERROR START ---");
      console.error(error);
      if (error.raw) {
        console.error("Raw Stripe Error:", JSON.stringify(error.raw, null, 2));
      }
      console.error("--- FULL STRIPE CHECKOUT ERROR END ---");
      res.status(500).json({ error: error.message });
    }
  });

  // API route for Stripe Customer Portal
  app.post("/api/create-portal-session", async (req, res) => {
    const { customerId } = req.body;

    try {
      const session = await getStripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}/mon-espace-pro`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("--- FULL STRIPE PORTAL ERROR START ---");
      console.error(error);
      if (error.raw) {
        console.error("Raw Stripe Error:", JSON.stringify(error.raw, null, 2));
      }
      console.error("--- FULL STRIPE PORTAL ERROR END ---");
      res.status(500).json({ error: error.message });
    }
  });

  // API route for sending emails
  app.post("/api/send-email", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing in environment variables");
      return res.json({ success: true, message: "Bypassed due to missing API key" });
    }

    try {
      const { data, error } = await getResend().emails.send({
        from: "Petitroc <onboarding@resend.dev>",
        to: ["elodie.bouyer@laposte.net"],
        subject: `Nouveau message de contact: ${subject}`,
        html: `
          <h1>Nouveau message de contact</h1>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(400).json({ success: false, error });
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // API route for reCAPTCHA verification
  app.post("/api/verify-recaptcha", async (req, res) => {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is missing" });
    }

    if (!secretKey) {
      // In development, if secret key is missing, we might want to bypass or warn
      console.warn("RECAPTCHA_SECRET_KEY is missing in environment variables");
      return res.json({ success: true, score: 0.9, message: "Bypassed due to missing secret key" });
    }

    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
      );

      const { success, score } = response.data;

      if (success && score >= 0.5) {
        res.json({ success: true, score });
      } else {
        res.status(400).json({ success: false, score, message: "reCAPTCHA verification failed" });
      }
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
