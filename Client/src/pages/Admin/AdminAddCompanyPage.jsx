import { useState } from "react";
import { createCompany } from "../../services/companyService";
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

    const [error, setError] =
      useState("");

    // Image upload handled by ImageUploader component

    const submitHandler =
      async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

          const companyData =
          {
            name,
            description,
            logo,
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