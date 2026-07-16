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
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

import {
  addToCart,
} from "../redux/slices/cartSlice";

import {
  addToFavourites,
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";

import {
  getProductById,
} from "../services/productService";

import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {

  const [product, setProduct] =
    useState(null);

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const { id } =
    useParams();

  const dispatch =
    useDispatch();

  const {
    favouritesItems,
  } = useSelector(
    (state) => state.favourites
  );

  const {
    userInfo,
  } = useSelector(
    (state) => state.auth
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

        } catch (error) {

          console.log(error);
        }
      };

    fetchProduct();

  }, [id]);

  const addProductToCart =
    () => {

      if (!userInfo) {
        navigate("/login");
        return;
      }

      dispatch(
        addToCart(product)
      );
    };

  const isFavourite =
    favouritesItems.some(
      (item) =>
        item._id ===
        product?._id
    );

  const handleFavourite =
    () => {

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
            <HiOutlineArrowLeft /> Back to Home
          </Link>
        </div>

        {/* ========== MAIN GRID ========== */}
        <div className="bb-details-grid">
          
          {/* Left Column: Gallery */}
          <div className="bb-details-image-col">
            <div className="bb-gallery-container">
              <div className="bb-main-image-wrap">
                <img
                  src={
                    product.images?.[activeImageIndex]?.url ||
                    "https://dummyimage.com/600x450/cbd5e1/0f172a&text=No+Image"
                  }
                  alt={product.name}
                  className="bb-main-image"
                  onError={(e) => {
                    e.target.src =
                      "https://dummyimage.com/600x450/cbd5e1/0f172a&text=No+Image";
                  }}
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
                        src={imgUrl?.url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        onError={(e) => {
                          e.target.src =
                            "https://dummyimage.com/80x80/cbd5e1/0f172a&text=No+Image";
                        }}
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
              
              {/* Meta Row: category & stock badge */}
              <div className="bb-info-meta">
                <span className="bb-category-badge">
                  {product.category?.name || "Product"}
                </span>

                {product.stock > 0 ? (
                  <span className="bb-stock-badge in-stock">
                    <HiOutlineCheckCircle /> In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="bb-stock-badge out-of-stock">
                    <HiOutlineXCircle /> Out of Stock
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
                <span className="bb-price-cur">EGP</span>
              </div>

              <hr className="bb-info-divider" />

              {/* Description */}
              <div className="bb-info-description">
                <h3 className="bb-info-subtitle">Description</h3>
                <p className="bb-description-text">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* Action buttons */}
              <div className="bb-info-actions">
                <button
                  onClick={addProductToCart}
                  disabled={product.stock <= 0}
                  className="bb-btn bb-btn--primary"
                >
                  <HiOutlineShoppingCart /> Add To Cart
                </button>

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

                <Link to={userInfo ? "/cart" : "/login"} className="bb-btn bb-btn--secondary">
                  Go To Cart
                </Link>
              </div>

              {/* Company Info Section */}
              {product.company && (
                <>
                  <hr className="bb-info-divider" />
                  <div className="bb-company-section">
                    <h3 className="bb-info-subtitle">Seller Information</h3>
                    
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
                          Visit Store <HiOutlineArrowRight />
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