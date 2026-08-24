import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";

import "../pages/LoginPage.css";

const AuthAlert = ({ type = "error", title, message, onDismiss, children }) => {
  const isSuccess = type === "success";

  return (
    <div className={`bb-login-alert ${isSuccess ? "bb-login-alert--success" : "bb-login-alert--error"}`}>
      <div className="bb-login-alert__icon">
        {isSuccess ? <HiOutlineCheckCircle /> : <HiOutlineExclamationCircle />}
      </div>
      <div className="bb-login-alert__content">
        {title && <div className="bb-login-alert__title">{title}</div>}
        <div>{message}</div>
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="bb-login-alert__close"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default AuthAlert;
