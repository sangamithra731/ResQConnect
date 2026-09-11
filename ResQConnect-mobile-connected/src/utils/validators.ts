export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s+-]/g, '');
  return cleaned.length >= 10 && /^\d+$/.test(cleaned);
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
}
