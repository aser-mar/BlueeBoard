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

        const data =
          await loginUser({
            email,
            password,
          });

        dispatch(
          setCredentials(data)
        );

        if (
          data.userInfo.role ===
          "admin"
        ) {

          navigate("/admin");

        } else {

          navigate("/");
        }

      } catch (error) {

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

    <div
      className="container"

      style={{
        maxWidth: "500px",
        margin: "50px auto",
      }}
    >

      <h1>
        Login
      </h1>

      {
        error && (
          <p
            style={{
              color: "red",
            }}
          >
            {error}
          </p>
        )
      }

      <form
        onSubmit={
          submitHandler
        }
      >

        <input
          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          required

          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <input
          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          required

          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          type="submit"

          disabled={loading}

          style={{
            width: "100%",
            padding: "12px",
          }}
        >
          {
            loading
              ? "Loading..."
              : "Login"
          }
        </button>

      </form>

      <p
        style={{
          marginTop: "20px",
        }}
      >
        Don't have an account؟
        {" "}

        <Link to="/register">
          Register
        </Link>
      </p>

    </div>
  );
};

export default LoginPage;