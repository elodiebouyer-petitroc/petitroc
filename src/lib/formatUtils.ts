export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return 'Non renseigné';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle standard 10-digit French number (e.g., 0612345678)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Handle international format for France (e.g., 33612345678)
  if (cleaned.length === 11 && cleaned.startsWith('33')) {
    return cleaned.replace(/33(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '+33 $1 $2 $3 $4 $5');
  }

  // Handle international format with + (e.g., +33612345678)
  if (phoneNumber.startsWith('+') && cleaned.length > 10) {
    // Basic formatting for other international numbers if needed, 
    // but focusing on French format as requested
    return phoneNumber;
  }

  return phoneNumber;
};
