import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaHeart,
} from "react-icons/fa";

import {
  HiOutlineOfficeBuilding,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineShoppingCart,
  HiOutlineXCircle,
} from "react-icons/hi";

import {
  addToCart,
  setQuantity,
} from "../redux/slices/cartSlice";

import {
  addToFavourites,
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";

import {
  getProductById,
} from "../services/productService";
import { useTranslation } from "react-i18next";
import { getProductImageUrl, onImageError } from "../utils/imageHelper";

import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { t } = useTranslation();

  const [product, setProduct] =
    useState(null);

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const { id } =
    useParams();

  const dispatch =
    useDispatch();

  const {
    favouritesItems,
  } = useSelector(
    (state) => state.favourites
  );

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const cartItem = product
    ? cartItems.find((item) => item._id === product._id)
    : null;

  const {
    userInfo,
  } = useSelector(
    (state) => state.auth
  );

  const { isPreviewMode } = useSelector(
    (state) => state.previewMode
  );

  const navigate = useNavigate();

  useEffect(() => {

    const fetchProduct =
      async () => {

        try {

          const data =
            await getProductById(
              id
            );

          setProduct(data);
          setActiveImageIndex(0);
          setSelectedQuantity(1);

        } catch (error) {

          console.log(error);
        }
      };

    fetchProduct();

  }, [id]);

  const normalizeQuantity = (value) => {
    if (value === "" || value === null || value === undefined) return 1;

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;

    return Math.floor(parsed);
  };

  const quantityValue = cartItem ? cartItem.quantity : selectedQuantity;

  const addProductToCart =
    () => {

      if (isPreviewMode) {
        alert(t("errors.previewModeDisabled"));
        return;
      }

      if (product.isSoldOut) {
        alert(t("errors.soldOutAlert"));
        return;
      }

      if (!userInfo) {
        navigate("/login");
        return;
      }

      const normalizedQuantity = normalizeQuantity(selectedQuantity);

      dispatch(
        addToCart(product)
      );

      dispatch(
        setQuantity({
          id: product._id,
          quantity: normalizedQuantity,
        })
      );
    };

  const handleQuantityChange = (value) => {
    const nextQuantity = normalizeQuantity(value);

    if (cartItem) {
      dispatch(
        setQuantity({
          id: product._id,
          quantity: nextQuantity,
        })
      );
      return;
    }

    setSelectedQuantity(nextQuantity);
  };

  const handleDecrease = () => {
    if (cartItem) {
      dispatch(
        setQuantity({
          id: product._id,
          quantity: Math.max(1, cartItem.quantity - 1),
        })
      );
      return;
    }

    setSelectedQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (cartItem) {
      dispatch(
        setQuantity({
          id: product._id,
          quantity: cartItem.quantity + 1,
        })
      );
      return;
    }

    setSelectedQuantity((prev) => prev + 1);
  };

  const isFavourite =
    favouritesItems.some(
      (item) =>
        item._id ===
        product?._id
    );

  const handleFavourite =
    () => {

      if (isPreviewMode) {
        alert(t("errors.previewModeDisabled"));
        return;
      }

      if (!userInfo) {
        navigate("/login");
        return;
      }

      if (isFavourite) {

        dispatch(
          removeFromFavourites(
            product._id
          )
        );

      } else {

        dispatch(
          addToFavourites(
            product
          )
        );
      }
    };

  if (!product) {

    return (
      <div className="bb-details-page bb-details-page--loading">
        <div className="container">
          <div className="bb-breadcrumbs-skeleton shimmer"></div>
          
          <div className="bb-details-grid">
            <div className="bb-details-image-col">
              <div className="bb-image-skeleton shimmer"></div>
              <div className="bb-thumbnail-skeleton-row">
                <div className="bb-thumbnail-skeleton shimmer"></div>
                <div className="bb-thumbnail-skeleton shimmer"></div>
                <div className="bb-thumbnail-skeleton shimmer"></div>
              </div>
            </div>
            
            <div className="bb-details-info-col">
              <div className="bb-info-card-skeleton">
                <div className="bb-skeleton-meta shimmer"></div>
                <div className="bb-skeleton-title shimmer"></div>
                <div className="bb-skeleton-title-short shimmer"></div>
                <div className="bb-skeleton-price shimmer"></div>
                <div className="bb-skeleton-text shimmer"></div>
                <div className="bb-skeleton-text shimmer"></div>
                <div className="bb-skeleton-text-short shimmer"></div>
                <div className="bb-skeleton-actions">
                  <div className="bb-skeleton-btn shimmer"></div>
                  <div className="bb-skeleton-btn-square shimmer"></div>
                  <div className="bb-skeleton-btn shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bb-details-page">
      <div className="container">
        
        {/* ========== BREADCRUMBS ========== */}
        <div className="bb-breadcrumbs">
          <Link to="/" className="bb-breadcrumbs__link">
            <HiOutlineArrowLeft className="bb-rtl-flip" /> {t("common.backToHome")}
          </Link>
        </div>

        {/* ========== MAIN GRID ========== */}
        <div className="bb-details-grid">
          
          {/* Left Column: Gallery */}
          <div className="bb-details-image-col">
            <div className="bb-gallery-container">
              <div className="bb-main-image-wrap">
                <img
                  src={getProductImageUrl(product.images?.[activeImageIndex])}
                  alt={product.name}
                  className="bb-main-image"
                  onError={onImageError}
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="bb-thumbnail-row">
                  {product.images.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`bb-thumbnail-btn ${
                        activeImageIndex === index ? "active" : ""
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={getProductImageUrl(imgUrl)}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        onError={onImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="bb-details-info-col">
            <div className="bb-info-card">
              
              {/* Meta Row: category badge */}
              <div className="bb-info-meta">
                <span className="bb-category-badge">
                  {product.category?.name || "Product"}
                </span>
                {product.isSoldOut && (
                  <span className="bb-stock-badge out-of-stock">
                    <HiOutlineXCircle /> {t("products.soldOut")}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="bb-info-title">{product.name}</h1>

              {/* Price display */}
              <div className="bb-info-price">
                <span className="bb-price-val">
                  {product.price?.toLocaleString()}
                </span>
                <span className="bb-price-cur">{t("common.currency")}</span>
              </div>

              <hr className="bb-info-divider" />

              {/* Description */}
              <div className="bb-info-description">
                <h3 className="bb-info-subtitle">{t("product.descriptionTitle")}</h3>
                <p className="bb-description-text">
                  {product.description || t("product.noDescription")}
                </p>
              </div>

              {/* Action buttons */}
              <div className="bb-info-actions">
                <div className="bb-product-quantity-control">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    className="bb-qty-btn"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="bb-qty-input"
                    value={quantityValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") return;
                      handleQuantityChange(value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "" || Number(e.target.value) < 1) {
                        handleQuantityChange(1);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="bb-qty-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {!cartItem && (
                  <button
                    onClick={addProductToCart}
                    disabled={product.isSoldOut}
                    className="bb-btn bb-btn--primary"
                  >
                    <HiOutlineShoppingCart /> {t("product.addToCart")}
                  </button>
                )}

                <button
                  onClick={handleFavourite}
                  className={`bb-btn-fav ${isFavourite ? "is-fav" : ""}`}
                  aria-label={
                    isFavourite
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                >
                  <FaHeart />
                </button>

                {isPreviewMode ? (
                  <button
                    type="button"
                    className="bb-btn bb-btn--secondary"
                    onClick={() => alert(t("errors.previewModeDisabled"))}
                  >
                    {t("product.goToCart")}
                  </button>
                ) : (
                  <Link to={userInfo ? "/cart" : "/login"} className="bb-btn bb-btn--secondary">
                    {t("product.goToCart")}
                  </Link>
                )}
              </div>

              {/* Company Info Section */}
              {product.company && (
                <>
                  <hr className="bb-info-divider" />
                  <div className="bb-company-section">
                    <h3 className="bb-info-subtitle">{t("product.sellerInfo")}</h3>
                    
                    <div className="bb-company-card-mini">
                      {product.company.logo ? (
                        <img
                          src={product.company.logo?.url}
                          alt={product.company.name}
                          className="bb-company-logo-mini"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="bb-company-logo-placeholder-mini">
                          <HiOutlineOfficeBuilding />
                        </div>
                      )}
                      
                      <div className="bb-company-details-mini">
                        <h4 className="bb-company-name-mini">
                          {product.company.name}
                        </h4>
                        
                        {product.company.description && (
                          <p className="bb-company-desc-mini">
                            {product.company.description}
                          </p>
                        )}
                        
                        <Link
                          to={`/company/${product.company._id}`}
                          className="bb-company-link-mini"
                        >
                          {t("product.visitStore")} <HiOutlineArrowRight className="bb-rtl-flip" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;