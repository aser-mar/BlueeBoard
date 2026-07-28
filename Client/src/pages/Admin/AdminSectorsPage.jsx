import { useEffect, useMemo, useState } from "react";
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
        setError("Failed to load sectors");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API]);

  const addSector = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter sector name");
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
      setError("Failed to add sector");
    }
  };

  const startEdit = (sec) => {
    setEditingId(sec._id);
    setEditName(sec.name);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      alert("Please enter sector name");
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
      alert("Failed to update sector");
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteSector = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sector?"
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
      alert("Failed to delete sector");
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
          <p className="admin-sectors-header__eyebrow">Manage Sectors</p>
          <h1 className="admin-sectors-header__title">Manage Sectors</h1>
          <p className="admin-sectors-header__subtitle">
            Organize products and maintain a clean marketplace structure.
          </p>
        </div>
        <div className="admin-sectors-header__icon">
          <HiOutlineTag />
        </div>
      </div>

      <div className="admin-sectors-stats-grid">
        <article className="admin-sectors-stat-card">
          <p className="admin-sectors-stat-card__label">Total Sectors</p>
          <h2 className="admin-sectors-stat-card__value">{totalSectors}</h2>
          <p className="admin-sectors-stat-card__note">All sectors in the marketplace</p>
        </article>

        <article className="admin-sectors-stat-card">
          <p className="admin-sectors-stat-card__label">Recently Added</p>
          <h2 className="admin-sectors-stat-card__value">{recentSectorsCount}</h2>
          <p className="admin-sectors-stat-card__note">Added in the last 7 days</p>
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
            placeholder="Search sector name"
            aria-label="Search sector name"
          />
        </div>
      </div>

      <form className="admin-sectors-form-card" onSubmit={addSector}>
        <div className="admin-sectors-form-grid">
          <div className="admin-sectors-form-field">
            <label htmlFor="sector-name">Sector Name</label>
            <input
              id="sector-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type sector name"
            />
          </div>
          <button className="admin-sectors-submit-button" type="submit">
            <HiOutlinePlus className="admin-sectors-submit-button__icon" />
            Create Sector
          </button>
        </div>
      </form>

      {error && <div className="admin-sectors-error">{error}</div>}

      {filteredSectors.length === 0 ? (
        <div className="admin-sectors-empty-state">
          <div className="admin-sectors-empty-state__icon">🏷️</div>
          <h2>No sectors found</h2>
          <p>Use the form above to add a new sector and keep the catalog organized.</p>
        </div>
      ) : (
        <>
          <div className="admin-sectors-table-wrap">
            <div className="admin-sectors-table-meta">
              <p>
                Showing <strong>{filteredSectors.length}</strong> sectors
              </p>
            </div>
            <div className="admin-sectors-table-scroll">
              <table className="admin-sectors-table">
                <thead>
                  <tr>
                    <th>Sector Name</th>
                    <th>Created Date</th>
                    <th>Actions</th>
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
                              {actionLoadingId === sec._id ? "Saving..." : "Save"}
                            </button>
                          ) : (
                            <button
                              className="admin-sectors-action-button admin-sectors-action-button--secondary"
                              type="button"
                              onClick={() => startEdit(sec)}
                            >
                              <HiOutlinePencil />
                              Edit
                            </button>
                          )}
                          <button
                            className="admin-sectors-action-button admin-sectors-action-button--danger"
                            type="button"
                            onClick={() => deleteSector(sec._id)}
                            disabled={actionLoadingId === sec._id}
                          >
                            <HiOutlineTrash />
                            {actionLoadingId === sec._id ? "Deleting..." : "Delete"}
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
                    <p className="admin-sectors-card__label">Sector</p>
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
                        {actionLoadingId === sec._id ? "Saving..." : "Save"}
                      </button>
                    ) : (
                      <button
                        className="admin-sectors-action-button admin-sectors-action-button--secondary"
                        type="button"
                        onClick={() => startEdit(sec)}
                      >
                        <HiOutlinePencil />
                        Edit
                      </button>
                    )}
                    <button
                      className="admin-sectors-action-button admin-sectors-action-button--danger"
                      type="button"
                      onClick={() => deleteSector(sec._id)}
                      disabled={actionLoadingId === sec._id}
                    >
                      <HiOutlineTrash />
                      {actionLoadingId === sec._id ? "Deleting..." : "Delete"}
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
