import { useState } from "react";

import Logo from "../components/Logo";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  registerUser,
} from "../services/authService";

const RegisterPage = () => {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await registerUser({
          name,
          email,
          password,
        });

        alert(
          "Account Created Successfully"
        );

        navigate("/login");

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
            "Register Failed"
        );

      } finally {

        setLoading(false);
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
          padding: 14px 16px;
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
            Create your BlueeBoard account
          </h1>
          <p className="bb-register-copy">
            Join the platform to discover premium company products, save favourites, and manage orders seamlessly.
          </p>
        </div>

        {error && (
          <div className="bb-register-alert">
            {error}
          </div>
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
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
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
              Email address
            </label>
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
              className="bb-register-input"
            />
          </div>

          <div className="bb-register-field">
            <label
              className="bb-register-label"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              className="bb-register-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bb-register-button"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="bb-register-footer">
          Already have an account?{' '}
          <Link
            to="/login"
            className="bb-register-link"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

