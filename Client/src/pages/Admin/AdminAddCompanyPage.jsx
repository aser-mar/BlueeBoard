import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../../services/companyService";
import { getSectors } from "../../services/sectorService";
import EGYPT_REGIONS from "../../constants/egyptRegions";
import ImageUploader from "../../components/ImageUploader";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePhotograph,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";

import "./AdminCompanyForm.css";

const AdminAddCompanyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [logo, setLogo] = useState(null);

  const [selectedGovernorates, setSelectedGovernorates] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);

  const [error, setError] = useState("");

  // Image upload handled by ImageUploader component

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await getSectors();
        setSectors(data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSectors();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const derivedRegions = [
        ...new Set(
          selectedGovernorates.map((gov) => {
            return EGYPT_REGIONS.find((r) => r.governorates.includes(gov))?.region;
          }).filter(Boolean)
        ),
      ];

      const companyData = {
        name,
        description,
        logo,
        governorates: selectedGovernorates,
        region: derivedRegions,
        sectors: selectedSectors,
      };

      await createCompany(companyData);

      alert(t("admin.companyAdded"));

      setName("");
      setDescription("");
      setLogo(null);
      setSelectedGovernorates([]);
      setSelectedSectors([]);
      navigate("/admin/companies");
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError(t("admin.enterCompanyName"));
      return false;
    }

    if (!description.trim()) {
      setError(t("admin.enterCompanyDescription"));
      return false;
    }

    if (!logo) {
      setError(t("admin.uploadCompanyLogo"));
      return false;
    }

    if (selectedGovernorates.length === 0) {
      setError(t("admin.selectGovernorate"));
      return false;
    }

    if (sectors.length === 0) {
      setError(t("admin.noSectorsAvailable"));
      return false;
    } else if (selectedSectors.length === 0) {
      setError(t("admin.selectSector"));
      return false;
    }

    setError("");
    return true;
  };

  return (
    <div className="company-form-container">
      <header className="company-hero">
        <div className="company-hero-icon">
          <HiOutlineOfficeBuilding />
        </div>
        <div className="company-hero-text">
          <h1>{t("admin.addCompany")}</h1>
          <p>{t("admin.createCompanyDescription")}</p>
        </div>
      </header>

      {error && (
        <div className="company-error" role="status">
          {error}
        </div>
      )}

      <form onSubmit={submitHandler} className="company-form">
        {/* Company Information */}
        <section className="form-section">
          <div className="form-section-title">
            <span>📋</span>
            {t("admin.companyInformation")}
          </div>
          <div className="form-group">
            <label htmlFor="name">{t("admin.companyName")}</label>
            <input
              id="name"
              type="text"
              placeholder={t("admin.enterCompanyName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">{t("admin.description")}</label>
            <textarea
              id="description"
              placeholder={t("admin.enterCompanyDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        {/* Governorates & Regions */}
        <section className="form-section">
          <div className="form-section-title">
            <span>📍</span>
            {t("admin.governoratesRegions")}
          </div>
          {EGYPT_REGIONS.map((regionObj) => (
            <div key={regionObj.region}>
              <div className="company-form-region-heading">{regionObj.region}</div>
              <div className="admin-categories-companies-list">
                {regionObj.governorates.map((gov) => (
                  <label key={gov} className="admin-categories-company-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedGovernorates.includes(gov)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGovernorates((prev) => [...prev, gov]);
                        } else {
                          setSelectedGovernorates((prev) =>
                            prev.filter((g) => g !== gov)
                          );
                        }
                      }}
                    />
                    <span>{gov}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sectors */}
        <section className="form-section">
          <div className="form-section-title">
            <span>🏷️</span>
            {t("admin.sectors")}
          </div>
          <div className="admin-categories-companies-list">
            {sectors.map((sector) => (
              <label key={sector._id} className="admin-categories-company-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(sector._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSectors((prev) => [...prev, sector._id]);
                    } else {
                      setSelectedSectors((prev) =>
                        prev.filter((id) => id !== sector._id)
                      );
                    }
                  }}
                />
                <span>{sector.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Brand Assets */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlinePhotograph />
            {t("admin.brandAssets")}
          </div>
          <div className="logo-section">
            <ImageUploader value={logo} onUpload={setLogo} />
          </div>
        </section>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? t("common.saving") : t("admin.addCompany")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCompanyPage;