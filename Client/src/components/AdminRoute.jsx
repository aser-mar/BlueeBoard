import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector(
    (state) => state.auth
  );

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (
  userInfo.role !== "admin" &&
  userInfo.role !== "company_manager"
) {
  return <Navigate to="/" replace />;
}

  return children;
};

export default AdminRoute;