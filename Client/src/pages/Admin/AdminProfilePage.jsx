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
} from "../../services/userService";

import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineSave, HiOutlineCheck, HiOutlineExclamation, HiOutlineCog } from "react-icons/hi";
import PasswordInput from "../../components/PasswordInput";
import PasswordRequirementsUI from "../../components/PasswordRequirementsUI";
import { getPasswordRequirements, isPasswordValid } from "../../utils/passwordUtils";
import { useTranslation } from "react-i18next";

import "./AdminProfilePage.css";

const AdminProfilePage = () => {

  const { token } =
    useSelector(
      (state) => state.auth
    );

  const { t } = useTranslation();

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

        } catch (err) {

          console.log(err);

          setError(
            t("adminProfile.errLoad")
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
        setError(t("adminProfile.errCurrentReq"));
        return;
      }

      if (password && password !== confirmPassword) {
        setError(t("adminProfile.errMatch"));
        return;
      }

      if (password) {
        if (!isPasswordValid(passwordRequirements)) {
          setError(t("adminProfile.errPassword"));
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
          t("adminProfile.success")
        );

        setPassword("");
        setCurrentPassword("");
        setConfirmPassword("");

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.message ||
          t("adminProfile.errUpdate")
        );

      } finally {

        setLoading(false);
      }
    };

  // Get user initials for avatar
  const getInitials = (fullName) => {
    if (!fullName) return "A";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0][0];
  };

  return (
    <div className="adm-profile-container">

      {/* ========== PAGE HEADER ========== */}
      <header className="adm-profile-hero">
        <div className="adm-profile-hero__icon">
          <HiOutlineUser />
        </div>
        <div className="adm-profile-hero__text">
          <h1>{t("adminProfile.title")}</h1>
          <p>{t("adminProfile.subtitle")}</p>
        </div>
      </header>

      <div className="adm-profile-body">

        {/* ========== AVATAR CARD ========== */}
        <div className="adm-profile-avatar-card">
          <div className="adm-profile-avatar">
            {getInitials(name)}
          </div>
          <div className="adm-profile-avatar-info">
            <span className="adm-profile-avatar-name">
              {name || "Admin"}
            </span>
            <span className="adm-profile-avatar-email">
              {email || "Loading..."}
            </span>
            <span className="adm-profile-avatar-role">
              {t("adminProfile.role")}
            </span>
          </div>
        </div>

        {/* ========== FORM CARD ========== */}
        <div className="adm-profile-form-card">

          <div className="adm-profile-form-card__header">
            <div className="adm-profile-form-card__icon">
              <HiOutlineCog />
            </div>
            <span className="adm-profile-form-card__title">
              {t("adminProfile.accountSettings")}
            </span>
          </div>

          {/* Alerts */}
          {message && (
            <div className="adm-profile-alert adm-profile-alert--success">
              <HiOutlineCheck />
              {message}
            </div>
          )}

          {error && (
            <div className="adm-profile-alert adm-profile-alert--error">
              <HiOutlineExclamation />
              {error}
            </div>
          )}

          <form
            onSubmit={submitHandler}
            className="adm-profile-form"
          >

            {/* NAME */}
            <div className="adm-form-group">
              <label
                className="adm-form-label"
                htmlFor="adm-name"
              >
                <HiOutlineUser />
                {t("adminProfile.fullName")}
              </label>
              <input
                id="adm-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="adm-form-input"
                placeholder={t("adminProfile.namePlaceholder")}
              />
            </div>

            {/* EMAIL */}
            <div className="adm-form-group">
              <label
                className="adm-form-label"
                htmlFor="adm-email"
              >
                <HiOutlineMail />
                {t("adminProfile.emailLabel")}
              </label>
              <input
                id="adm-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="adm-form-input"
                placeholder={t("adminProfile.emailPlaceholder")}
              />
            </div>

            <div className="adm-form-divider" />

            {/* PASSWORD */}
            <PasswordInput
              id="adm-current-password"
              label={(
                <span>
                  <HiOutlineLockClosed />
                  {t("adminProfile.currentPassword")}
                </span>
              )}
              placeholder={t("adminProfile.currentPasswordPlaceholder")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              inputClassName="adm-form-input"
              buttonClassName="bb-password-toggle-inline"
              autoComplete="current-password"
            />

            <PasswordInput
              id="adm-password"
              label={(
                <span>
                  <HiOutlineLockClosed />
                  {t("adminProfile.newPassword")}
                </span>
              )}
              placeholder={t("adminProfile.newPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputClassName="adm-form-input"
              buttonClassName="bb-password-toggle-inline"
              autoComplete="new-password"
            />
            <PasswordRequirementsUI requirements={passwordRequirements} />

            <PasswordInput
              id="adm-confirm-password"
              label={(
                <span>
                  <HiOutlineLockClosed />
                  {t("adminProfile.confirmPassword")}
                </span>
              )}
              placeholder={t("adminProfile.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputClassName="adm-form-input"
              buttonClassName="bb-password-toggle-inline"
              autoComplete="new-password"
            />

            {/* SUBMIT */}
            <div className="adm-form-actions">
              <button
                type="submit"
                disabled={loading}
                className="adm-profile-submit"
              >
                {loading ? (
                  <>
                    <span className="adm-spinner" />
                    {t("adminProfile.saving")}
                  </>
                ) : (
                  <>
                    <HiOutlineSave />
                    {t("adminProfile.saveChanges")}
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AdminProfilePage;
