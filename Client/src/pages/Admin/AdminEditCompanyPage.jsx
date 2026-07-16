import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanyById, updateCompany } from "../../services/companyService";
import ImageUploader from "../../components/ImageUploader";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePhotograph,
} from "react-icons/hi";

import "./AdminCompanyForm.css";

const AdminEditCompanyPage =
  () => {

    const { id } =
      useParams();

    const navigate =
      useNavigate();

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

    const [loading, setLoading] =
      useState(true);

    // const [imgError,
    //   setImgError] =
    //   useState(false);

    // Image upload handled by ImageUploader component

    useEffect(() => {

      const fetchCompany =
        async () => {

          try {

            setLoading(true);

            const data =
              await getCompanyById(
                id
              );

            setName(
              data.name || ""
            );

            setDescription(
              data.description ||
              ""
            );

            setLogo(
              data.logo || null
            );

          } catch (error) {

            console.log(error);

          } finally {

            setLoading(false);
          }
        };

      fetchCompany();

    }, [id]);

    // Upload handled by ImageUploader

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

          await updateCompany(
            id,
            companyData
          );

          alert(
            "Company Updated"
          );

          navigate(
            "/admin/companies"
          );

        } catch (error) {

          console.log(error);
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

    if (loading) {
      return (
        <div className="company-form-container">
          <div className="skeleton-hero" />
        </div>
      );
    }

    return (
      <div className="company-form-container">
        <header className="company-hero">
          <div className="company-hero-icon">
            <HiOutlineOfficeBuilding />
          </div>
          <div className="company-hero-text">
            <h1>Edit Company</h1>
            <p>Update company information and branding details.</p>
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
              {/* {logo?.url && !imgError ? (
                <div className="logo-preview-container">
                  <img
                    src={logo?.url}
                    alt="company logo preview"
                    className="logo-preview"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : logo?.url && imgError ? (
                <div className="logo-fallback">No Logo</div>
              ) : null} */}
              <ImageUploader
                value={logo}
                onUpload={setLogo}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  };

export default
  AdminEditCompanyPage;