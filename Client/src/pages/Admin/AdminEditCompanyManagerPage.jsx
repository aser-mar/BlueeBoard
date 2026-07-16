import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanies } from "../../services/companyService";
import { getCompanyManagerById, updateCompanyManager } from "../../services/companyManagerService";
import {
  HiOutlineUser,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";

import "./AdminCompanyManagerForm.css";

const AdminEditCompanyManagerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companiesData, managerData] = await Promise.all([
          getCompanies(),
          getCompanyManagerById(id)
        ]);
        
        setCompanies(companiesData || []);
        
        if (managerData) {
          setName(managerData.name || "");
          setEmail(managerData.email || "");
          // handle case where company is populated
          const companyId = typeof managerData.company === "object" 
            ? managerData.company._id 
            : managerData.company;
          setCompany(companyId || "");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id]);

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (password && password.length < 6) {
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
        company,
      };
      
      if (password) {
        managerData.password = password;
      }

      await updateCompanyManager(id, managerData);

      alert("Company Manager Updated Successfully");
      navigate("/admin/company-managers");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update company manager");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="manager-form-container">
        <div className="manager-hero">
          <div className="manager-hero-icon skeleton skeleton--icon"></div>
          <div className="manager-hero-text">
            <div className="skeleton skeleton--text-large" style={{ width: "200px", marginBottom: "8px" }}></div>
            <div className="skeleton skeleton--text-medium" style={{ width: "300px" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-form-container">
      <header className="manager-hero">
        <div className="manager-hero-icon">
          <HiOutlineUser />
        </div>
        <div className="manager-hero-text">
          <h1>Edit Company Manager</h1>
          <p>Update company manager account and assignment.</p>
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
                placeholder="Leave empty to keep current password"
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
            {loading ? "Updating..." : "Update Company Manager"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCompanyManagerPage;