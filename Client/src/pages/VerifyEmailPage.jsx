import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineArrowRight } from "react-icons/hi";
import Logo from "../components/Logo";
import { verifyEmail } from "../services/authService";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : t("verify.noToken")
  );
  const verificationPromiseRef = useRef(new Map());
  const completedTokenRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const currentToken = token;

    if (!currentToken) {
      return undefined;
    }

    if (completedTokenRef.current === currentToken) {
      return undefined;
    }

    const existingVerification = verificationPromiseRef.current.get(currentToken);

    if (existingVerification) {
      existingVerification
        .then((data) => {
          if (!isMounted) return;
          completedTokenRef.current = currentToken;
          setStatus("success");
          setMessage(data.message || t("verify.successMsg"));
        })
        .catch((error) => {
          if (!isMounted) return;
          setStatus("error");
          setMessage(
            error.response?.data?.message ||
              t("verify.errInvalid")
          );
        });

      return () => {
        isMounted = false;
      };
    }

    const verify = async () => {
      const data = await verifyEmail(currentToken);

      if (!isMounted) {
        return data;
      }

      completedTokenRef.current = currentToken;
      setStatus("success");
      setMessage(data.message || t("verify.successMsg"));

      return data;
    };

    const verificationPromise = verify().catch((error) => {
      if (!isMounted) {
        throw error;
      }

      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          t("verify.errInvalid")
      );

      throw error;
    });

    verificationPromiseRef.current.set(currentToken, verificationPromise);

    verificationPromise.finally(() => {
      if (verificationPromiseRef.current.get(currentToken) === verificationPromise) {
        verificationPromiseRef.current.delete(currentToken);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [token, t]);

  const isSuccess = status === "success";

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
              {isSuccess ? t("verify.subtitleSuccess") : t("verify.subtitle")}
            </p>
          </div>

          {status === "loading" ? (
            <div className="bb-login-alert bb-login-alert--success">
              <div className="bb-login-alert__icon">
                <HiOutlineCheckCircle />
              </div>
              <div className="bb-login-alert__content">
                <div className="bb-login-alert__title">{t("verify.checking")}</div>
                <div>{t("verify.waitMsg")}</div>
              </div>
            </div>
          ) : (
            <div
              className={`bb-login-alert ${
                isSuccess ? "bb-login-alert--success" : "bb-login-alert--error"
              }`}
            >
              <div className="bb-login-alert__icon">
                {isSuccess ? <HiOutlineCheckCircle /> : <HiOutlineExclamationCircle />}
              </div>
              <div className="bb-login-alert__content">
                <div className="bb-login-alert__title">
                  {isSuccess ? t("verify.titleSuccess") : t("verify.titleFailed")}
                </div>
                <div>{message}</div>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
              <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
                {t("verify.canSignIn")}
              </p>
            </div>
          ) : status === "error" ? (
            <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
              <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
                {t("verify.expiredMsg")}
              </p>
            </div>
          ) : null}

          <Link to="/login" className="bb-login-register-link">
            {isSuccess ? t("verify.goToLogin") : t("forgotPassword.backToLogin")}
            <HiOutlineArrowRight className="bb-rtl-flip" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
