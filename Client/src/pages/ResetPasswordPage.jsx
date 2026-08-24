import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword, validateResetToken } from "../services/authService";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import { HiOutlineArrowRight, HiOutlineLockClosed } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenStatus, setTokenStatus] = useState(
    token ? "checking" : "invalid"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    token
      ? ""
      : t("resetPassword.errInvalidLink")
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    validateResetToken(token)
      .then(() => {
        if (isMounted) {
          setTokenStatus("valid");
          setError("");
        }
      })
      .catch((validationError) => {
        if (!isMounted) return;

        setTokenStatus("invalid");
        setError(
          validationError.response?.data?.message ||
            t("resetPassword.errInvalidLink")
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token, t]);

  const passwordRequirements = [
    { label: t("register.reqLength"), valid: password.length >= 8 },
    { label: t("register.reqUpper"), valid: /[A-Z]/.test(password) },
    { label: t("register.reqLower"), valid: /[a-z]/.test(password) },
    { label: t("register.reqNumber"), valid: /[0-9]/.test(password) },
    { label: t("register.reqSpecial"), valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const submitHandler = async (e) => {
    e.preventDefault();

    if (tokenStatus !== "valid") {
      setError(t("resetPassword.errInvalidLink"));
      return;
    }

    const isPasswordValid = passwordRequirements.every((requirement) => requirement.valid);

    if (!isPasswordValid) {
      setError(t("register.errPassword"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword.errMatch"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resetPassword(token, password);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (resetError) {
      setError(
        resetError.response?.data?.message || t("resetPassword.errExpired")
      );
    } finally {
      setLoading(false);
    }
  };

  const isChecking = tokenStatus === "checking";
  const isTokenValid = tokenStatus === "valid";
  const showInvalidState = tokenStatus === "invalid";

  return (
    <div className="bb-login-wrapper">
      <div className="bb-login-background">
        <div className="bb-login-glow bb-login-glow--1"></div>
        <div className="bb-login-glow bb-login-glow--2"></div>
      </div>

      <div className="bb-login-container">
        <div className="bb-login-card">
          <div className="bb-login-header">
            <div className="bb-login-brand-wrap">
              <Logo variant="login" />
            </div>
            <p className="bb-login-subtitle">
              {success
                ? t("resetPassword.successTitle")
                : isChecking
                  ? t("resetPassword.checkingLink")
                  : isTokenValid
                    ? t("resetPassword.chooseNew")
                    : t("resetPassword.linkUnavailable")}
            </p>
          </div>

          {error && !success && (showInvalidState || isChecking) && (
            <div className="bb-login-alert bb-login-alert--error">
              <div className="bb-login-alert__icon">⚠</div>
              <div className="bb-login-alert__content">
                <div className="bb-login-alert__title">{t("resetPassword.linkUnavailable")}</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {isChecking && (
            <div className="bb-login-alert bb-login-alert--success">
              <div className="bb-login-alert__icon">⏳</div>
              <div className="bb-login-alert__content">
                <div className="bb-login-alert__title">{t("resetPassword.checkingTitle")}</div>
                <div>{t("resetPassword.checkingDesc")}</div>
              </div>
            </div>
          )}

          {success ? (
            <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
              <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
                {t("resetPassword.redirecting")}
              </p>
            </div>
          ) : isTokenValid ? (
            <form onSubmit={submitHandler} className="bb-login-form">
              <PasswordInput
                id="password"
                label={t("resetPassword.newPassword")}
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                leftIcon={<HiOutlineLockClosed className="bb-login-input-icon" />}
              />
              <div style={{ display: "grid", gap: "6px", marginTop: "4px" }}>
                {passwordRequirements.map((requirement) => (
                  <div
                    key={requirement.label}
                    style={{
                      fontSize: "12px",
                      color: requirement.valid ? "#15803d" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{requirement.valid ? "✓" : "•"}</span>
                    <span>{requirement.label}</span>
                  </div>
                ))}
              </div>

              <PasswordInput
                id="confirmPassword"
                label={t("resetPassword.confirmPassword")}
                placeholder={t("login.passwordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                leftIcon={<HiOutlineLockClosed className="bb-login-input-icon" />}
              />

              <button
                type="submit"
                disabled={loading}
                className={`bb-login-button ${loading ? "bb-login-button--loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="bb-login-button__spinner"></span>
                    {t("resetPassword.resetting")}
                  </>
                ) : (
                  <>
                    {t("resetPassword.resetBtn")}
                    <HiOutlineArrowRight className="bb-login-button__icon bb-rtl-flip" />
                  </>
                )}
              </button>
            </form>
          ) : null}

          {!success && !isChecking && (
            <>
              <div className="bb-login-divider">
                <span>{showInvalidState ? t("resetPassword.needHelp") : t("resetPassword.changedMind")}</span>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <Link to="/login" className="bb-login-register-link">
                  {t("forgotPassword.backToLogin")}
                  <HiOutlineArrowRight className="bb-rtl-flip" />
                </Link>

                {showInvalidState && (
                  <Link to="/forgot-password" className="bb-login-register-link">
                    {t("resetPassword.requestNew")}
                    <HiOutlineArrowRight className="bb-rtl-flip" />
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
