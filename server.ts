import express from "express";
console.log("[Server] server.ts is being executed...");
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import admin from "firebase-admin";
import dotenv from "dotenv";
import cors from "cors";
import { 
  sendEmail, 
  getThalamusWelcomeEmail, 
  getFreeTrainingWelcomeEmail,
  getFormationAccessEmail,
  getAdminWhitelistNotification,
  getMagicLinkEmail
} from "./server/emailService";
import { randomBytes } from "node:crypto";
import { generateSignedUrl } from "./server/ovhStorage";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

import { readFileSync } from "fs";
const firebaseConfig = JSON.parse(readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));

import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (!admin.apps.length) {
  const projectId = firebaseConfig.projectId;
  console.log(`[Firebase] Initializing Admin SDK with Project: ${projectId}`);
  try {
    admin.initializeApp({
      projectId: projectId
    });
    console.log("[Firebase] Admin SDK initialized successfully");
  } catch (err) {
    console.error("[Firebase] Error initializing Admin SDK:", err);
  }
}

let db: admin.firestore.Firestore;
try {
  const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
  console.log(`[Firebase] Connecting to Firestore database: ${dbId}`);
  
  // Use the app instance explicitly
  const app = admin.app();
  db = getFirestore(app, dbId);
  
  // Test connection immediately with a simple read
  db.collection("health_check").doc("ping").get()
    .then(() => console.log("[Firebase] Firestore connection test successful"))
    .catch(err => {
      console.error("[Firebase] Firestore connection test failed:", err.message);
      if (err.message.includes("PERMISSION_DENIED")) {
        console.error("[Firebase] CRITICAL: Permission denied. Check IAM roles for the service account.");
      }
    });
} catch (err) {
  console.error("[Firebase] Error getting Firestore instance:", err);
  db = getFirestore(admin.app());
}

// Helper to generate secure token
function generateSecureToken(length: number = 32): string {
  return randomBytes(length / 2).toString("hex");
}

// Product to Video Mapping
const PRODUCT_VIDEOS: Record<string, { name: string, videoId?: string, lessons?: { title: string, videoId: string }[] }> = {
  "psychology": { 
    name: "Psychologie du Trading", 
    lessons: [
      { title: "Introduction", videoId: "yF-B1JL9Ylo" },
      { title: "Pourquoi la psychologie?", videoId: "x6AmA5fSSas" },
      { title: "Les émotions", videoId: "g748Vojz4go" },
      { title: "Lien entre cerveau et Esprit", videoId: "Ct8Rdgnpstk" },
      { title: "Le fonctionnement du cerveau", videoId: "GZbCqBoTB0A" },
      { title: "Pourquoi cette formation est importante", videoId: "6g2v2dTXe7A" },
      { title: "Virus 1", videoId: "R4m5F7ur8v0" },
      { title: "Virus 2", videoId: "yE2tLjNRaDU" },
      { title: "Virus 3", videoId: "1HOccF1KEFA" },
      { title: "Prison Mentale", videoId: "vujGu64UU40" },
      { title: "Le conscient et le subconscient", videoId: "OCewI1jcO4Q" },
      { title: "Patience et discipline", videoId: "s6ZwYNTI3Zw" },
      { title: "La psychologie de l'attente", videoId: "GD1Iu7Ys1Uo" }
    ]
  },
  "psychology_lead": { 
    name: "Psychologie du Trading", 
    lessons: [
      { title: "Introduction", videoId: "yF-B1JL9Ylo" },
      { title: "Pourquoi la psychologie?", videoId: "x6AmA5fSSas" },
      { title: "Les émotions", videoId: "g748Vojz4go" },
      { title: "Lien entre cerveau et Esprit", videoId: "Ct8Rdgnpstk" },
      { title: "Le fonctionnement du cerveau", videoId: "GZbCqBoTB0A" },
      { title: "Pourquoi cette formation est importante", videoId: "6g2v2dTXe7A" },
      { title: "Virus 1", videoId: "R4m5F7ur8v0" },
      { title: "Virus 2", videoId: "yE2tLjNRaDU" },
      { title: "Virus 3", videoId: "1HOccF1KEFA" },
      { title: "Prison Mentale", videoId: "vujGu64UU40" },
      { title: "Le conscient et le subconscient", videoId: "OCewI1jcO4Q" },
      { title: "Patience et discipline", videoId: "s6ZwYNTI3Zw" },
      { title: "La psychologie de l'attente", videoId: "GD1Iu7Ys1Uo" }
    ]
  },
  "cameleon": { name: "Plan Caméléon", videoId: "VIDEO_ID_CAMELEON" },
  "algo_lifetime": { name: "Algorithme Caméléon", videoId: "VIDEO_ID_ALGO" },
  "full_pack": { name: "Pack Complet NGT", videoId: "VIDEO_ID_FULL_PACK" },
  "algo_lifetime_upsell": { name: "Algorithme Caméléon", videoId: "VIDEO_ID_ALGO" },
};

async function logPaymentEvent(data: any) {
  try {
    if (!db) {
      console.warn("[Firebase] Firestore not available for logging payment event");
      return;
    }
    await db.collection("payment_logs").add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging payment event:", error);
  }
}

async function createFormationToken(userId: string, userEmail: string, userName: string, productId: string) {
  const formation = PRODUCT_VIDEOS[productId];
  if (!formation) return null;

  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiry

  const tokenData = {
    token,
    userId,
    userEmail,
    userName,
    formationId: productId,
    formationName: formation.name,
    youtubeVideoId: formation.videoId || (formation.lessons && formation.lessons[0].videoId),
    lessons: formation.lessons || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    isWhitelisted: false
  };

  if (!db) {
    console.error("[Firebase] Firestore not available for creating formation token");
    throw new Error("Database not available");
  }

  await db.collection("formation_tokens").doc(token).set(tokenData);

  // Send Email to User
  if (userEmail) {
    try {
      const accessLink = `${process.env.APP_URL || "https://ngt-academy.com"}/formation/${token}`;
      const userEmailData = getFormationAccessEmail(userName, formation.name, accessLink);
      await sendEmail({
        to: userEmail,
        subject: userEmailData.subject,
        htmlContent: userEmailData.htmlContent
      });
    } catch (emailErr) {
      console.error("[Email] Failed to send user access email:", emailErr);
    }
  }

  // Send Notification to Admin
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "ngtinfos@gmail.com";
    const adminEmailData = getAdminWhitelistNotification(userEmail || "Email inconnu", formation.name, tokenData.youtubeVideoId || "N/A");
    await sendEmail({
      to: adminEmail,
      subject: adminEmailData.subject,
      htmlContent: adminEmailData.htmlContent
    });
  } catch (adminEmailErr) {
    console.error("[Email] Failed to send admin notification email:", adminEmailErr);
  }

  return token;
}

async function sendMagicLink(email: string, name: string) {
  try {
    const actionCodeSettings = {
      url: `${process.env.APP_URL || "https://ngt-academy.com"}/auth/callback?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };

    const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);
    const emailData = getMagicLinkEmail(name, link);

    await sendEmail({
      to: email,
      subject: emailData.subject,
      htmlContent: emailData.htmlContent
    });

    console.log(`[MagicLink] Sent to ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[MagicLink] Error sending to ${email}:`, error);
    return { success: false, error: error.message };
  }
}

async function startServer() {
  console.log("[Server] Inside startServer function...");
  console.log("[Server] Starting server...");
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Test Firestore connection
  try {
    if (db) {
      await db.collection("health_check").doc("ping").set({ lastPing: admin.firestore.FieldValue.serverTimestamp() });
      console.log("[Firebase] Firestore connection successful");
    } else {
      console.warn("[Firebase] Firestore instance not available for connection test");
    }
  } catch (err) {
    console.error("[Firebase] Firestore connection failed:", err);
  }

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
  });

  app.get("/api/sante", (req, res) => {
    res.json({ status: "ok", message: "Le serveur est en ligne" });
  });

  // Stripe Webhook (must be before express.json())
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      
      await logPaymentEvent({
        status: "failed",
        error: err.message,
        metadata: { webhookError: true }
      });

      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const productId = session.metadata?.productId;
      const userEmail = session.customer_email;
      const userName = session.customer_details?.name || "Sniper";

      await logPaymentEvent({
        userId,
        email: userEmail,
        productId,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        status: "completed",
        stripeSessionId: session.id,
        stripeEventId: event.id,
        metadata: session.metadata
      });

      if (userId && productId) {
        const userRef = db.collection("users").doc(userId);
        
        // Handle Access Logic
        if (productId === "psychology" || productId === "psychology_lead") {
          await userRef.set({ hasAccessPsychology: true }, { merge: true });
        } else if (productId === "cameleon" || productId === "cameleon_pack" || productId === "cameleon_lite") {
          await userRef.set({ hasAccessCameleon: true }, { merge: true });
        } else if (productId === "algo_lifetime" || productId === "algo_monthly" || productId === "algo_annual" || productId === "algo_lifetime_upsell") {
          await userRef.set({ 
            isAlgoUser: true,
            hasAccessAlgo: true
          }, { merge: true });
        } else if (productId === "full_pack" || productId === "full_pack_upsell") {
          await userRef.set({ 
            hasAccessCameleon: true,
            isAlgoUser: true,
            hasAccessAlgo: true
          }, { merge: true });
        }

        // Generate Token and Send Emails
        if (userEmail) {
          await createFormationToken(userId, userEmail, userName, productId);
          // Also send a magic link for immediate access to member area
          await sendMagicLink(userEmail, userName);
        }
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // Log all requests to debug
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  // API: Generate Token (Manual or for existing users)
  app.post("/api/generate-token", async (req, res) => {
    const { userId, productId } = req.body;
    console.log(`[API] generate-token requested for user: ${userId}, product: ${productId}`);

    if (!userId || !productId) {
      console.warn("[API] Missing userId or productId in request");
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      if (!db) throw new Error("Database not available");
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        console.warn(`[API] User ${userId} not found in Firestore`);
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();
      console.log(`[API] Generating token for ${userData?.email}`);
      const token = await createFormationToken(userId, userData?.email, userData?.displayName || "Sniper", productId);
      
      if (!token) {
        console.error(`[API] Failed to generate token for product ${productId}`);
        return res.status(500).json({ error: "Failed to generate token" });
      }

      console.log(`[API] Token generated successfully: ${token}`);
      res.json({ success: true, token });
    } catch (error: any) {
      console.error("[API] Error in generate-token:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API: Verify Token
  app.get("/api/verify-token/:token", async (req, res) => {
    const { token } = req.params;

    try {
      if (!db) throw new Error("Database not available");
      const tokenDoc = await db.collection("formation_tokens").doc(token).get();
      if (!tokenDoc.exists) {
        return res.status(404).json({ error: "Token invalide" });
      }

      const tokenData = tokenDoc.data();
      const now = admin.firestore.Timestamp.now();

      if (tokenData?.expiresAt && tokenData.expiresAt.toMillis() < now.toMillis()) {
        return res.status(403).json({ error: "Token expiré" });
      }

      res.json({ success: true, ...tokenData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API: Get Signed URL for OVH Video
  app.get("/api/get-signed-url", async (req, res) => {
    const { key } = req.query;
    console.log(`[API] Requesting signed URL for key: ${key}`);
    
    if (!key || typeof key !== "string") {
      console.error("[API] Error: Missing video key");
      return res.status(400).json({ error: "Missing video key" });
    }

    try {
      const url = await generateSignedUrl(key);
      console.log(`[API] Successfully generated signed URL for: ${key}`);
      res.json({ success: true, url });
    } catch (error: any) {
      console.error(`[API] Error generating signed URL for ${key}:`, error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });

  // Send Welcome Email
  app.post("/api/send-welcome-email", async (req, res) => {
    const { email, name, type } = req.body;

    if (!email || !name || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      let emailData;
      if (type === "thalamus") {
        emailData = getThalamusWelcomeEmail(name);
      } else if (type === "free_training") {
        emailData = getFreeTrainingWelcomeEmail(name);
      } else {
        return res.status(400).json({ error: "Invalid email type" });
      }

      const result = await sendEmail({
        to: email,
        subject: emailData.subject,
        htmlContent: emailData.htmlContent
      });

      if (result.success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API: Send Magic Link
  app.post("/api/send-magic-link", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });

    try {
      // Check if user exists or just send anyway (security best practice is to not reveal if user exists)
      // For NGT, we might want to check if they have any purchases if we want to restrict
      const result = await sendMagicLink(email, "Sniper");
      if (result.success) {
        res.json({ success: true, message: "Lien magique envoyé !" });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const { productId, userId, email, mode: requestedMode } = req.body;

    let priceId = "";
    let productName = "";
    let mode: "payment" | "subscription" = "payment";

    // PRIX NORMAUX (page de vente)
    if (productId === "cameleon") {
      priceId = process.env.STRIPE_PRICE_CAMELEON || "price_1TICyiATTFnnuv02XSjh6";
      productName = "Plan Caméléon - Formation";
      mode = "payment";
    } else if (productId === "algo_lifetime") {
      priceId = process.env.STRIPE_PRICE_ALGO_LIFETIME || "price_1TInapATTFnnuv02Zfdal";
      productName = "Algorithme Caméléon - À vie";
      mode = "payment";
    } else if (productId === "algo_monthly") {
      priceId = process.env.STRIPE_PRICE_ALGO_MONTH || process.env.STRIPE_PRICE_ALGO_MONTHLY || "price_1TinZgATTFnnuv02fazV4";
      productName = "Algorithme Caméléon - Mensuel";
      mode = "subscription";
    } else if (productId === "algo_annual") {
      priceId = process.env.STRIPE_PRICE_ALGO_ANNUAL || "price_1TKhTWATTFnnuv023CS3j8aj";
      productName = "Algorithme Caméléon - Annuel (engagement 1 an)";
      mode = "subscription";
    } else if (productId === "full_pack") {
      priceId = process.env.STRIPE_PRICE_FULL_PACK || "price_1TInbwATTFnnuv02hblU";
      productName = "Pack Complet (Formation + Algo à vie)";
      mode = "payment";
    } else if (productId === "psychology") {
      priceId = process.env.STRIPE_PRICE_PSYCHOLOGY || "price_1TICx8ATTFnnuv02mS5l";
      productName = "Formation Psychologie du trading";
      mode = "payment";
    } 
    // UPSELLS
    else if (productId === "algo_lifetime_upsell") {
      priceId = process.env.STRIPE_PRICE_ALGO_LIFETIME_UPSELL || "price_1R07AQATTFnnuv02KotWBqrS";
      productName = "Algorithme Caméléon - À vie (Upsell)";
      mode = "payment";
    } else if (productId === "algo_monthly_upsell") {
      priceId = process.env.STRIPE_PRICE_ALGO_MONTHLY_UPSELL || "price_1R079UATTFnnuv02Gj4WqPsm";
      productName = "Algorithme Caméléon - 1 mois d'essai (Upsell)";
      mode = "subscription";
    }

    if (!priceId) {
      console.error(`[Stripe] Error: No price ID found for product ${productId}`);
      return res.status(400).json({ error: `Configuration manquante pour le produit: ${productId}` });
    }

    console.log(`[Stripe] Creating checkout session for ${productId} with price ${priceId}`);

    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
      }
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "klarna"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: mode,
        success_url: `${req.headers.origin}/merci?success=true&productId=${productId}`,
        cancel_url: `${req.headers.origin}/plan-cameleon?canceled=true`,
        client_reference_id: userId,
        customer_email: email,
        metadata: {
          productId,
        },
        // For subscriptions, we can add a trial if it's the upsell
        subscription_data: mode === "subscription" && productId === "algo_monthly_upsell" ? {
          trial_period_days: 30
        } : undefined,
      });

      // Log the session creation
      await logPaymentEvent({
        userId,
        email,
        productId,
        status: "pending",
        stripeSessionId: session.id,
        metadata: { action: "create_session", mode }
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      // Log the creation error
      await logPaymentEvent({
        userId,
        email,
        productId,
        status: "failed",
        error: error.message,
        metadata: { action: "create_session_error" }
      });

      res.status(500).json({ error: error.message });
    }
  });

  // API: Contact Support
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || "ngtinfos@gmail.com";
      
      await sendEmail({
        to: adminEmail,
        subject: `[Support] ${subject}`,
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #D4AF37;">Nouveau message de support</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Message :</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("[API] Error in contact support:", error);
      res.status(500).json({ error: "Une erreur est survenue lors de l'envoi du message." });
    }
  });

  // Catch-all for unmatched API routes
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Global error handler for API routes
  app.use("/api", (err: any, req: any, res: any, next: any) => {
    console.error("[API Error]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });
}

startServer();
console.log("[Server] startServer() has been called.");
