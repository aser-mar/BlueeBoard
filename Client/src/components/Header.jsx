import { useState } from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../redux/slices/authSlice";

import {
  clearCart,
} from "../redux/slices/cartSlice";

import {
  clearFavourites,
} from "../redux/slices/favouritesSlice";

import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineClipboardList,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineUserAdd,
} from "react-icons/hi";

import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

import "./Header.css";

const Header = () => {
  const { t } = useTranslation();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const dispatch =
    useDispatch();

  const {
    userInfo,
  } = useSelector(
    (state) => state.auth
  );

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const logoutHandler =
    () => {

      // CLEAR USER CART
      dispatch(
        clearCart()
      );

      // REMOVE USER INFO
      localStorage.removeItem(
        "userInfo"
      );

      // CLEAR USER FAVOURITES
      dispatch(
        clearFavourites()
      );

      // LOGOUT
      dispatch(
        logout()
      );

      setMobileOpen(false);
      navigate("/");
    };

  const closeMobile = () =>
    setMobileOpen(false);

  const isActive = (path) =>
    location.pathname === path;

  const role = userInfo?.role;
  const isAdmin = role === "admin";
  const isCompanyManager = role === "companyManager";
  const isUser = role === "user";

  // Helper: get user initial for avatar
  const userInitial =
    userInfo?.name
      ? userInfo.name.charAt(0)
      : "";

  return (

    <header className="bb-header">

      <div className="bb-header__inner">

        {/* ========== LOGO ========== */}

        <div onClick={closeMobile}>
          <Logo variant="header" />
        </div>

        {/* ========== DESKTOP NAV ========== */}

        <nav className="bb-nav">

          {isUser || !userInfo ? (
            <Link
              to="/"
              className={`bb-nav__link${
                isActive("/") ? " bb-nav__link--active" : ""
              }`}
            >
              <HiOutlineHome />
              {t("nav.home")}
            </Link>
          ) : null}

          {isUser && (
            <Link
              to="/cart"
              className={
                `bb-nav__link${isActive("/cart") ? " bb-nav__link--active" : ""}`
              }
            >
              <HiOutlineShoppingCart />
              {t("nav.cart")}
            </Link>
          )}

          {isUser && (
            <Link
              to="/favourites"
              className={
                `bb-nav__link${isActive("/favourites") ? " bb-nav__link--active" : ""}`
              }
            >
              <HiOutlineHeart />
              {t("nav.favourites")}
            </Link>
          )}

          {isUser && (
            <Link
              to="/my-orders"
              className={
                `bb-nav__link${isActive("/my-orders") ? " bb-nav__link--active" : ""}`
              }
            >
              <HiOutlineClipboardList />
              {t("nav.myOrders")}
            </Link>
          )}

          {isUser && (
            <Link
              to="/profile"
              className={
                `bb-nav__link${isActive("/profile") ? " bb-nav__link--active" : ""}`
              }
            >
              <HiOutlineUserCircle />
              {t("nav.profile")}
            </Link>
          )}

          {isCompanyManager && (
            <Link
              to="/company-manager"
              className={
                `bb-nav__link${isActive("/company-manager") ? " bb-nav__link--active" : ""}`
              }
            >
              <HiOutlineShieldCheck />
              {t("nav.dashboard")}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={
                `bb-nav__link${isActive("/admin") ? " bb-nav__link--active" : ""}`
              }
            >
              <HiOutlineShieldCheck />
              {t("nav.admin")}
            </Link>
          )}

          {/* DIVIDER */}
          <span className="bb-nav__divider" />

          {/* LANGUAGE SWITCHER */}
          <LanguageSwitcher isMobile={false} />

          {/* USER NAME */}

          {userInfo && (

            <span className="bb-nav__greeting">
              <span className="bb-nav__greeting-avatar">
                {userInitial}
              </span>
              {t("nav.hello")} {userInfo.name}
            </span>
          )}

          {/* AUTH */}

          {!userInfo ? (

            <>

              <Link
                to="/login"
                className="bb-nav__auth-link"
              >
                <HiOutlineLogin />
                {t("nav.login")}
              </Link>

              <Link
                to="/register"
                className="bb-nav__auth-link bb-nav__auth-link--register"
              >
                <HiOutlineUserAdd />
                {t("nav.register")}
              </Link>

            </>

          ) : (

            <button
              onClick={
                logoutHandler
              }
              className="bb-nav__logout"
            >
              <HiOutlineLogout />
              {t("nav.logout")}
            </button>
          )}

        </nav>

        {/* ========== HAMBURGER TOGGLE ========== */}

        <button
          className={
            `bb-hamburger${mobileOpen ? " bb-hamburger--open" : ""}`
          }
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          aria-label="Toggle navigation menu"
        >
          <span className="bb-hamburger__line" />
          <span className="bb-hamburger__line" />
          <span className="bb-hamburger__line" />
        </button>

      </div>

      {/* ========== MOBILE OVERLAY ========== */}

      <div
        className={
          `bb-mobile-overlay${mobileOpen ? " bb-mobile-overlay--visible" : ""}`
        }
        onClick={closeMobile}
      />

      {/* ========== MOBILE NAV PANEL ========== */}

      <nav
        className={
          `bb-mobile-nav${mobileOpen ? " bb-mobile-nav--open" : ""}`
        }
      >

        {(isUser || !userInfo) && (
          <Link
            to="/"
            className={`bb-mobile-nav__link${
              isActive("/") ? " bb-mobile-nav__link--active" : ""
            }`}
            onClick={closeMobile}
          >
            <HiOutlineHome />
            {t("nav.home")}
          </Link>
        )}

        {isUser && (
          <Link
            to="/cart"
            className={
              `bb-mobile-nav__link${isActive("/cart") ? " bb-mobile-nav__link--active" : ""}`
            }
            onClick={closeMobile}
          >
            <HiOutlineShoppingCart />
            {t("nav.cart")}
          </Link>
        )}

        {isUser && (
          <Link
            to="/favourites"
            className={
              `bb-mobile-nav__link${isActive("/favourites") ? " bb-mobile-nav__link--active" : ""}`
            }
            onClick={closeMobile}
          >
            <HiOutlineHeart />
            {t("nav.favourites")}
          </Link>
        )}

        {isUser && (
          <Link
            to="/my-orders"
            className={
              `bb-mobile-nav__link${isActive("/my-orders") ? " bb-mobile-nav__link--active" : ""}`
            }
            onClick={closeMobile}
          >
            <HiOutlineClipboardList />
            {t("nav.myOrders")}
          </Link>
        )}

        {isUser && (
          <Link
            to="/profile"
            className={
              `bb-mobile-nav__link${isActive("/profile") ? " bb-mobile-nav__link--active" : ""}`
            }
            onClick={closeMobile}
          >
            <HiOutlineUserCircle />
            {t("nav.profile")}
          </Link>
        )}

        {isCompanyManager && (
          <Link
            to="/company-manager"
            className={
              `bb-mobile-nav__link${isActive("/company-manager") ? " bb-mobile-nav__link--active" : ""}`
            }
            onClick={closeMobile}
          >
            <HiOutlineShieldCheck />
            {t("nav.dashboard")}
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin"
            className={
              `bb-mobile-nav__link${isActive("/admin") ? " bb-mobile-nav__link--active" : ""}`
            }
            onClick={closeMobile}
          >
            <HiOutlineShieldCheck />
            {t("nav.admin")}
          </Link>
        )}

        <div className="bb-mobile-nav__divider" />

        {/* LANGUAGE SWITCHER */}
        <LanguageSwitcher isMobile={true} />

        {/* USER NAME */}

        {userInfo && (
          <div className="bb-mobile-nav__greeting">
            <span className="bb-nav__greeting-avatar">
              {userInitial}
            </span>
            {t("nav.hello")} {userInfo.name}
          </div>
        )}

        {/* AUTH */}

        {!userInfo ? (

          <>

            <Link
              to="/login"
              className="bb-mobile-nav__link"
              onClick={closeMobile}
            >
              <HiOutlineLogin />
              {t("nav.login")}
            </Link>

            <Link
              to="/register"
              className="bb-mobile-nav__link"
              onClick={closeMobile}
            >
              <HiOutlineUserAdd />
              {t("nav.register")}
            </Link>

          </>

        ) : (

          <button
            onClick={
              logoutHandler
            }
            className="bb-mobile-nav__logout"
          >
            <HiOutlineLogout />
            {t("nav.logout")}
          </button>
        )}

      </nav>

    </header>
  );
};

export default Header;