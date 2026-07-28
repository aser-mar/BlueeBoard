import { useState, useEffect } from "react";
import { createCompany } from "../../services/companyService";
import { getSectors } from "../../services/sectorService";
import EGYPT_REGIONS from "../../constants/egyptRegions";
import ImageUploader from "../../components/ImageUploader";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePhotograph,
} from "react-icons/hi";

import "./AdminCompanyForm.css";

const AdminAddCompanyPage =
  () => {

    const [name, setName] =
      useState("");

    const [
      description,
      setDescription,
    ] = useState("");

    const [logo, setLogo] =
      useState(null);

    const [selectedGovernorates, setSelectedGovernorates] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [selectedSectors, setSelectedSectors] = useState([]);

    const [error, setError] =
      useState("");

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

    const submitHandler =
      async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

          const derivedRegions = [...new Set(selectedGovernorates.map((gov) => {
            return EGYPT_REGIONS.find((r) => r.governorates.includes(gov))?.region;
          }).filter(Boolean))];

          const companyData =
          {
            name,
            description,
            logo,
            governorates: selectedGovernorates,
            region: derivedRegions,
            sectors: selectedSectors,
          };

          await createCompany(
            companyData
          );

          alert(
            "Company Added"
          );

          setName("");

          setDescription("");

          setLogo(null);
          setSelectedGovernorates([]);
          setSelectedSectors([]);

        } catch (error) {

          console.log(
            error.response
              ?.data ||
            error.message
          );
        }
      };


    const validateForm = () => {

      if (!name.trim()) {
        setError("Please enter company name");
        return false;
      }

      if (!description.trim()) {
        setError("Please enter company description");
        return false;
      }

      if (!logo) {
        setError("Please upload company logo");
        return false;
      }

      if (selectedGovernorates.length === 0) {
        setError("Please select at least one governorate");
        return false;
      }

      if (selectedSectors.length === 0) {
        setError("Please select at least one sector");
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
            <h1>Add Company</h1>
            <p>Create a new company profile and make it available on the marketplace.</p>
          </div>
        </header>

        {error && <div className="company-error" role="status">{error}</div>}

        <form onSubmit={submitHandler} className="company-form">
          {/* Company Information */}
          <section className="form-section">
            <div className="form-section-title">
              <span>📋</span>
              Company Information
            </div>
            <div className="form-group">
              <label htmlFor="name">Company Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter detailed company description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </section>

          {/* Governorates & Regions */}
          <section className="form-section">
            <div className="form-section-title">
              <span>📍</span>
              Governorates &amp; Regions
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
                            setSelectedGovernorates((prev) => prev.filter((g) => g !== gov));
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
              Sectors
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
                        setSelectedSectors((prev) => prev.filter((id) => id !== sector._id));
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
              Brand Assets
            </div>
            <div className="logo-section">
              <ImageUploader
                value={logo}
                onUpload={setLogo}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Add Company
            </button>
          </div>
        </form>
      </div>
    );
  };

export default
  AdminAddCompanyPage;