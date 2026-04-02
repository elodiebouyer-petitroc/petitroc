
export const FORBIDDEN_WORDS = [
  'casino', 'bitcoin', 'gagnant', 'pharmacie', 'viagra', 'cialis', 
  'prêt argent', 'investissement', 'formation', 'gagner de l\'argent', 
  'médicament', 'whatsapp', 'telegram'
];

export const SUSPICIOUS_DOMAINS = [
  'temp-mail.org', 'guerillamail.com', 'sharklasers.com', 
  'guerrillamail.info', 'grr.la', 'guerrillamail.biz', 
  'guerrillamail.com', 'guerrillamail.de', 'guerrillamail.net', 
  'guerrillamail.org', 'guerrillamailblock.com', 'pokemail.net',
  'spam4.me', 'dispostable.com', 'mailinator.com', 'yopmail.com'
];

export const SUSPICIOUS_LINKS = [
  'bit.ly', 'goo.gl', 't.co', 'tinyurl.com', 'is.gd', 'buff.ly', 'ow.ly'
];

/**
 * Checks if a text contains any forbidden words.
 */
export const containsForbiddenWords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_WORDS.some(word => lowerText.includes(word.toLowerCase()));
};

/**
 * Checks if an email belongs to a suspicious domain.
 */
export const isSuspiciousEmail = (email: string): boolean => {
  const domain = email.split('@')[1];
  if (!domain) return false;
  return SUSPICIOUS_DOMAINS.some(d => domain.toLowerCase().includes(d.toLowerCase()));
};

/**
 * Checks if a text contains suspicious links.
 */
export const containsSuspiciousLinks = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return SUSPICIOUS_LINKS.some(link => lowerText.includes(link.toLowerCase()));
};

/**
 * Checks if a text contains foreign phone numbers (non-French for this app).
 * Simple regex for non-French numbers (doesn't start with +33 or 0).
 * This is a bit tricky, let's look for patterns that look like phone numbers but aren't French.
 */
export const containsForeignPhoneNumbers = (text: string): boolean => {
  // Regex for phone numbers
  const phoneRegex = /(\+?\d[\d\s.-]{7,}\d)/g;
  const matches = text.match(phoneRegex);
  
  if (!matches) return false;
  
  return matches.some(match => {
    const cleanMatch = match.replace(/[\s.-]/g, '');
    // If it starts with +33 or 0 (and is followed by 1-9), it's likely French
    if (cleanMatch.startsWith('+33') || (cleanMatch.startsWith('0') && /^[1-9]/.test(cleanMatch[1]))) {
      return false;
    }
    return true;
  });
};

/**
 * Sends an alert email to the admin.
 */
export const sendAdminAlert = async (subject: string, message: string) => {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Système Anti-Spam',
        email: 'noreply@petitroc.fr',
        subject,
        message
      })
    });
  } catch (error) {
    console.error('Failed to send admin alert:', error);
  }
};
