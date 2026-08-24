export const getPasswordRequirements = (password, t) => [
  { label: t("register.reqLength"), valid: password.length >= 8 },
  { label: t("register.reqUpper"), valid: /[A-Z]/.test(password) },
  { label: t("register.reqLower"), valid: /[a-z]/.test(password) },
  { label: t("register.reqNumber"), valid: /[0-9]/.test(password) },
  { label: t("register.reqSpecial"), valid: /[^A-Za-z0-9]/.test(password) },
];

export const isPasswordValid = (passwordRequirements) => {
  return passwordRequirements.every((requirement) => requirement.valid);
};
