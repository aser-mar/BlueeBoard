import { useState } from "react";

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

    <div
      className="container"

      style={{
        maxWidth: "500px",
        margin: "50px auto",
      }}
    >

      <h1>
        Register
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
          type="text"

          placeholder="Name"

          value={name}

          onChange={(e) =>
            setName(
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
              : "Register"
          }
        </button>

      </form>

      <p
        style={{
          marginTop: "20px",
        }}
      >
        Already have an account؟
        {" "}

        <Link to="/login">
          Login
        </Link>
      </p>

    </div>
  );
};

export default RegisterPage;

