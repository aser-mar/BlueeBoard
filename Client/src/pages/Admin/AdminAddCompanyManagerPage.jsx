import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies } from "../../services/companyService";
import { createCompanyManager } from "../../services/companyManagerService";
import {
  HiOutlineUser,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";

import "./AdminCompanyManagerForm.css";

const AdminAddCompanyManagerPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load companies");
      }
    };

    loadCompanies();
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!company) {
      setError("Company is required");
      return false;
    }

    setError("");
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const managerData = {
        name,
        email,
        password,
        company,
      };

      await createCompanyManager(managerData);

      alert("Company Manager Created Successfully");
      navigate("/admin/company-managers");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create company manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-form-container">
      <header className="manager-hero">
        <div className="manager-hero-icon">
          <HiOutlineUser />
        </div>
        <div className="manager-hero-text">
          <h1>Add Company Manager</h1>
          <p>Create a new company manager account and assign it to a company.</p>
        </div>
      </header>

      {error && <div className="manager-error" role="status">{error}</div>}

      <form onSubmit={submitHandler} className="manager-form">
        {/* Manager Details */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlineUser />
            Manager Information
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Manager Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter manager name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter minimum 6 characters password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Company Assignment */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlineOfficeBuilding />
            Company Assignment
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <select
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/company-managers")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? "Creating..." : "Add Company Manager"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCompanyManagerPage;