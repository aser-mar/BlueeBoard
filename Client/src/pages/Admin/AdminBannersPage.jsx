import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBanners, deleteBanner } from "../../services/bannerService";
import {
  HiOutlinePhotograph,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";

import "./AdminBannersPage.css";

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  const totalBanners = useMemo(() => banners.length, [banners]);
  const activeBanners = useMemo(
    () => banners.filter((banner) => banner.isActive).length,
    [banners]
  );
  const hiddenBanners = useMemo(
    () => totalBanners - activeBanners,
    [totalBanners, activeBanners]
  );

  const filteredBanners = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return banners;
    return banners.filter((banner) => banner.title?.toLowerCase().includes(query));
  }, [banners, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBanners();
        setBanners(data || []);
      } catch (error) {
        console.log(error);
        setError("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm("Delete this banner?");
    if (!confirmDelete) return;

    try {
      setActionLoadingId(id);
      await deleteBanner(id);
      const data = await getBanners();
      setBanners(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-banners-page admin-banners-page--loading">
        <div className="admin-banners-header admin-banners-header--loading">
          <div className="admin-banners-header__details">
            <div className="skeleton skeleton--text-large"></div>
            <div className="skeleton skeleton--text-medium"></div>
            <div className="skeleton skeleton--text-sm"></div>
          </div>
          <div className="skeleton skeleton--icon"></div>
        </div>

        <div className="admin-banners-stats-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="admin-banners-skeleton-card">
              <div className="skeleton skeleton--icon-small"></div>
              <div className="skeleton skeleton--text-medium"></div>
              <div className="skeleton skeleton--text-sm"></div>
            </article>
          ))}
        </div>

        <div className="admin-banners-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="admin-banners-card admin-banners-card--loading">
              <div className="skeleton skeleton--image"></div>
              <div className="skeleton skeleton--text-large"></div>
              <div className="skeleton skeleton--text-medium"></div>
              <div className="skeleton skeleton--text-sm"></div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-banners-page">
      <div className="admin-banners-header">
        <div className="admin-banners-header__details">
          <p className="admin-banners-header__eyebrow">Manage Banners</p>
          <h1 className="admin-banners-header__title">Manage Banners</h1>
          <p className="admin-banners-header__subtitle">
            Create and manage promotional banners displayed across the platform.
          </p>
        </div>
        <div className="admin-banners-header__icon">
          <HiOutlinePhotograph />
        </div>
      </div>

      <div className="admin-banners-stats-grid">
        <article className="admin-banners-stat-card">
          <p className="admin-banners-stat-card__label">Total Banners</p>
          <h2 className="admin-banners-stat-card__value">{totalBanners}</h2>
          <p className="admin-banners-stat-card__note">All active and hidden banners</p>
        </article>

        <article className="admin-banners-stat-card">
          <p className="admin-banners-stat-card__label">Active Banners</p>
          <h2 className="admin-banners-stat-card__value">{activeBanners}</h2>
          <p className="admin-banners-stat-card__note">Displayed throughout the platform</p>
        </article>

        <article className="admin-banners-stat-card">
          <p className="admin-banners-stat-card__label">Hidden Banners</p>
          <h2 className="admin-banners-stat-card__value">{hiddenBanners}</h2>
          <p className="admin-banners-stat-card__note">Currently inactive promotions</p>
        </article>
      </div>

      <div className="admin-banners-search-card">
        <div className="admin-banners-search">
          <HiOutlineSearch className="admin-banners-search__icon" />
          <input
            className="admin-banners-search__input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search banners by title"
            aria-label="Search banners by title"
          />
        </div>
        <Link className="admin-banners-add-button" to="/admin/add-banner">
          <HiOutlinePlus className="admin-banners-add-button__icon" />
          Add Banner
        </Link>
      </div>

      {error && <div className="admin-banners-error">{error}</div>}

      {filteredBanners.length === 0 ? (
        <div className="admin-banners-empty-state">
          <div className="admin-banners-empty-state__icon">🖼️</div>
          <h2>No banners found</h2>
          <p>
            Add a new banner or clear the search to manage promotional content across your platform.
          </p>
        </div>
      ) : (
        <div className="admin-banners-grid">
          {filteredBanners.map((banner) => (
            <article key={banner._id} className="admin-banners-card">
              <div className="admin-banners-card__preview">
                {banner.image ? (
                  <img src={banner.image?.url} alt={banner.title || "Banner image"} />
                ) : (
                  <div className="admin-banners-card__fallback">
                    <HiOutlinePhotograph />
                  </div>
                )}
              </div>
              <div className="admin-banners-card__body">
                <div className="admin-banners-card__row">
                  <div>
                    <h3>{banner.title || "Untitled banner"}</h3>
                    <p className="admin-banners-card__meta">
                      {banner.product?.name || "No Product"}
                    </p>
                  </div>
                  <span
                    className={`admin-banners-badge ${
                      banner.isActive
                        ? "admin-banners-badge--active"
                        : "admin-banners-badge--hidden"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="admin-banners-card__details">
                  <span className="admin-banners-card__label">Position</span>
                  <span className="admin-banners-card__value">{banner.position || "N/A"}</span>
                </div>
              </div>
              <div className="admin-banners-card__actions">
                <Link
                  to={`/admin/banners/${banner._id}/edit`}
                  className="admin-banners-action-button admin-banners-action-button--secondary"
                >
                  <HiOutlinePencil />
                  Edit
                </Link>
                <button
                  className="admin-banners-action-button admin-banners-action-button--danger"
                  type="button"
                  onClick={() => deleteHandler(banner._id)}
                  disabled={actionLoadingId === banner._id}
                >
                  <HiOutlineTrash />
                  {actionLoadingId === banner._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;
