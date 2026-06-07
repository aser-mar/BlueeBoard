import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../redux/slices/authSlice";

const Header = () => {

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    userInfo,
  } = useSelector(
    (state) => state.auth
  );

  const logoutHandler =
    () => {

      dispatch(logout());

      navigate("/");
    };

  return (

    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#111",
        padding: "15px 20px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >

      <div
        className="container"

        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        {/* LOGO */}

        <Link
          to="/"

          style={{
            textDecoration: "none",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Blue Board
        </Link>

        {/* NAV */}

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <Link
            to="/"

            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Home
          </Link>

          <Link
            to="/cart"

            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Cart
          </Link>

          {userInfo && (
  <Link
    to="/my-orders"
    style={{
      color: "white",
      textDecoration: "none",
    }}
  >
    My Orders
  </Link>
)}

<Link to="/profile" style={{
      color: "white",
      textDecoration: "none",
    }}>Profile</Link>

          {/* ADMIN */}

          {userInfo?.isAdmin && (

            <Link
              to="/admin"

              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Admin
            </Link>
          )}

          {/* USER NAME */}

          {userInfo && (

            <span
              style={{
                color: "#ddd",
                fontSize: "14px",
              }}
            >
              Hello,
              {" "}
              {userInfo.name}
            </span>
          )}

          {/* AUTH */}

          {!userInfo ? (

            <>

              <Link
                to="/login"

                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>

              <Link
                to="/register"

                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>

            </>

          ) : (

            <button
              onClick={
                logoutHandler
              }

              style={{
                background:
                  "#ff4d4d",
                border: "none",
                padding:
                  "8px 14px",
                borderRadius:
                  "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}

        </nav>

      </div>

    </header>
  );
};

export default Header;