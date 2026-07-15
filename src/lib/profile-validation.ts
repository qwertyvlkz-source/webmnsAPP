const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export const getLoginValidationKey = (email: string, password: string): string | null => {
  if (!EMAIL_PATTERN.test(email.trim())) return "profile.login.emailRequired";
  if (!password) return "profile.login.passwordRequired";
  return null;
};

export const getRegistrationValidationKey = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): string | null => {
  if (!name.trim()) return "profile.login.nameRequired";
  if (!EMAIL_PATTERN.test(email.trim())) return "profile.login.emailRequired";
  if (password.length < 8) return "settings.passwordMin";
  if (password !== confirmPassword) return "settings.passwordMismatch";
  return null;
};
