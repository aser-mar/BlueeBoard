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
  HiOutlineOfficeBuilding,
  HiOutlineCollection,
  HiOutlinePhotograph,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineLogout,
  HiOutlineTag,
  HiOutlineEye,
  HiOutlineGlobe,
} from "react-icons/hi";

import { HiOutlineUserCircle } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

import Logo from "./Logo";

import "./Sidebar.css";

const AdminSidebar = () => {
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
          <Logo
            variant="sidebar"
            clickable={false}
          />
        </div>

        <nav className="sidebar__nav">

          <NavLink to="/admin" end onClick={closeMobile}>

            <HiOutlineViewGrid />

            {t("nav.dashboard")}

          </NavLink>

          <NavLink to="/admin/profile" onClick={closeMobile}>

            <HiOutlineUserCircle />

            {t("nav.profile")}

          </NavLink>

          <NavLink to="/admin/products" onClick={closeMobile}>

            <HiOutlineShoppingBag />

            {t("admin.products")}

          </NavLink>

          <NavLink to="/admin/companies" onClick={closeMobile}>

            <HiOutlineOfficeBuilding />

            {t("admin.companies")}

          </NavLink>

          <NavLink to="/admin/company-managers" onClick={closeMobile}>

            <HiOutlineUsers />

            {t("admin.managers")}

          </NavLink>

          <NavLink to="/admin/categories" onClick={closeMobile}>

            <HiOutlineCollection />

            {t("admin.categories")}

          </NavLink>

          <NavLink to="/admin/sectors" onClick={closeMobile}>

            <HiOutlineTag />

            {t("admin.sectors")}

          </NavLink>

          <NavLink to="/admin/banners" onClick={closeMobile}>

            <HiOutlinePhotograph />

            {t("admin.banners")}

          </NavLink>

          <NavLink to="/admin/orders" onClick={closeMobile}>

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

export default AdminSidebar;