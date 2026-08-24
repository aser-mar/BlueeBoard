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
import { useTranslation, Trans } from "react-i18next";

import "./AdminCompaniesPage.css";

const AdminCompaniesPage = () => {
  const { t } = useTranslation();
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
        setError(t("adminCompanies.errLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [t]);

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      t("adminCompanies.confirmDelete")
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
      alert(t("adminCompanies.errDelete"));
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
          <p className="admin-companies-header__eyebrow">{t("adminCompanies.title")}</p>
          <h1 className="admin-companies-header__title">{t("adminCompanies.title")}</h1>
          <p className="admin-companies-header__subtitle">
            {t("adminCompanies.subtitle")}
          </p>
        </div>
        <div className="admin-companies-header__icon">
          <HiOutlineOfficeBuilding />
        </div>
      </div>

      <div className="admin-companies-stats-grid">
        <article className="admin-companies-stat-card">
          <p className="admin-companies-stat-card__label">{t("adminCompanies.totalCompanies")}</p>
          <h2 className="admin-companies-stat-card__value">{totalCompanies}</h2>
          <p className="admin-companies-stat-card__note">{t("adminCompanies.totalCompaniesNote")}</p>
        </article>

        <article className="admin-companies-stat-card">
          <p className="admin-companies-stat-card__label">{t("adminCompanies.companiesWithLogo")}</p>
          <h2 className="admin-companies-stat-card__value">{companiesWithLogo}</h2>
          <p className="admin-companies-stat-card__note">{t("adminCompanies.companiesWithLogoNote")}</p>
        </article>

        <article className="admin-companies-stat-card">
          <p className="admin-companies-stat-card__label">{t("adminCompanies.companiesWithoutLogo")}</p>
          <h2 className="admin-companies-stat-card__value">{companiesWithoutLogo}</h2>
          <p className="admin-companies-stat-card__note">{t("adminCompanies.companiesWithoutLogoNote")}</p>
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
            placeholder={t("adminCompanies.searchPlaceholder")}
            aria-label={t("adminCompanies.searchPlaceholder")}
          />
        </div>
        <Link className="admin-companies-add-button" to="/admin/add-company">
          <HiOutlinePlus className="admin-companies-add-button__icon" />
          {t("adminCompanies.addCompanyBtn")}
        </Link>
      </div>

      {error && <div className="admin-companies-error">{error}</div>}

      {filteredCompanies.length === 0 ? (
        <div className="admin-companies-empty-state">
          <div className="admin-companies-empty-state__icon">🏢</div>
          <h2>{t("adminCompanies.emptyTitle")}</h2>
          <p>
            {t("adminCompanies.emptySubtitle")}
          </p>
          <Link className="admin-companies-empty-state__button" to="/admin/add-company">
            {t("adminCompanies.addFirstCompanyBtn")}
          </Link>
        </div>
      ) : (
        <>
          <div className="admin-companies-table-wrap">
            <div className="admin-companies-table-meta">
              <p>
                <Trans i18nKey="adminCompanies.showingCount" values={{ count: filteredCompanies.length }}>
                  Showing <strong>{{ count: filteredCompanies.length }}</strong> companies
                </Trans>
              </p>
            </div>
            <div className="admin-companies-table-scroll">
              <table className="admin-companies-table">
                <thead>
                  <tr>
                    <th>{t("adminCompanies.thLogo")}</th>
                    <th>{t("adminCompanies.thName")}</th>
                    <th>{t("adminCompanies.thDesc")}</th>
                    <th>{t("adminCompanies.thGovernorates")}</th>
                    <th>{t("adminCompanies.thSectors")}</th>
                    <th>{t("adminCompanies.thStatus")}</th>
                    <th>{t("adminCompanies.thActions")}</th>
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
                          {company.description || t("adminCompanies.noDesc")}
                        </div>
                      </td>
                      <td>
                        <div className="admin-companies-table__description">
                          {company.governorates?.length > 0 ? company.governorates.join(", ") : t("adminCompanies.noGovs")}
                        </div>
                      </td>
                      <td>
                        <div className="admin-companies-table__description">
                          {company.sectors?.length > 0 ? company.sectors.map(s => s.name).join(", ") : t("adminCompanies.noSectors")}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-companies-pill ${company.isActive ? "admin-companies-pill--active" : "admin-companies-pill--inactive"
                            }`}
                        >
                          {company.isActive ? t("adminCompanies.statusActive") : t("adminCompanies.statusInactive")}
                        </span>
                      </td>
                      <td>
                        <div className="admin-companies-actions">
                          <Link
                            className="admin-companies-action-button admin-companies-action-button--secondary"
                            to={`/admin/companies/${company._id}/edit`}
                          >
                            <HiOutlinePencil />
                            {t("adminCompanies.actionEdit")}
                          </Link>
                          <button
                            className="admin-companies-action-button admin-companies-action-button--danger"
                            onClick={() => deleteHandler(company._id)}
                            disabled={deleteLoadingId === company._id}
                          >
                            <HiOutlineTrash />
                            {deleteLoadingId === company._id ? t("adminCompanies.actionDeleting") : t("adminCompanies.actionDelete")}
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
                      {company.description || t("adminCompanies.noDesc")}
                    </p>
                    <p className="admin-companies-card__company-description">
                      <strong>{t("adminCompanies.thGovernorates")}:</strong> {company.governorates?.length > 0 ? company.governorates.join(", ") : t("adminCompanies.none")}
                    </p>
                    <p className="admin-companies-card__company-description">
                      <strong>{t("adminCompanies.thSectors")}:</strong> {company.sectors?.length > 0 ? company.sectors.map(s => s.name).join(", ") : t("adminCompanies.none")}
                    </p>
                  </div>
                </div>
                <div className="admin-companies-card__footer">
                  <span
                    className={`admin-companies-pill ${company.isActive ? "admin-companies-pill--active" : "admin-companies-pill--inactive"
                      }`}
                  >
                    {company.isActive ? t("adminCompanies.statusActive") : t("adminCompanies.statusInactive")}
                  </span>
                  <div className="admin-companies-actions admin-companies-actions--stacked">
                    <Link
                      className="admin-companies-action-button admin-companies-action-button--secondary"
                      to={`/admin/companies/${company._id}/edit`}
                    >
                      <HiOutlinePencil />
                      {t("adminCompanies.actionEdit")}
                    </Link>
                    <button
                      className="admin-companies-action-button admin-companies-action-button--danger"
                      onClick={() => deleteHandler(company._id)}
                      disabled={deleteLoadingId === company._id}
                    >
                      <HiOutlineTrash />
                      {deleteLoadingId === company._id ? t("adminCompanies.actionDeleting") : t("adminCompanies.actionDelete")}
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
