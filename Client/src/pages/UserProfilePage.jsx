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

import "./UserProfilePage.css";

const UserProfilePage = () => {

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

        } catch (error) {

          console.log(error);

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

      } catch (error) {

        console.log(error);

        setError(
          "Update failed"
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
              {name || "Your Profile"}
            </h1>
            <p className="bb-profile-header__email">
              {email || "Loading..."}
            </p>
          </div>
        </div>

        {/* ========== SETTINGS SECTION ========== */}
        <div className="bb-profile-section-header">
          <div className="bb-profile-section-icon">
            <HiOutlineCog />
          </div>
          <h2 className="bb-profile-section-title">Account Settings</h2>
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
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="bb-form-input"
                placeholder="Enter your name"
              />
            </div>

            {/* EMAIL */}
            <div className="bb-form-group">
              <label className="bb-form-label">
                <HiOutlineMail style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="bb-form-input"
                placeholder="Enter your email"
              />
            </div>

            <hr className="bb-profile-divider" />

            {/* PASSWORD */}
            <div className="bb-form-group">
              <label className="bb-form-label">
                <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginRight: 4 }} />
                New Password
              </label>
              <input
                type="password"
                placeholder="Leave empty if you don't want to change it"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="bb-form-input"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="bb-profile-submit"
            >
              {loading ? (
                <>
                  <span className="bb-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <HiOutlineSave />
                  Save Changes
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