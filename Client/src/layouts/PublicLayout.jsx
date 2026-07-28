import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { exitPreviewMode } from "../redux/slices/previewModeSlice";

const PublicLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { isPreviewMode } = useSelector((state) => state.previewMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isPrivilegedRole =
    userInfo?.role === "admin" || userInfo?.role === "companyManager";

  if (isPrivilegedRole && !isPreviewMode) {
    const redirectPath =
      userInfo.role === "admin" ? "/admin" : "/company-manager";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      <Header />
      {isPrivilegedRole && isPreviewMode && (
        <div className="bb-preview-mode-banner">
          You are viewing this site in Preview Mode as {userInfo.role === "admin" ? "Admin" : "Company Manager"}. Cart and checkout actions are disabled.
          <button
            className="bb-preview-mode-exit-btn"
            onClick={() => {
              dispatch(exitPreviewMode());
              navigate(userInfo.role === "admin" ? "/admin" : "/company-manager");
            }}
          >
            Exit Preview
          </button>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default PublicLayout;