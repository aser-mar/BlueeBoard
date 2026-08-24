import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies } from "../../services/companyService";
import { createCompanyManager } from "../../services/companyManagerService";
import {
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../components/PasswordInput";
import PasswordRequirementsUI from "../../components/PasswordRequirementsUI";
import { getPasswordRequirements, isPasswordValid } from "../../utils/passwordUtils";

import "./AdminCompanyManagerForm.css";

const AdminAddCompanyManagerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRequirements = getPasswordRequirements(password, t);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data || []);
      } catch (err) {
        console.error(err);
        setError(t("admin.errSomethingWentWrong"));
      }
    };

    loadCompanies();
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      setError(t("admin.errManagerName"));
      return false;
    }

    if (!email.trim()) {
      setError(t("admin.errManagerEmail"));
      return false;
    }

    if (!password) {
      setError(t("register.errPassword"));
      return false;
    }

    if (!isPasswordValid(passwordRequirements)) {
      setError(t("register.errPassword"));
      return false;
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
        password,
        company,
      };

      await createCompanyManager(managerData);

      alert("Company Manager Created Successfully");
      navigate("/admin/company-managers");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("admin.errSomethingWentWrong"));
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
          <h1>{t("admin.addManager")}</h1>
          <p>{t("admin.addManagerDesc")}</p>
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
          <div className="form-row full">
            <div className="form-group">
              <PasswordInput
                id="password"
                label={
                  <span>
                    <HiOutlineLockClosed style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle", marginInlineEnd: 4 }} />
                    {t("admin.password")}
                  </span>
                }
                placeholder={t("register.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputClassName="manager-password-input"
                buttonClassName="bb-password-toggle-inline"
                autoComplete="new-password"
              />
              <PasswordRequirementsUI requirements={passwordRequirements} />
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
            {loading ? t("admin.addingManager") : t("admin.addManager")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCompanyManagerPage;