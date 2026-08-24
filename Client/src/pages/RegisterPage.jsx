import { useEffect, useState } from "react";

import Logo from "../components/Logo";
import AuthAlert from "../components/AuthAlert";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirementsUI from "../components/PasswordRequirementsUI";
import { getPasswordRequirements, isPasswordValid } from "../utils/passwordUtils";
import {
  Link,
} from "react-router-dom";

import {
  registerUser,
  resendVerificationEmail,
} from "../services/authService";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [countdown, setCountdown] =
    useState(0);

  const passwordRequirements = getPasswordRequirements(password, t);

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const submitHandler =
    async (e) => {

      e.preventDefault();

      const isPasswordValidResult = isPasswordValid(passwordRequirements);

      if (!isPasswordValidResult) {
        setError(t("register.errPassword"));
        return;
      }

      try {

        setLoading(true);
        setError("");
        setSuccessMessage("");
        setCountdown(0);

        await registerUser({
          name,
          email,
          password,
        });

        setSuccessMessage(
          t("register.success")
        );

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
            t("register.errFailed")
        );

      } finally {

        setLoading(false);
      }
    };

  const resendHandler = async () => {
    try {
      setResendLoading(true);
      setError("");

      const data = await resendVerificationEmail({ email });

      setSuccessMessage(data.message);
      setCountdown(60);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          t("register.errResend")
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bb-register-wrapper">
      <style>{`
        .bb-register-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 34%),
                      radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.1), transparent 28%),
                      #f8fafc;
          padding: 24px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .bb-register-card {
          width: 100%;
          max-width: 460px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 20px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
          padding: 42px 34px;
          animation: bbFadeInUp 0.5s ease-out both;
          backdrop-filter: blur(18px);
        }

        .bb-register-header {
          text-align: center;
          margin-bottom: 34px;
        }

        .bb-register-brand-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .bb-register-title {
          /* Slightly reduced size — avoids feeling heavy next to the logo */
          font-size: 28px;
          /* More open line-height for elegance */
          line-height: 1.25;
          /* Slightly lighter weight balances with the uppercase tagline above */
          font-weight: 700;
          /* Deeper navy — consistent with the BlueeBoard palette */
          color: #1e3a5f;
          /* Tighter tracking gives it a premium, intentional feel */
          letter-spacing: -0.3px;
          margin-bottom: 8px;
        }

        .bb-register-copy {
          color: #475569;
          font-size: 14px;
          line-height: 1.75;
          max-width: 340px;
          margin: 0 auto;
        }

        .bb-register-alert {
          margin-bottom: 24px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #b91c1c;
          font-weight: 500;
          line-height: 1.6;
        }

        .bb-register-alert__actions {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bb-register-alert__body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bb-register-alert__email {
          color: #0f172a;
          font-weight: 700;
          word-break: break-all;
        }

        .bb-register-alert__note {
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
        }

        .bb-register-alert__helper {
          color: #64748b;
          font-size: 13px;
        }

        .bb-register-alert__button {
          align-self: flex-start;
          border: none;
          border-radius: 999px;
          background: #2563eb;
          color: #ffffff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 16px;
          transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
        }

        .bb-register-alert__button:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .bb-register-alert__button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .bb-register-form {
          display: grid;
          gap: 22px;
        }

        .bb-register-field {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bb-register-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
        }

        .bb-register-input {
          width: 100%;
          min-height: 50px;
          padding: 14px 48px 14px 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(148, 163, 184, 0.3);
          background: #f8fafc;
          color: #0f172a;
          font-size: 15px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          outline: none;
          font-family: inherit;
        }

        .bb-register-input::placeholder {
          color: #94a3b8;
        }

        .bb-register-input:focus {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.08);
          transform: translateY(-1px);
          background: #fff;
        }

        .bb-register-password-toggle {
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .bb-register-password-toggle:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.08);
        }

        .bb-register-password-toggle__icon {
          width: 18px;
          height: 18px;
        }

        .bb-register-button {
          min-height: 52px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
        }

        .bb-register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(37, 99, 235, 0.22);
        }

        .bb-register-button:disabled {
          opacity: 0.72;
          cursor: not-allowed;
        }

        .bb-register-footer {
          margin-top: 26px;
          text-align: center;
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
        }

        .bb-register-link {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .bb-register-link:hover {
          color: #1d4ed8;
        }

        @keyframes bbFadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 520px) {
          .bb-register-card {
            padding: 32px 22px;
          }

          .bb-register-title {
            font-size: 28px;
          }

          .bb-register-input {
            min-height: 48px;
          }
        }
      `}</style>

      <div className="bb-register-card">
        <div className="bb-register-header">
          <div className="bb-register-brand-wrap">
            <Logo variant="login" />
          </div>
          <h1 className="bb-register-title">
            {t("register.title")}
          </h1>
          <p className="bb-register-copy">
            {t("register.subtitle")}
          </p>
        </div>

        {error && (
          <AuthAlert
            type="error"
            message={error}
          />
        )}

        {successMessage && (
          <AuthAlert
            type="success"
            title={t("register.alertSuccessTitle")}
            message={successMessage}
            onDismiss={() => setSuccessMessage("")}
          >
            <div className="bb-register-alert__actions">
              <div className="bb-register-alert__body">
                <div className="bb-register-alert__note">
                  {t("register.alertSentEmail")} <span className="bb-register-alert__email">{email}</span>
                </div>
                <div className="bb-register-alert__note">
                  {t("register.alertVerify")}
                </div>
                <div className="bb-register-alert__note">
                  {t("register.alertExpire")}
                </div>
                <div className="bb-register-alert__note">
                  {t("register.alertSpam")}
                </div>
              </div>

              <div className="bb-register-alert__helper">
                {countdown > 0 ? t("register.alertWait", { count: countdown }) : t("register.alertNoEmail")}
              </div>
              {countdown > 0 ? null : (
                <button
                  type="button"
                  className="bb-register-alert__button"
                  onClick={resendHandler}
                  disabled={resendLoading}
                >
                  {resendLoading ? t("register.sending") : t("register.resendEmail")}
                </button>
              )}
            </div>
          </AuthAlert>
        )}

        <form
          onSubmit={submitHandler}
          className="bb-register-form"
        >
          <div className="bb-register-field">
            <label
              className="bb-register-label"
              htmlFor="name"
            >
              {t("register.fullName")}
            </label>
            <input
              id="name"
              type="text"
              placeholder={t("register.namePlaceholder")}
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
              className="bb-register-input"
            />
          </div>

          <div className="bb-register-field">
            <label
              className="bb-register-label"
              htmlFor="email"
            >
              {t("register.email")}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t("register.emailPlaceholder")}
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              className="bb-register-input"
            />
          </div>

          <div className="bb-register-field">
            <PasswordInput
              id="password"
              label={t("register.password")}
              placeholder={t("register.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputClassName="bb-register-input"
              buttonClassName="bb-register-password-toggle"
              iconClassName="bb-register-password-toggle__icon"
              autoComplete="new-password"
            />
            <PasswordRequirementsUI requirements={passwordRequirements} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bb-register-button"
          >
            {loading ? t("register.creating") : t("register.registerBtn")}
          </button>
        </form>

        <div className="bb-register-footer">
          {t("register.alreadyHave")}{' '}
          <Link
            to="/login"
            className="bb-register-link"
          >
            {t("register.loginLink")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

