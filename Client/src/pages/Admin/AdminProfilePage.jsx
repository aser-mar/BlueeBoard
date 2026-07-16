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

import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineSave,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineCog,
} from "react-icons/hi";

import "./AdminProfilePage.css";

const AdminProfilePage = () => {

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

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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
            "Failed to load profile"
          );
        }
      };

    if (token) {
      fetchProfile();
    }

  }, [token]);

  // SUBMIT
  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);
        setError("");
        setMessage("");

        await updateProfile(
          {
            name,
            email,
            password,
          },
          token
        );

        setMessage(
          "Profile updated successfully"
        );

        setPassword("");

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.message ||
          "Update failed"
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
          <h1>My Profile</h1>
          <p>Manage your admin account information and security settings.</p>
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
              Administrator
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
              Account Settings
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
                Full Name
              </label>
              <input
                id="adm-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="adm-form-input"
                placeholder="Enter your full name"
              />
            </div>

            {/* EMAIL */}
            <div className="adm-form-group">
              <label
                className="adm-form-label"
                htmlFor="adm-email"
              >
                <HiOutlineMail />
                Email Address
              </label>
              <input
                id="adm-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="adm-form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="adm-form-divider" />

            {/* PASSWORD */}
            <div className="adm-form-group">
              <label
                className="adm-form-label"
                htmlFor="adm-password"
              >
                <HiOutlineLockClosed />
                New Password
              </label>
              <input
                id="adm-password"
                type="password"
                placeholder="Leave empty to keep current password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="adm-form-input"
              />
            </div>

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
                    Saving...
                  </>
                ) : (
                  <>
                    <HiOutlineSave />
                    Save Changes
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
