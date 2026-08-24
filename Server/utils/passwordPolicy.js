const validatePassword = (password) => {
  if (!password) {
    return {
      valid: false,
      message: "Password is required.",
    };
  }

  const checks = [];

  if (password.length < 8) {
    checks.push("at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    checks.push("an uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    checks.push("a lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    checks.push("a number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    checks.push("a special character");
  }

  if (checks.length > 0) {
    return {
      valid: false,
      message: `Password must be at least 8 characters and contain ${checks.join(", ")}.`,
    };
  }

  return {
    valid: true,
    message: "Password is valid.",
  };
};

module.exports = {
  validatePassword,
};
