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
  HiOutlineLogout,
} from "react-icons/hi";

import Logo from "./Logo";

import "./Sidebar.css";

const CompanyManagerSidebar = () => {

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
        <Logo variant="sidebar" clickable={false} />
      </div>

      <nav className="sidebar__nav">

        <NavLink
          to="/company-manager"
          end
        >

          <HiOutlineViewGrid />

          Dashboard

        </NavLink>

        <NavLink
          to="/company-manager/products"
        >

          <HiOutlineShoppingBag />

          Products

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

export default CompanyManagerSidebar;