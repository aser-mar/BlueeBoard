import { useState } from "react";

import {
  useDispatch,
} from "react-redux";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  loginUser,
} from "../services/authService";

import {
  setCredentials,
} from "../redux/slices/authSlice";

import {
  loadUserCart,
} from "../redux/slices/cartSlice";

import {
  loadUserFavourites,
} from "../redux/slices/favouritesSlice";

import {
  HiOutlineMail,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
} from "react-icons/hi";

import Logo from "../components/Logo";
import AuthAlert from "../components/AuthAlert";
import PasswordInput from "../components/PasswordInput";
import { useTranslation } from "react-i18next";

import "./LoginPage.css";

const LoginPage = () => {
  const { t } = useTranslation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setError("");

        const data =
          await loginUser({
            email,
            password,
          });

        // SAVE AUTH
        dispatch(
          setCredentials(data)
        );


        // LOAD USER FAVOURITES
        dispatch(
          loadUserFavourites()
        );

        // SAVE USER INFO FOR CART STORAGE
        localStorage.setItem(
          "userInfo",
          JSON.stringify(
            data.userInfo
          )
        );

        // LOAD USER CART
        dispatch(
          loadUserCart()
        );

        // REDIRECT
        if (data.userInfo.role === "admin") {
          navigate("/admin");
        } else if (data.userInfo.role === "companyManager") {
          navigate("/company-manager");
        } else {
          navigate("/");
        }

      } catch (error) {

        console.log(error);

        setError(
          error.response?.data
            ?.message ||
          t("login.errFailed")
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
              {t("login.subtitle")}
            </p>
          </div>

          {error && (
            <AuthAlert
              type="error"
              message={error}
            />
          )}

          <form
            onSubmit={submitHandler}
            className="bb-login-form"
          >
            <div className="bb-login-field">
              <label
                className="bb-login-label"
                htmlFor="email"
              >
                {t("login.email")}
              </label>
              <div className="bb-login-input-wrapper">
                <HiOutlineMail
                  className="bb-login-input-icon"
                />
                <input
                  id="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  className="bb-login-input"
                />
              </div>
            </div>

            <PasswordInput
              id="password"
              label={t("login.password")}
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              leftIcon={<HiOutlineLockClosed className="bb-login-input-icon" />}
            />
            <div style={{ textAlign: "right", marginTop: "-8px" }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bb-login-button ${loading ? "bb-login-button--loading" : ""}`}
            >
              {
                loading ? (
                  <>
                    <span className="bb-login-button__spinner"></span>
                    {t("login.loggingIn")}
                  </>
                ) : (
                  <>
                    {t("login.signIn")}
                    <HiOutlineArrowRight
                      className="bb-login-button__icon bb-rtl-flip"
                    />
                  </>
                )
              }
            </button>
          </form>

          <div className="bb-login-divider">
            <span>{t("login.newTo")}</span>
          </div>

          <Link
            to="/register"
            className="bb-login-register-link"
          >
            {t("login.createAccount")}
            <HiOutlineArrowRight className="bb-rtl-flip" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;