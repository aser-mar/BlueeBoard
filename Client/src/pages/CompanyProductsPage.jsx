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

import "./CompanyProductsPage.css";

const CompanyProductsPage = () => {
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
            <HiOutlineArrowLeft /> Back to Home
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
              <p className="bb-company-desc">
                {companyInfo?.description || "No description available."}
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
              placeholder="Search products..."
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
              All Categories
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
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://dummyimage.com/300x220/cbd5e1/0f172a&text=No+Image"
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src =
                        "https://dummyimage.com/300x220/cbd5e1/0f172a&text=No+Image";
                    }}
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
                      <span className="bb-product-card__currency"> EGP</span>
                    </span>

                    <span className="bb-product-card__arrow">
                      <HiOutlineArrowRight />
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
            <h3 className="bb-empty-state__title">No Products Found</h3>
            <p className="bb-empty-state__desc">
              We couldn't find any products matching your search criteria. Try modifying your search term or select another category.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyProductsPage;