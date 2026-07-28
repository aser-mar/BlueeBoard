import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistor } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { clearFavourites } from "../redux/slices/favouritesSlice";

const SessionGuard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const role = userInfo?.role;

    if (role === "admin" || role === "companyManager") {
      const sessionActive = sessionStorage.getItem("privilegedSessionActive");

      if (!sessionActive) {
        dispatch(logout());
        dispatch(clearCart());
        dispatch(clearFavourites());
        persistor.purge();
        navigate("/login", { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

export default SessionGuard;
