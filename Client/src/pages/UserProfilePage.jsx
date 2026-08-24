import {
  useEffect,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  getProfile,
  updateProfile,
} from "../services/userService";

import {
  HiOutlineCog,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineSave,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineMail,
} from "react-icons/hi";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirementsUI from "../components/PasswordRequirementsUI";
import { getPasswordRequirements, isPasswordValid } from "../utils/passwordUtils";
import { useTranslation } from "react-i18next";

import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { t } = useTranslation();

  const { token } =
    useSelector(
      (state) => state.auth
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const passwordRequirements = getPasswordRequirements(password, t);

  // LOAD PROFILE
  useEffect(() => {

    const fetchProfile =
      async () => {

        try {

          const data =
            await getProfile(token);

          setName(data.name);
          setEmail(data.email);

        } catch (error) {

          console.log(error);

          setError(
            t("profile.errLoad")
          );
        }
      };

    if (token) {
      fetchProfile();
    }

  }, [token, t]);

  // SUBMIT
  const submitHandler =
    async (e) => {

      e.preventDefault();

      if (password && !currentPassword) {
        setError(t("profile.errCurrentReq"));
        return;
      }

      if (password && password !== confirmPassword) {
        setError(t("profile.errMatch"));
        return;
      }

      if (password) {
        if (!isPasswordValid(passwordRequirements)) {
          setError(t("register.errPassword"));
          return;
        }
      }

      try {

        setLoading(true);

        setError("");
        setMessage("");

        await updateProfile(
          {
            name,
            email,
            currentPassword,
            newPassword: password,
          },
          token
        );

        setMessage(
          t("profile.success")
        );

        setPassword("");
        setCurrentPassword("");
        setConfirmPassword("");

      } catch (error) {

        console.log(error);

        setError(
          t("profile.errUpdate")
        );

      } finally {

        setLoading(false);
      }
    };

  // Get user initials for avatar
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0][0];
  };

  return (

    <div className="bb-profile-page">
      <div className="bb-profile-container">

        {/* ========== PROFILE HEADER ========== */}
        <div className="bb-profile-header">
          <div className="bb-profile-header__content">
            <div className="bb-profile-avatar">
              {getInitials(name)}
            </div>
            <h1 className="bb-profile-header__name">
              {name || t("profile.yourProfile")}
            </h1>
            <p className="bb-profile-header__email">
              {email || t("profile.loading")}
            </p>
          </div>
        </div>

        {/* ========== SETTINGS SECTION ========== */}
        <div className="bb-profile-section-header">
          <div className="bb-profile-section-icon">
            <HiOutlineCog />
          </div>
          <h2 className="bb-profile-section-title">{t("profile.settings")}</h2>
        </div>

        <div className="bb-profile-card">

          {/* Alerts */}
          {message && (
            <div className="bb-profile-alert bb-profile-alert--success">
              <HiOutlineCheck />
              {message}
            </div>
          )}

          {error && (
            <div className="bb-profile-alert bb-profile-alert--error">
              <HiOutlineExclamation />
              {error}
            </div>
          )}

          <form
            onSubmit={submitHandler}
            className="bb-profile-form"
          >

            {/* NAME */}
            <div className="bb-form-group">
              <label className="bb-form-label">
                <HiOutlineUser style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                {t("checkout.fullName")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="bb-form-input"
                placeholder={t("profile.namePlaceholder")}
              />
            </div>

            {/* EMAIL */}
            <div className="bb-form-group">
              <label className="bb-form-label">
                <HiOutlineMail style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                {t("login.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="bb-form-input"
                placeholder={t("profile.emailPlaceholder")}
              />
            </div>

            <hr className="bb-profile-divider" />

            {/* PASSWORD */}
            <PasswordInput
              id="currentPassword"
              label={(
                <span>
                  <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                  {t("profile.currentPassword")}
                </span>
              )}
              placeholder={t("profile.currentPasswordPlaceholder")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              inputClassName="bb-form-input"
              buttonClassName="bb-password-toggle-inline"
              autoComplete="current-password"
            />

            <PasswordInput
              id="newPassword"
              label={(
                <span>
                  <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                  {t("resetPassword.newPassword")}
                </span>
              )}
              placeholder={t("profile.newPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputClassName="bb-form-input"
              buttonClassName="bb-password-toggle-inline"
              autoComplete="new-password"
            />
            <PasswordRequirementsUI requirements={passwordRequirements} />

            <PasswordInput
              id="confirmPassword"
              label={(
                <span>
                  <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                  {t("resetPassword.confirmPassword")}
                </span>
              )}
              placeholder={t("profile.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputClassName="bb-form-input"
              buttonClassName="bb-password-toggle-inline"
              autoComplete="new-password"
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="bb-profile-submit"
            >
              {loading ? (
                <>
                  <span className="bb-spinner"></span>
                  {t("profile.updating")}
                </>
              ) : (
                <>
                  <HiOutlineSave />
                  {t("profile.saveChanges")}
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;