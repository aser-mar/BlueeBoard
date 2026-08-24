import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
//   className = "",
  inputClassName = "",
  wrapperClassName = "",
  iconClassName = "",
  buttonClassName = "",
  leftIcon = null,
  autoComplete,
  style,
  inputStyle,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`bb-login-field ${wrapperClassName}`.trim()} style={style}>
      {label && (
        <label className="bb-login-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="bb-login-input-wrapper">
        {leftIcon}
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`bb-login-input ${inputClassName}`.trim()}
          autoComplete={autoComplete}
          disabled={disabled}
          style={inputStyle}
        />
        <button
          type="button"
          className={`bb-password-toggle ${buttonClassName}`.trim()}
          onClick={toggleVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          disabled={disabled}
        >
          {showPassword ? <HiOutlineEyeOff className={`bb-password-toggle__icon ${iconClassName}`.trim()} /> : <HiOutlineEye className={`bb-password-toggle__icon ${iconClassName}`.trim()} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
