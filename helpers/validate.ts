export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validatePhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    // Local format: 09xxxxxxxx
    return /^09\d{8}$/.test(cleanPhone);
  } else if (cleanPhone.length === 13) {
    return /^8869\d{8}$/.test(cleanPhone);
  }
  
  return false;
};
