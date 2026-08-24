import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanies } from "../../services/companyService";
import { getCompanyManagerById, updateCompanyManager } from "../../services/companyManagerService";
import {
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../components/PasswordInput";
import PasswordRequirementsUI from "../../components/PasswordRequirementsUI";
import { getPasswordRequirements, isPasswordValid } from "../../utils/passwordUtils";

import "./AdminCompanyManagerForm.css";

const AdminEditCompanyManagerPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const passwordRequirements = getPasswordRequirements(password, t);

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
        setError(t("admin.errSomethingWentWrong"));
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id]);

  const validateForm = () => {
    if (!name.trim()) {
      setError(t("admin.errManagerName"));
      return false;
    }

    if (!email.trim()) {
      setError(t("admin.errManagerEmail"));
      return false;
    }

    if (password) {
      if (password !== confirmPassword) {
        setError(t("adminProfile.errMatch"));
        return false;
      }

      if (!isPasswordValid(passwordRequirements)) {
        setError(t("register.errPassword"));
        return false;
      }
    }

    if (!company) {
      setError(t("admin.errManagerCompany"));
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
      setError(err.response?.data?.message || t("admin.errSomethingWentWrong"));
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
          <h1>{t("admin.editManager")}</h1>
          <p>{t("admin.editManagerDesc")}</p>
        </div>
      </header>

      {error && <div className="manager-error" role="status">{error}</div>}

      <form onSubmit={submitHandler} className="manager-form">
        {/* Manager Details */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlineUser />
            {t("admin.managerInfo")}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">{t("admin.managerName")}</label>
              <input
                id="name"
                type="text"
                placeholder={t("admin.managerName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t("admin.emailAddress")}</label>
              <input
                id="email"
                type="email"
                placeholder={t("admin.emailAddress")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Change Password Section — mirrors Profile page's change-password pattern */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlineLockClosed />
            {t("admin.changePasswordSection")}
          </div>
          <div className="form-row full">
            <div className="form-group">
              <PasswordInput
                id="edit-manager-password"
                label={
                  <span>
                    <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginInlineEnd: 4 }} />
                    {t("adminProfile.newPassword")}
                  </span>
                }
                placeholder={t("admin.leavePasswordBlank")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputClassName="manager-password-input"
                buttonClassName="bb-password-toggle-inline"
                autoComplete="new-password"
              />
              <PasswordRequirementsUI requirements={passwordRequirements} />
            </div>
          </div>
          
          <div className="form-row full">
            <div className="form-group">
              <PasswordInput
                id="edit-manager-confirm-password"
                label={
                  <span>
                    <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginInlineEnd: 4 }} />
                    {t("adminProfile.confirmPassword")}
                  </span>
                }
                placeholder={t("adminProfile.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                inputClassName="manager-password-input"
                buttonClassName="bb-password-toggle-inline"
                autoComplete="new-password"
              />
            </div>
          </div>
        </section>

        {/* Company Assignment */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlineOfficeBuilding />
            {t("admin.companyAssignment", "Company Assignment")}
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label htmlFor="company">{t("admin.company")}</label>
              <select
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="">{t("admin.selectCompany")}</option>
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
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? t("admin.updatingManager") : t("admin.updateManager")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCompanyManagerPage;