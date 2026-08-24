import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCompanyManagers, deleteCompanyManager } from "../../services/companyManagerService";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlinePencil,
} from "react-icons/hi";

import "./AdminCompanyManagersPage.css";

const AdminCompanyManagersPage = () => {
  const { t } = useTranslation();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const totalManagers = useMemo(() => managers.length, [managers]);

  const totalCompaniesAssigned = useMemo(() => {
    const setOfCompanies = new Set();
    managers.forEach((manager) => {
      const company = manager.company;
      if (company) {
        const name = typeof company === "string" ? company.trim() : company.name?.trim();
        if (name) {
          setOfCompanies.add(name);
        }
      }
    });
    return setOfCompanies.size;
  }, [managers]);

  const activeManagersCount = useMemo(() => {
    return managers.filter(
      (manager) => manager.isActive !== false && manager.status !== "inactive"
    ).length;
  }, [managers]);

  const filteredManagers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return managers;

    return managers.filter((manager) => {
      const name = manager.name?.toLowerCase() || "";
      const email = manager.email?.toLowerCase() || "";
      const companyName =
        typeof manager.company === "string"
          ? manager.company.toLowerCase()
          : manager.company?.name?.toLowerCase() || "";
      return (
        name.includes(query) ||
        email.includes(query) ||
        companyName.includes(query)
      );
    });
  }, [managers, searchTerm]);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const data = await getCompanyManagers();
        setManagers(data || []);
      } catch (err) {
        console.error(err);
        setError(t("adminManagers.errLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadManagers();
  }, []);

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      t("adminManagers.confirmDelete")
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);
      await deleteCompanyManager(id);

      setManagers((prev) =>
        prev.filter((manager) => manager._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert(t("adminManagers.errDelete"));
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-company-managers-page admin-company-managers-page--loading">
        <div className="admin-company-managers-header admin-company-managers-header--loading">
          <div className="admin-company-managers-header__details">
            <div className="skeleton skeleton--text-large"></div>
            <div className="skeleton skeleton--text-medium"></div>
            <div className="skeleton skeleton--text-sm"></div>
          </div>
          <div className="skeleton skeleton--icon"></div>
        </div>

        <div className="admin-company-managers-stats-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="admin-company-managers-skeleton-card">
              <div className="skeleton skeleton--icon-small"></div>
              <div className="skeleton skeleton--text-medium"></div>
              <div className="skeleton skeleton--text-sm"></div>
            </div>
          ))}
        </div>

        <div className="admin-company-managers-skeleton-table">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="admin-company-managers-skeleton-row">
              <div className="skeleton skeleton--row"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-company-managers-page">
      <div className="admin-company-managers-header">
        <div className="admin-company-managers-header__details">
          <p className="admin-company-managers-header__eyebrow">{t("adminManagers.title")}</p>
          <h1 className="admin-company-managers-header__title">{t("adminManagers.title")}</h1>
          <p className="admin-company-managers-header__subtitle">
            {t("adminManagers.subtitle")}
          </p>
        </div>
        <div className="admin-company-managers-header__icon">
          <HiOutlineUser />
        </div>
      </div>

      <div className="admin-company-managers-stats-grid">
        <article className="admin-company-managers-stat-card">
          <p className="admin-company-managers-stat-card__label">{t("adminManagers.total")}</p>
          <h2 className="admin-company-managers-stat-card__value">{totalManagers}</h2>
          <p className="admin-company-managers-stat-card__note">{t("adminManagers.totalNote")}</p>
        </article>

        <article className="admin-company-managers-stat-card">
          <p className="admin-company-managers-stat-card__label">{t("adminManagers.assigned")}</p>
          <h2 className="admin-company-managers-stat-card__value">{totalCompaniesAssigned}</h2>
          <p className="admin-company-managers-stat-card__note">{t("adminManagers.assignedNote")}</p>
        </article>

        <article className="admin-company-managers-stat-card">
          <p className="admin-company-managers-stat-card__label">{t("adminManagers.active")}</p>
          <h2 className="admin-company-managers-stat-card__value">{activeManagersCount}</h2>
          <p className="admin-company-managers-stat-card__note">{t("adminManagers.activeNote")}</p>
        </article>
      </div>

      <div className="admin-company-managers-search-card">
        <div className="admin-company-managers-search">
          <HiOutlineSearch className="admin-company-managers-search__icon" />
          <input
            className="admin-company-managers-search__input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("adminManagers.searchPlaceholder")}
            aria-label="Search managers"
          />
        </div>
        <Link className="admin-company-managers-add-button" to="/admin/company-managers/add">
          {t("adminManagers.addBtn")}
        </Link>
      </div>

      {error && <div className="admin-company-managers-error">{error}</div>}

      {filteredManagers.length === 0 ? (
        <div className="admin-company-managers-empty-state">
          <div className="admin-company-managers-empty-state__icon">👥</div>
          <h2>{t("adminManagers.emptyTitle")}</h2>
          <p>
            {t("adminManagers.emptyDesc")}
          </p>
          <Link className="admin-company-managers-empty-state__button" to="/admin/company-managers/add">
            {t("adminManagers.addBtn")}
          </Link>
        </div>
      ) : (
        <>
          <div className="admin-company-managers-table-wrap">
            <div className="admin-company-managers-table-meta">
              <p>
                {t("adminManagers.showing", { count: filteredManagers.length })}
              </p>
            </div>

            <div className="admin-company-managers-table-scroll">
              <table className="admin-company-managers-table">
                <thead>
                  <tr>
                    <th>{t("adminManagers.thName")}</th>
                    <th>{t("adminManagers.thEmail")}</th>
                    <th>{t("adminManagers.thCompany")}</th>
                    <th>{t("adminManagers.createdDate")}</th>
                    <th>{t("adminManagers.thActions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagers.map((manager) => (
                    <tr key={manager._id}>
                      <td>
                        <div className="admin-company-managers-table__name">{manager.name}</div>
                      </td>
                      <td>{manager.email}</td>
                      <td>
                        {typeof manager.company === "string"
                          ? manager.company
                          : manager.company?.name || "—"}
                      </td>
                      <td>
                        {manager.createdAt
                          ? new Date(manager.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div className="admin-company-managers-actions">
                          <Link
                            to={`/admin/company-managers/${manager._id}/edit`}
                            className="admin-company-managers-action-button"
                          >
                            <HiOutlinePencil className="admin-company-managers-action-button__icon" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                            {t("common.edit")}
                          </Link>
                          <button
                            className="admin-company-managers-action-button admin-company-managers-action-button--danger"
                            onClick={() => deleteHandler(manager._id)}
                            disabled={deleteLoadingId === manager._id}
                          >
                            {deleteLoadingId === manager._id ? t("common.deleting") : t("common.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-company-managers-cards">
            {filteredManagers.map((manager) => (
              <article key={manager._id} className="admin-company-managers-card">
                <div
                  className="admin-company-managers-card__preview"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(79, 70, 229, 0.08))",
                    color: "var(--bb-blue)",
                  }}
                >
                  <HiOutlineUser style={{ fontSize: "2.5rem" }} />
                </div>
                <div className="admin-company-managers-card__content">
                  <div>
                    <h3>{manager.name}</h3>
                    <p className="admin-company-managers-card__company">
                      Email: {manager.email}
                    </p>
                    <p className="admin-company-managers-card__company">
                      {t("adminManagers.thCompany")}: {typeof manager.company === "string" ? manager.company : manager.company?.name || "—"}
                    </p>
                    <p className="admin-company-managers-card__placement">
                      {t("adminManagers.createdDate")}: {manager.createdAt ? new Date(manager.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="admin-company-managers-card__footer">
                    <div className="admin-company-managers-actions admin-company-managers-actions--stacked">
                      <Link
                        to={`/admin/company-managers/${manager._id}/edit`}
                        className="admin-company-managers-action-button"
                      >
                        <HiOutlinePencil className="admin-company-managers-action-button__icon" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                        {t("common.edit")}
                      </Link>
                      <button
                        className="admin-company-managers-action-button admin-company-managers-action-button--danger"
                        onClick={() => deleteHandler(manager._id)}
                        disabled={deleteLoadingId === manager._id}
                      >
                        {deleteLoadingId === manager._id ? t("common.deleting") : t("common.delete")}
                      </button>
                    </div>
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

export default AdminCompanyManagersPage;