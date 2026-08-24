import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import {
  HiOutlineTag,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";

import "./AdminSectorsPage.css";

const AdminSectorsPage = () => {
  const { t } = useTranslation();
  const [sectors, setSectors] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API = "/sectors";

  const totalSectors = useMemo(() => sectors.length, [sectors]);

  const recentSectorsCount = useMemo(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 7);
    return sectors.filter(
      (sec) => sec.createdAt && new Date(sec.createdAt) >= threshold
    ).length;
  }, [sectors]);

  const filteredSectors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sectors;
    return sectors.filter((sec) => sec.name?.toLowerCase().includes(query));
  }, [sectors, searchTerm]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sectorsRes = await api.get(API);
        setSectors(sectorsRes.data || []);
      } catch (error) {
        console.log(error);
        setError(t("adminSectors.errLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API]);

  const addSector = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t("adminSectors.errName"));
      return;
    }

    setError("");

    try {
      setError("");
      await api.post(API, {
      name,
    });

      const { data } = await api.get(API);
      setSectors(data || []);
      setName("");
    } catch (error) {
      console.log(error);
      setError(t("adminSectors.errAdd"));
    }
  };

  const startEdit = (sec) => {
    setEditingId(sec._id);
    setEditName(sec.name);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      alert(t("adminSectors.errName"));
      return;
    }

    try {
      setActionLoadingId(id);
      await api.put(`${API}/${id}`, {
      name: editName,
    });

      const { data } = await api.get(API);
      setSectors(data);
      setEditingId(null);
      setEditName("");
    } catch (error) {
      console.log(error);
      alert(t("adminSectors.errUpdate"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteSector = async (id) => {
    const confirmDelete = window.confirm(
      t("adminSectors.confirmDelete")
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoadingId(id);
      await api.delete(`${API}/${id}`);
      setSectors((prev) => prev.filter((sec) => sec._id !== id));
    } catch (error) {
      console.log(error);
      alert(t("adminSectors.errDelete"));
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-sectors-page admin-sectors-page--loading">
        <div className="admin-sectors-header admin-sectors-header--loading">
          <div className="admin-sectors-header__details">
            <div className="skeleton skeleton--text-large"></div>
            <div className="skeleton skeleton--text-medium"></div>
            <div className="skeleton skeleton--text-sm"></div>
          </div>
          <div className="skeleton skeleton--icon"></div>
        </div>

        <div className="admin-sectors-stats-grid">
          {Array.from({ length: 2 }).map((_, index) => (
            <article key={index} className="admin-sectors-skeleton-card">
              <div className="skeleton skeleton--icon-small"></div>
              <div className="skeleton skeleton--text-medium"></div>
              <div className="skeleton skeleton--text-sm"></div>
            </article>
          ))}
        </div>

        <div className="admin-sectors-skeleton-table">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="admin-sectors-skeleton-row">
              <div className="skeleton skeleton--row"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-sectors-page">
      <div className="admin-sectors-header">
        <div className="admin-sectors-header__details">
          <p className="admin-sectors-header__eyebrow">{t("adminSectors.title")}</p>
          <h1 className="admin-sectors-header__title">{t("adminSectors.title")}</h1>
          <p className="admin-sectors-header__subtitle">
            {t("adminSectors.subtitle")}
          </p>
        </div>
        <div className="admin-sectors-header__icon">
          <HiOutlineTag />
        </div>
      </div>

      <div className="admin-sectors-stats-grid">
        <article className="admin-sectors-stat-card">
          <p className="admin-sectors-stat-card__label">{t("adminSectors.total")}</p>
          <h2 className="admin-sectors-stat-card__value">{totalSectors}</h2>
          <p className="admin-sectors-stat-card__note">{t("adminSectors.totalNote")}</p>
        </article>

        <article className="admin-sectors-stat-card">
          <p className="admin-sectors-stat-card__label">{t("adminSectors.recent")}</p>
          <h2 className="admin-sectors-stat-card__value">{recentSectorsCount}</h2>
          <p className="admin-sectors-stat-card__note">{t("adminSectors.recentNote")}</p>
        </article>
      </div>

      <div className="admin-sectors-actions-row">
        <div className="admin-sectors-search-card">
          <HiOutlineSearch className="admin-sectors-search__icon" />
          <input
            className="admin-sectors-search__input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("adminSectors.searchPlaceholder")}
            aria-label={t("adminSectors.searchPlaceholder")}
          />
        </div>
      </div>

      <form className="admin-sectors-form-card" onSubmit={addSector}>
        <div className="admin-sectors-form-grid">
          <div className="admin-sectors-form-field">
            <label htmlFor="sector-name">{t("adminSectors.nameLabel")}</label>
            <input
              id="sector-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("adminSectors.namePlaceholder")}
            />
          </div>
          <button className="admin-sectors-submit-button" type="submit">
            <HiOutlinePlus className="admin-sectors-submit-button__icon" />
            {t("adminSectors.createBtn")}
          </button>
        </div>
      </form>

      {error && <div className="admin-sectors-error">{error}</div>}

      {filteredSectors.length === 0 ? (
        <div className="admin-sectors-empty-state">
          <div className="admin-sectors-empty-state__icon">🏷️</div>
          <h2>{t("adminSectors.emptyTitle")}</h2>
          <p>{t("adminSectors.emptyDesc")}</p>
        </div>
      ) : (
        <>
          <div className="admin-sectors-table-wrap">
            <div className="admin-sectors-table-meta">
              <p>
                {t("adminSectors.showing", { count: filteredSectors.length })}
              </p>
            </div>
            <div className="admin-sectors-table-scroll">
              <table className="admin-sectors-table">
                <thead>
                  <tr>
                    <th>{t("adminSectors.sectorLabel")}</th>
                    <th>{t("adminSectors.createdDate")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSectors.map((sec) => (
                    <tr key={sec._id}>
                      <td>
                        {editingId === sec._id ? (
                          <div>
                            <input
                              className="admin-sectors-table-input"
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </div>
                        ) : (
                          sec.name
                        )}
                      </td>
                      <td>{new Date(sec.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-sectors-actions">
                          {editingId === sec._id ? (
                            <button
                              className="admin-sectors-action-button admin-sectors-action-button--secondary"
                              type="button"
                              onClick={() => saveEdit(sec._id)}
                              disabled={actionLoadingId === sec._id}
                            >
                              <HiOutlinePencil />
                              {actionLoadingId === sec._id ? t("common.saving") : t("common.save")}
                            </button>
                          ) : (
                            <button
                              className="admin-sectors-action-button admin-sectors-action-button--secondary"
                              type="button"
                              onClick={() => startEdit(sec)}
                            >
                              <HiOutlinePencil />
                              {t("common.edit")}
                            </button>
                          )}
                          <button
                            className="admin-sectors-action-button admin-sectors-action-button--danger"
                            type="button"
                            onClick={() => deleteSector(sec._id)}
                            disabled={actionLoadingId === sec._id}
                          >
                            <HiOutlineTrash />
                            {actionLoadingId === sec._id ? t("common.deleting") : t("common.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-sectors-cards">
            {filteredSectors.map((sec) => (
              <article key={sec._id} className="admin-sectors-card">
                <div className="admin-sectors-card__row">
                  <div>
                    <p className="admin-sectors-card__label">{t("adminSectors.sectorLabel")}</p>
                    <h3>{sec.name}</h3>
                  </div>
                  <span className="admin-sectors-created-date">
                    {new Date(sec.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="admin-sectors-card__row admin-sectors-card__row--gap">
                  <div className="admin-sectors-actions admin-sectors-actions--stacked">
                    {editingId === sec._id ? (
                      <button
                        className="admin-sectors-action-button admin-sectors-action-button--secondary"
                        type="button"
                        onClick={() => saveEdit(sec._id)}
                        disabled={actionLoadingId === sec._id}
                      >
                        <HiOutlinePencil />
                        {actionLoadingId === sec._id ? t("common.saving") : t("common.save")}
                      </button>
                    ) : (
                      <button
                        className="admin-sectors-action-button admin-sectors-action-button--secondary"
                        type="button"
                        onClick={() => startEdit(sec)}
                      >
                        <HiOutlinePencil />
                        {t("common.edit")}
                      </button>
                    )}
                    <button
                      className="admin-sectors-action-button admin-sectors-action-button--danger"
                      type="button"
                      onClick={() => deleteSector(sec._id)}
                      disabled={actionLoadingId === sec._id}
                    >
                      <HiOutlineTrash />
                      {actionLoadingId === sec._id ? t("common.deleting") : t("common.delete")}
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

export default AdminSectorsPage;
