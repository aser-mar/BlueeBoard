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
  HiOutlineLockClosed,
  HiOutlineArrowRight,
} from "react-icons/hi";

import Logo from "../components/Logo";

import "./LoginPage.css";

const LoginPage = () => {

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
          "Login Failed"
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
              Welcome back to your shopping dashboard
            </p>
          </div>

          {
            error && (
              <div
                className="bb-login-alert bb-login-alert--error"
              >
                <div className="bb-login-alert__icon">
                  ⚠
                </div>
                <div className="bb-login-alert__content">
                  {error}
                </div>
              </div>
            )
          }

          <form
            onSubmit={submitHandler}
            className="bb-login-form"
          >
            <div className="bb-login-field">
              <label
                className="bb-login-label"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="bb-login-input-wrapper">
                <HiOutlineMail
                  className="bb-login-input-icon"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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

            <div className="bb-login-field">
              <label
                className="bb-login-label"
                htmlFor="password"
              >
                Password
              </label>
              <div className="bb-login-input-wrapper">
                <HiOutlineLockClosed
                  className="bb-login-input-icon"
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
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
              {
                loading ? (
                  <>
                    <span className="bb-login-button__spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Sign in
                    <HiOutlineArrowRight
                      className="bb-login-button__icon"
                    />
                  </>
                )
              }
            </button>
          </form>

          <div className="bb-login-divider">
            <span>New to BLUEEBOARD?</span>
          </div>

          <Link
            to="/register"
            className="bb-login-register-link"
          >
            Create an account
            <HiOutlineArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;