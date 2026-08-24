import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import Logo from "../components/Logo";
import { HiOutlineMail, HiOutlineArrowRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await forgotPassword(email);

      setSubmitted(true);
    } catch (error) {
      setError(
        error.response?.data?.message || t("forgotPassword.errFailed")
      );
    } finally {
      setLoading(false);
    }
  };

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
              {submitted
                ? t("forgotPassword.subtitleSuccess")
                : t("forgotPassword.subtitle")}
            </p>
          </div>

          {error && (
            <div className="bb-login-alert bb-login-alert--error">
              <div className="bb-login-alert__icon">⚠</div>
              <div className="bb-login-alert__content">{error}</div>
            </div>
          )}

          {submitted ? (
            <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
              <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
                {t("forgotPassword.successMsg")}
              </p>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="bb-login-form">
              <div className="bb-login-field">
                <label className="bb-login-label" htmlFor="email">
                  {t("login.email")}
                </label>
                <div className="bb-login-input-wrapper">
                  <HiOutlineMail className="bb-login-input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bb-login-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bb-login-button ${loading ? "bb-login-button--loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="bb-login-button__spinner"></span>
                    {t("forgotPassword.sending")}
                  </>
                ) : (
                  <>
                    {t("forgotPassword.sendLink")}
                    <HiOutlineArrowRight className="bb-login-button__icon bb-rtl-flip" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="bb-login-divider">
            <span>{t("forgotPassword.rememberPassword")}</span>
          </div>

          <Link to="/login" className="bb-login-register-link">
            {t("forgotPassword.backToLogin")}
            <HiOutlineArrowRight className="bb-rtl-flip" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
