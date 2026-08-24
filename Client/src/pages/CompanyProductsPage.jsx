import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getCompanyById } from "../services/companyService";

import { useDebounce } from "../hooks/useDebounce";

import {
  HiOutlineOfficeBuilding,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineSearch,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { getProductImageUrl, onImageError } from "../utils/imageHelper";

import "./CompanyProductsPage.css";

const CompanyProductsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(false);
  
  // LOAD CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        
        const data = await getCategories(id);

        setCategories(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchCategories();
    }
  }, [id]);

  //LOAD COMPANY
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(id);
        setCompanyInfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  // LOAD PRODUCTS (SEARCH + FILTER)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          companyId: id,
          categoryId: category,
          search: debouncedSearch,
        });

        setProducts(data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, category, debouncedSearch]);

  const companyName = companyInfo?.name || "Company";

  return (
    <div className="bb-company-products">
      <div className="container">

        {/* ========== BREADCRUMBS ========== */}
        <div className="bb-breadcrumbs">
          <Link to="/" className="bb-breadcrumbs__link">
            <HiOutlineArrowLeft className="bb-rtl-flip" /> {t("common.backToHome")}
          </Link>
        </div>

        {/* ========== BRAND BANNER ========== */}
        <div className="bb-company-banner">
          <div className="bb-company-profile">
            {companyInfo?.logo?.url ? (
              <img
                src={companyInfo.logo?.url}
                alt={companyName}
                className="bb-company-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="bb-company-logo-placeholder">
                <HiOutlineOfficeBuilding />
              </div>
            )}

            <div className="bb-company-info">
              <h1 className="bb-company-name">{companyName}</h1>
              
              {(companyInfo?.region?.length > 0 || companyInfo?.governorates?.length > 0 || companyInfo?.sectors?.length > 0) && (
                <div className="bb-company-meta-badges">
                  {companyInfo?.region?.map((r) => (
                    <span key={r} className="bb-company-meta-badge">📍 {r}</span>
                  ))}
                  {companyInfo?.governorates?.map((g) => (
                    <span key={g} className="bb-company-meta-badge">🏛️ {g}</span>
                  ))}
                  {companyInfo?.sectors?.map((s) => (
                    <span key={s._id} className="bb-company-meta-badge">🏷️ {s.name}</span>
                  ))}
                </div>
              )}

              <p className="bb-company-desc">
                {companyInfo?.description || t("company.noDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* ========== CONTROLS PANEL ========== */}
        <div className="bb-controls-panel">
          <div className="bb-search-wrapper">
            <HiOutlineSearch className="bb-search-icon" />
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bb-search-input"
            />
          </div>

          <div className="bb-categories-tabs">
            <button
              className={`bb-category-tab ${category === "" ? "active" : ""}`}
              onClick={() => setCategory("")}
            >
              {t("products.allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`bb-category-tab ${category === cat._id ? "active" : ""}`}
                onClick={() => setCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ========== PRODUCTS / LOADING STATE ========== */}
        {loading ? (
          <div className="bb-products-grid">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bb-product-card-skeleton">
                <div className="bb-skeleton-image-wrap shimmer"></div>
                <div className="bb-skeleton-body">
                  <div className="bb-skeleton-title shimmer"></div>
                  <div className="bb-skeleton-company shimmer"></div>
                  <div className="bb-skeleton-footer">
                    <div className="bb-skeleton-price shimmer"></div>
                    <div className="bb-skeleton-arrow shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="bb-products-grid">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bb-product-card"
              >
                <div className="bb-product-card__image-wrap">
                  {product.isSoldOut && (
                    <span className="bb-product-card__badge bb-product-card__badge--sold-out">
                      {t("products.soldOut")}
                    </span>
                  )}
                  <img
                    src={getProductImageUrl(product.images?.[0])}
                    alt={product.name}
                    onError={onImageError}
                    className="bb-product-card__image"
                  />
                </div>

                <div className="bb-product-card__body">
                  <h3 className="bb-product-card__name">{product.name}</h3>
                  <p className="bb-product-card__company">
                    {product.company?.name || companyName}
                  </p>

                  <div className="bb-product-card__footer">
                    <span className="bb-product-card__price">
                      {product.price?.toLocaleString()}
                      <span className="bb-product-card__currency"> {t("common.currency")}</span>
                    </span>

                    <span className="bb-product-card__arrow">
                      <HiOutlineArrowRight className="bb-rtl-flip" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bb-empty-state">
            <div className="bb-empty-state__icon">
              <HiOutlineSearch />
            </div>
            <h3 className="bb-empty-state__title">{t("products.noProductsFound")}</h3>
            <p className="bb-empty-state__desc">
              {t("products.noProductsDesc")}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyProductsPage;