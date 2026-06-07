import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile, updateProfile } from "../services/userService";

const UserProfilePage = () => {
  const { token } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);

        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.log(error);
        setError("Failed to load profile");
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // UPDATE PROFILE
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfile(
        { name, email },
        token
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>User Profile</h1>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <form onSubmit={submitHandler}>

        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </form>
    </div>
  );
};

export default UserProfilePage;