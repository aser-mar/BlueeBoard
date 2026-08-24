import {
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import {
  logout,
} from "../redux/slices/authSlice";

import {
  enterPreviewMode,
} from "../redux/slices/previewModeSlice";

import {
  clearCart,
} from "../redux/slices/cartSlice";

import {
  clearFavourites,
} from "../redux/slices/favouritesSlice";

import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineEye,
  HiOutlineGlobe,
} from "react-icons/hi";

import Logo from "./Logo";
import { useTranslation } from "react-i18next";

import "./Sidebar.css";

const CompanyManagerSidebar = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('bb-language', newLang);
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const closeMobile = () =>
    setMobileOpen(false);

  const logoutHandler = () => {

    dispatch(clearCart());

    dispatch(clearFavourites());

    dispatch(logout());

    closeMobile();

    navigate("/");

  };

  const enterPreview = () => {
    dispatch(enterPreviewMode());
    navigate("/");
  };

  return (

    <>

      {/* ===== MOBILE HAMBURGER (hidden on desktop via CSS) ===== */}

      <button
        className={
          `sidebar__hamburger${mobileOpen ? " sidebar__hamburger--open" : ""}`
        }
        onClick={() =>
          setMobileOpen((prev) => !prev)
        }
        aria-label="Toggle sidebar menu"
      >
        <span className="sidebar__hamburger-line" />
        <span className="sidebar__hamburger-line" />
        <span className="sidebar__hamburger-line" />
      </button>

      {/* ===== MOBILE OVERLAY (closes sidebar on outside click) ===== */}

      <div
        className={
          `sidebar__overlay${mobileOpen ? " sidebar__overlay--visible" : ""}`
        }
        onClick={closeMobile}
      />

      {/* ===== SIDEBAR ===== */}

      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>

        <div className="sidebar__logo">
          <Logo variant="sidebar" clickable={false} />
        </div>

        <nav className="sidebar__nav">

          <NavLink
            to="/company-manager"
            end
            onClick={closeMobile}
          >

            <HiOutlineViewGrid />

            {t("nav.dashboard")}

          </NavLink>

          <NavLink
            to="/company-manager/products"
            onClick={closeMobile}
          >

            <HiOutlineShoppingBag />

            {t("admin.products")}

          </NavLink>

          <NavLink
            to="/company-manager/orders"
            onClick={closeMobile}
          >

            <HiOutlineClipboardList />

            {t("admin.orders")}

          </NavLink>

        </nav>

        <div className="sidebar__bottom-actions">
          <button
            className="sidebar__preview-btn"
            onClick={toggleLanguage}
          >

            <HiOutlineGlobe />

            {t("nav.languageToggle")}

          </button>

          <button
            className="sidebar__preview-btn"
            onClick={enterPreview}
          >

            <HiOutlineEye />

            {t("admin.viewAsUser")}

          </button>

          <button
            className="sidebar__logout"
            onClick={logoutHandler}
          >

            <HiOutlineLogout />

            {t("nav.logout")}

          </button>
        </div>

      </aside>

    </>

  );

};

export default CompanyManagerSidebar;