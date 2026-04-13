export async function sendEmail({ to, subject, htmlContent, senderName = "Abou Ouattara (Le Sniper) - NGT Academy", senderEmail = "ngtinfos@gmail.com" }: { to: string, subject: string, htmlContent: string, senderName?: string, senderEmail?: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY is not set. Email sending skipped.");
    return { success: false, error: "API Key missing" };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      console.error("Brevo API error:", data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return { success: false, error };
  }
}

export function getThalamusWelcomeEmail(name: string) {
  return {
    subject: "Bienvenue sur Thalamus - L'IA du Sniper",
    htmlContent: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-style: italic;">NGT Academy</h1>
        </div>
        <div style="padding: 40px;">
          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Félicitations pour avoir rejoint <strong>Thalamus IA</strong>. Vous venez de faire un pas de géant vers la maîtrise de votre psychologie de trading.</p>
          <p>Thalamus n'est pas un simple outil d'analyse. C'est l'incarnation digitale de mes 10 ans d'expérience sur les marchés, codée pour penser comme moi.</p>
          <p style="font-style: italic; color: #d4af37; font-weight: bold; text-align: center; font-size: 18px; margin: 30px 0;">"Le Sniper ne peut pas être partout. Thalamus oui."</p>
          <p>Dès aujourd'hui, commencez à connecter vos trades via MT5 pour que Thalamus puisse commencer à apprendre de vos comportements.</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://thalamus-station.vercel.app/" style="background-color: #d4af37; color: #000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Accéder à mon Dashboard Thalamus</a>
          </div>
          <p style="color: #666; font-size: 14px;">Si le bouton ne fonctionne pas, copiez ce lien : https://thalamus-station.vercel.app/</p>
          <p style="margin-top: 40px; border-top: 1px solid #eee; pt-20px;">À très vite pour la suite,<br>
          <strong>Abou Ouattara (Le Sniper) - NGT Academy</strong></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          &copy; 2026 NGT Academy. Tous droits réservés.
        </div>
      </div>
    `
  };
}

export function getFreeTrainingWelcomeEmail(name: string) {
  return {
    subject: "🎁 Voici votre formation gratuite : Les 5 erreurs fatales",
    htmlContent: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-style: italic;">NGT Academy</h1>
        </div>
        <div style="padding: 40px;">
          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Félicitations pour avoir franchi cette première étape vers la maîtrise de votre trading.</p>
          <p>Comme promis, voici le lien vers votre formation gratuite : <strong>"Les 5 erreurs psychologiques qui tuent vos trades"</strong>.</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://ngt-academy.com/formation-gratuite-video" style="background-color: #d4af37; color: #000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Voir la formation gratuite</a>
          </div>
          <p>Dans cette vidéo, vous allez découvrir pourquoi 90% des traders échouent alors qu'ils ont parfois de bonnes stratégies. La réponse n'est pas technique, elle est mentale.</p>
          <p>Prenez 15 minutes aujourd'hui pour la regarder. Cela pourrait bien être le déclic dont vous avez besoin.</p>
          <p style="margin-top: 40px; border-top: 1px solid #eee; pt-20px;">À demain pour la suite,<br>
          <strong>Elodie - NGT Academy</strong></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          &copy; 2026 NGT Academy. Tous droits réservés.
        </div>
      </div>
    `
  };
}

export function getFormationAccessEmail(userName: string, formationName: string, accessLink: string) {
  return {
    subject: `🚀 Accès activé : ${formationName}`,
    htmlContent: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-style: italic;">NGT Academy</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #d4af37; text-align: center; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Félicitations Sniper !</h2>
          <p>Bonjour <strong>${userName}</strong>,</p>
          <p>Ton accès à la formation <strong>${formationName}</strong> est maintenant activé. Tu as fait le premier pas vers une transformation radicale de ton trading.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #d4af37;">
            <p style="margin: 0; font-weight: bold; color: #d4af37;">IMPORTANT : Accès Vidéo</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
              Nos vidéos sont sécurisées via YouTube Private. <br><br>
              <strong>Étape 1 :</strong> Assure-toi d'être connecté à YouTube avec l'adresse email utilisée pour ton achat.<br><br>
              <strong>Étape 2 :</strong> Clique sur le bouton ci-dessous pour accéder à ton espace de formation.
            </p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${accessLink}" style="background-color: #d4af37; color: #000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Accéder à ma formation</a>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center;">
            Si le bouton ne fonctionne pas, copie-colle ce lien dans ton navigateur :<br>
            <span style="color: #d4af37;">${accessLink}</span>
          </p>

          <p style="margin-top: 40px; border-top: 1px solid #eee; pt-20px;">À très vite pour la suite,<br>
          <strong>Abou Ouattara (Le Sniper) - NGT Academy</strong></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          &copy; 2026 NGT Academy. Tous droits réservés.
        </div>
      </div>
    `
  };
}

export function getAdminWhitelistNotification(userEmail: string, formationName: string, youtubeVideoId: string) {
  return {
    subject: `🔔 Whitelist YouTube à faire : ${userEmail}`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4; color: #333;">
        <h2>Nouvelle Whitelist YouTube à effectuer</h2>
        <p>Un nouvel élève a acheté une formation et doit être ajouté manuellement à la whitelist YouTube.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;"><strong>Email de l'élève :</strong> <span style="color: #d4af37; font-weight: bold;">${userEmail}</span></li>
            <li style="margin-bottom: 10px;"><strong>Formation :</strong> ${formationName}</li>
            <li style="margin-bottom: 10px;"><strong>ID Vidéo YouTube :</strong> ${youtubeVideoId}</li>
          </ul>
        </div>
        <p style="margin-top: 20px;">
          <a href="https://studio.youtube.com/video/${youtubeVideoId}/edit" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Gérer la vidéo sur YouTube Studio</a>
        </p>
      </div>
    `
  };
}

export function getMagicLinkEmail(userName: string, magicLink: string) {
  return {
    subject: "🔗 Votre lien de connexion magique - NGT Academy",
    htmlContent: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-style: italic;">NGT Academy</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #d4af37; text-align: center; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Connexion Instantanée</h2>
          <p>Bonjour <strong>${userName}</strong>,</p>
          <p>Cliquez sur le bouton ci-dessous pour vous connecter instantanément à votre espace membre NGT Academy. Ce lien est valable pendant 24 heures.</p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}" style="background-color: #d4af37; color: #000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Se connecter maintenant</a>
          </div>

          <p style="font-size: 14px; color: #888; text-align: center;">
            Si le bouton ne fonctionne pas, copie-colle ce lien dans ton navigateur :<br>
            <span style="color: #d4af37;">${magicLink}</span>
          </p>

          <p style="margin-top: 40px; border-top: 1px solid #eee; pt-20px;">À très vite dans l'arène,<br>
          <strong>Abou Ouattara (Le Sniper) - NGT Academy</strong></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          &copy; 2026 NGT Academy. Tous droits réservés.
        </div>
      </div>
    `
  };
}
