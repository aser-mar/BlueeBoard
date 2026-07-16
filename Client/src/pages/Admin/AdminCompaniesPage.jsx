import { useEffect, useMemo, useState } from "react";
import { getCompanies, deleteCompany } from "../../services/companyService";
import { Link } from "react-router-dom";
import {
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";

import "./AdminCompaniesPage.css";

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const totalCompanies = useMemo(() => companies.length, [companies]);
  const companiesWithLogo = useMemo(
    () => companies.filter((company) => company.logo).length,
    [companies]
  );
  const companiesWithoutLogo = useMemo(
    () => totalCompanies - companiesWithLogo,
    [totalCompanies, companiesWithLogo]
  );

  const filteredCompanies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return companies;

    return companies.filter((company) =>
      company.name?.toLowerCase().includes(query)
    );
  }, [companies, searchTerm]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data || []);
      } catch (error) {
        console.log(error);
        setError("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);
      await deleteCompany(id);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== id)
      );
    } catch (error) {
      console.log(error);
      alert("Failed to delete company");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-companies-page admin-companies-page--loading">
        <div className="admin-companies-header admin-companies-header--loading">
          <div className="admin-companies-header__details">
            <div className="skeleton skeleton--text-large"></div>
            <div className="skeleton skeleton--text-medium"></div>
            <div className="skeleton skeleton--text-sm"></div>
          </div>
          <div className="skeleton skeleton--icon"></div>
        </div>

        <div className="admin-companies-stats-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="admin-companies-skeleton-card">
              <div className="skeleton skeleton--icon-small"></div>
              <div className="skeleton skeleton--text-medium"></div>
              <div className="skeleton skeleton--text-sm"></div>
            </article>
          ))}
        </div>

        <div className="admin-companies-skeleton-table">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="admin-companies-skeleton-row">
              <div className="skeleton skeleton--row"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-companies-page">
      <div className="admin-companies-header">
        <div className="admin-companies-header__details">
          <p className="admin-companies-header__eyebrow">Manage Companies</p>
          <h1 className="admin-companies-header__title">Manage Companies</h1>
          <p className="admin-companies-header__subtitle">
            View, edit and manage all registered companies.
          </p>
        </div>
        <div className="admin-companies-header__icon">
          <HiOutlineOfficeBuilding />
        </div>
      </div>

      <div className="admin-companies-stats-grid">
        <article className="admin-companies-stat-card">
          <p className="admin-companies-stat-card__label">Total Companies</p>
          <h2 className="admin-companies-stat-card__value">{totalCompanies}</h2>
          <p className="admin-companies-stat-card__note">All registered partners</p>
        </article>

        <article className="admin-companies-stat-card">
          <p className="admin-companies-stat-card__label">Companies With Logo</p>
          <h2 className="admin-companies-stat-card__value">{companiesWithLogo}</h2>
          <p className="admin-companies-stat-card__note">Branded company profiles</p>
        </article>

        <article className="admin-companies-stat-card">
          <p className="admin-companies-stat-card__label">Companies Without Logo</p>
          <h2 className="admin-companies-stat-card__value">{companiesWithoutLogo}</h2>
          <p className="admin-companies-stat-card__note">Needs logo assets</p>
        </article>
      </div>

      <div className="admin-companies-search-card">
        <div className="admin-companies-search">
          <HiOutlineSearch className="admin-companies-search__icon" />
          <input
            className="admin-companies-search__input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company name"
            aria-label="Search company name"
          />
        </div>
        <Link className="admin-companies-add-button" to="/admin/add-company">
          <HiOutlinePlus className="admin-companies-add-button__icon" />
          Add Company
        </Link>
      </div>

      {error && <div className="admin-companies-error">{error}</div>}

      {filteredCompanies.length === 0 ? (
        <div className="admin-companies-empty-state">
          <div className="admin-companies-empty-state__icon">🏢</div>
          <h2>No companies match your search</h2>
          <p>
            Add a new company or adjust your search to continue managing the catalog.
          </p>
          <Link className="admin-companies-empty-state__button" to="/admin/add-company">
            Add first company
          </Link>
        </div>
      ) : (
        <>
          <div className="admin-companies-table-wrap">
            <div className="admin-companies-table-meta">
              <p>
                Showing <strong>{filteredCompanies.length}</strong> companies
              </p>
            </div>
            <div className="admin-companies-table-scroll">
              <table className="admin-companies-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Company Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company._id}>
                      <td>
                        <div className="admin-companies-logo-preview">
                          {company.logo ? (
                            <img src={company.logo?.url} alt={company.name || "Company logo"} />
                          ) : (
                            <div className="admin-companies-logo-placeholder">
                              <HiOutlineOfficeBuilding />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin-companies-table__name">{company.name}</div>
                      </td>
                      <td>
                        <div className="admin-companies-table__description">
                          {company.description || "No description available"}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-companies-pill ${company.isActive ? "admin-companies-pill--active" : "admin-companies-pill--inactive"
                            }`}
                        >
                          {company.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-companies-actions">
                          <Link
                            className="admin-companies-action-button admin-companies-action-button--secondary"
                            to={`/admin/companies/${company._id}/edit`}
                          >
                            <HiOutlinePencil />
                            Edit
                          </Link>
                          <button
                            className="admin-companies-action-button admin-companies-action-button--danger"
                            onClick={() => deleteHandler(company._id)}
                            disabled={deleteLoadingId === company._id}
                          >
                            <HiOutlineTrash />
                            {deleteLoadingId === company._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-companies-cards">
            {filteredCompanies.map((company) => (
              <article key={company._id} className="admin-companies-card">
                <div className="admin-companies-card__header">
                  <div className="admin-companies-logo-preview admin-companies-logo-preview--card">
                    {company.logo ? (
                      <img src={company.logo?.url} alt={company.name || "Company logo"} />
                    ) : (
                      <div className="admin-companies-logo-placeholder admin-companies-logo-placeholder--card">
                        <HiOutlineOfficeBuilding />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{company.name}</h3>
                    <p className="admin-companies-card__company-description">
                      {company.description || "No description available"}
                    </p>
                  </div>
                </div>
                <div className="admin-companies-card__footer">
                  <span
                    className={`admin-companies-pill ${company.isActive ? "admin-companies-pill--active" : "admin-companies-pill--inactive"
                      }`}
                  >
                    {company.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="admin-companies-actions admin-companies-actions--stacked">
                    <Link
                      className="admin-companies-action-button admin-companies-action-button--secondary"
                      to={`/admin/companies/${company._id}/edit`}
                    >
                      <HiOutlinePencil />
                      Edit
                    </Link>
                    <button
                      className="admin-companies-action-button admin-companies-action-button--danger"
                      onClick={() => deleteHandler(company._id)}
                      disabled={deleteLoadingId === company._id}
                    >
                      <HiOutlineTrash />
                      {deleteLoadingId === company._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCompaniesPage;
