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
} from "react-icons/hi";

import { HiOutlineUserCircle } from "react-icons/hi2";

import Logo from "./Logo";

import "./Sidebar.css";

const AdminSidebar = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logoutHandler = () => {

    dispatch(clearCart());

    dispatch(clearFavourites());

    dispatch(logout());

    navigate("/");

  };

  return (

    <aside className="sidebar">

      <div className="sidebar__logo">
        <Logo
          variant="sidebar"
          clickable={false}
        />
      </div>

      <nav className="sidebar__nav">

        <NavLink to="/admin" end>

          <HiOutlineViewGrid />

          Dashboard

        </NavLink>

        <NavLink to="/admin/profile">

          <HiOutlineUserCircle />

          Profile

        </NavLink>

        <NavLink to="/admin/products">

          <HiOutlineShoppingBag />

          Products

        </NavLink>

        <NavLink to="/admin/companies">

          <HiOutlineOfficeBuilding />

          Companies

        </NavLink>

        <NavLink to="/admin/company-managers">

          <HiOutlineUsers />

          Managers

        </NavLink>

        <NavLink to="/admin/categories">

          <HiOutlineCollection />

          Categories

        </NavLink>

        <NavLink to="/admin/banners">

          <HiOutlinePhotograph />

          Banners

        </NavLink>

        <NavLink to="/admin/orders">

          <HiOutlineClipboardList />

          Orders

        </NavLink>

      </nav>

      <button
        className="sidebar__logout"
        onClick={logoutHandler}
      >

        <HiOutlineLogout />

        Logout

      </button>

    </aside>

  );

};

export default AdminSidebar;