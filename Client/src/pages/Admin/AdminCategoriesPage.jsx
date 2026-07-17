import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { getCompanies } from "../../services/companyService";
import {
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";

import "./AdminCategoriesPage.css";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCompanies, setEditCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API = "/categories";

  const totalCategories = useMemo(() => categories.length, [categories]);

  const companiesUsingCategories = useMemo(() => {
    const companyIds = new Set(
      categories.flatMap((cat) =>
        (cat.companies || []).map((company) =>
          company._id || company
        )
      )
    );
    return companyIds.size;
  }, [categories]);

  const recentCategoriesCount = useMemo(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 7);
    return categories.filter(
      (cat) => cat.createdAt && new Date(cat.createdAt) >= threshold
    ).length;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((cat) => cat.name?.toLowerCase().includes(query));
  }, [categories, searchTerm]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesRes = await api.get(API);
        setCategories(categoriesRes.data || []);
        const companiesData = await getCompanies();
        setCompanies(companiesData || []);
      } catch (error) {
        console.log(error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [API]);

  const addCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter category name");
      return;
    }

    if (selectedCompanies.length === 0) {
      setError("Please select at least one company");
      return;
    }

    setError("");

    try {
      setError("");
      await api.post(API, {
      name,
      companies: selectedCompanies,
    });

      const { data } = await api.get(API);
      setCategories(data || []);
      setName("");
      setSelectedCompanies([]);
    } catch (error) {
      console.log(error);
      setError("Failed to add category");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);

    setEditCompanies(
      (cat.companies || []).map((c) =>
        c._id || c
      )
    );
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      alert("Please enter category name");
      return;
    }

    if (editCompanies.length === 0) {
      alert("Please select at least one company");
      return;
    }

    try {
      setActionLoadingId(id);
      await api.put(`${API}/${id}`, {
      name: editName,
      companies: editCompanies,
    });

      const { data } = await api.get(API);
      setCategories(data);
      setEditingId(null);
      setEditName("");
    } catch (error) {
      console.log(error);
      alert("Failed to update category");
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoadingId(id);
      await api.delete(`${API}/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete category");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-categories-page admin-categories-page--loading">
        <div className="admin-categories-header admin-categories-header--loading">
          <div className="admin-categories-header__details">
            <div className="skeleton skeleton--text-large"></div>
            <div className="skeleton skeleton--text-medium"></div>
            <div className="skeleton skeleton--text-sm"></div>
          </div>
          <div className="skeleton skeleton--icon"></div>
        </div>

        <div className="admin-categories-stats-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="admin-categories-skeleton-card">
              <div className="skeleton skeleton--icon-small"></div>
              <div className="skeleton skeleton--text-medium"></div>
              <div className="skeleton skeleton--text-sm"></div>
            </article>
          ))}
        </div>

        <div className="admin-categories-skeleton-table">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="admin-categories-skeleton-row">
              <div className="skeleton skeleton--row"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-categories-page">
      <div className="admin-categories-header">
        <div className="admin-categories-header__details">
          <p className="admin-categories-header__eyebrow">Manage Categories</p>
          <h1 className="admin-categories-header__title">Manage Categories</h1>
          <p className="admin-categories-header__subtitle">
            Organize products and maintain a clean marketplace structure.
          </p>
        </div>
        <div className="admin-categories-header__icon">
          <HiOutlineOfficeBuilding />
        </div>
      </div>

      <div className="admin-categories-stats-grid">
        <article className="admin-categories-stat-card">
          <p className="admin-categories-stat-card__label">Total Categories</p>
          <h2 className="admin-categories-stat-card__value">{totalCategories}</h2>
          <p className="admin-categories-stat-card__note">All categories in the marketplace</p>
        </article>

        <article className="admin-categories-stat-card">
          <p className="admin-categories-stat-card__label">Companies Using Categories</p>
          <h2 className="admin-categories-stat-card__value">{companiesUsingCategories}</h2>
          <p className="admin-categories-stat-card__note">Active category owners</p>
        </article>

        <article className="admin-categories-stat-card">
          <p className="admin-categories-stat-card__label">Recently Added</p>
          <h2 className="admin-categories-stat-card__value">{recentCategoriesCount}</h2>
          <p className="admin-categories-stat-card__note">Added in the last 7 days</p>
        </article>
      </div>

      <div className="admin-categories-actions-row">
        <div className="admin-categories-search-card">
          <HiOutlineSearch className="admin-categories-search__icon" />
          <input
            className="admin-categories-search__input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category name"
            aria-label="Search category name"
          />
        </div>
      </div>

      <form className="admin-categories-form-card" onSubmit={addCategory}>
        <div className="admin-categories-form-grid">
          <div className="admin-categories-form-field">
            <label htmlFor="category-name">Category Name</label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type category name"
            />
          </div>
          <div className="admin-categories-form-field">
            <label htmlFor="category-company">Company</label>
            <div className="admin-categories-companies-list">
              {companies.map((comp) => (
                <label
                  key={comp._id}
                  className="admin-categories-company-checkbox"
                >
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(comp._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCompanies((prev) => [
                          ...prev,
                          comp._id,
                        ]);
                      } else {
                        setSelectedCompanies((prev) =>
                          prev.filter((id) => id !== comp._id)
                        );
                      }
                    }}
                  />
                  <span>{comp.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="admin-categories-submit-button" type="submit">
            <HiOutlinePlus className="admin-categories-submit-button__icon" />
            Create Category
          </button>
        </div>
      </form>

      {error && <div className="admin-categories-error">{error}</div>}

      {filteredCategories.length === 0 ? (
        <div className="admin-categories-empty-state">
          <div className="admin-categories-empty-state__icon">🏷️</div>
          <h2>No categories found</h2>
          <p>Use the form above to add a new category and keep the catalog organized.</p>
        </div>
      ) : (
        <>
          <div className="admin-categories-table-wrap">
            <div className="admin-categories-table-meta">
              <p>
                Showing <strong>{filteredCategories.length}</strong> categories
              </p>
            </div>
            <div className="admin-categories-table-scroll">
              <table className="admin-categories-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Company</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        {editingId === cat._id ? (
                          <div>
                            <input
                              className="admin-categories-table-input"
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />

                            <div
                              style={{
                                marginTop: "10px",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                              }}
                            >
                              {companies.map((comp) => (
                                <label key={comp._id}>
                                  <input
                                    type="checkbox"
                                    checked={editCompanies.includes(comp._id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditCompanies([
                                          ...editCompanies,
                                          comp._id,
                                        ]);
                                      } else {
                                        setEditCompanies(
                                          editCompanies.filter(
                                            (id) => id !== comp._id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  {" "}
                                  {comp.name}
                                </label>
                              ))}
                            </div>
                          </div>
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td>
                        {cat.companies?.length
                          ? cat.companies
                            .map((company) => company.name)
                            .join(", ")
                          : "No Companies"}
                      </td>
                      <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-categories-actions">
                          {editingId === cat._id ? (
                            <button
                              className="admin-categories-action-button admin-categories-action-button--secondary"
                              type="button"
                              onClick={() => saveEdit(cat._id)}
                              disabled={actionLoadingId === cat._id}
                            >
                              <HiOutlinePencil />
                              {actionLoadingId === cat._id ? "Saving..." : "Save"}
                            </button>
                          ) : (
                            <button
                              className="admin-categories-action-button admin-categories-action-button--secondary"
                              type="button"
                              onClick={() => startEdit(cat)}
                            >
                              <HiOutlinePencil />
                              Edit
                            </button>
                          )}
                          <button
                            className="admin-categories-action-button admin-categories-action-button--danger"
                            type="button"
                            onClick={() => deleteCategory(cat._id)}
                            disabled={actionLoadingId === cat._id}
                          >
                            <HiOutlineTrash />
                            {actionLoadingId === cat._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-categories-cards">
            {filteredCategories.map((cat) => (
              <article key={cat._id} className="admin-categories-card">
                <div className="admin-categories-card__row">
                  <div>
                    <p className="admin-categories-card__label">Category</p>
                    <h3>{cat.name}</h3>
                  </div>
                  <span className="admin-categories-created-date">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="admin-categories-card__row admin-categories-card__row--gap">
                  <div>
                    <p className="admin-categories-card__label">Company</p>
                    <p className="admin-categories-card__company">
                      {cat.companies?.length
                        ? cat.companies
                          .map((company) => company.name)
                          .join(", ")
                        : "No Companies"}
                    </p>
                  </div>
                  <div className="admin-categories-actions admin-categories-actions--stacked">
                    {editingId === cat._id ? (
                      <button
                        className="admin-categories-action-button admin-categories-action-button--secondary"
                        type="button"
                        onClick={() => saveEdit(cat._id)}
                        disabled={actionLoadingId === cat._id}
                      >
                        <HiOutlinePencil />
                        {actionLoadingId === cat._id ? "Saving..." : "Save"}
                      </button>
                    ) : (
                      <button
                        className="admin-categories-action-button admin-categories-action-button--secondary"
                        type="button"
                        onClick={() => startEdit(cat)}
                      >
                        <HiOutlinePencil />
                        Edit
                      </button>
                    )}
                    <button
                      className="admin-categories-action-button admin-categories-action-button--danger"
                      type="button"
                      onClick={() => deleteCategory(cat._id)}
                      disabled={actionLoadingId === cat._id}
                    >
                      <HiOutlineTrash />
                      {actionLoadingId === cat._id ? "Deleting..." : "Delete"}
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

export default AdminCategoriesPage;