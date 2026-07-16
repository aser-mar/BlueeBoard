import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CompanyManagerRoute = ({ children }) => {
  const { userInfo } = useSelector(
    (state) => state.auth
  );

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== "companyManager") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CompanyManagerRoute;