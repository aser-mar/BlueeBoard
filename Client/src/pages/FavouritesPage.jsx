import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  Link,
} from "react-router-dom";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import {
  removeFromFavourites,
} from "../redux/slices/favouritesSlice";

const FavouritesPage =
  () => {

    const navigate =
      useNavigate();

    const dispatch =
      useDispatch();

    const { userInfo } =
      useSelector(
        (state) => state.auth
      );

    useEffect(() => {

      if (userInfo?.isAdmin) {
        navigate("/admin", { replace: true });
      }

    }, [userInfo, navigate]);

    const {
      favouritesItems,
    } = useSelector(
      (state) =>
        state.favourites
    );

    const handleRemove = (productId) => {
      dispatch(
        removeFromFavourites(productId)
      );
    };

    return (
      <div className="bb-favourites-wrapper">
        <style>{`
          .bb-favourites-wrapper {
            min-height: calc(100vh - 68px);
            background: #f8fafc;
            padding: 60px 24px;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
          }

          .bb-favourites-container {
            max-width: 1400px;
            margin: 0 auto;
          }

          .bb-favourites-header {
            margin-bottom: 50px;
            animation: bbFadeInDown 0.5s ease-out both;
          }

          .bb-favourites-title {
            font-size: 40px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
          }

          .bb-favourites-count {
            font-size: 15px;
            color: #475569;
            font-weight: 500;
          }

          .bb-favourites-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 28px;
            margin-bottom: 60px;
          }

          .bb-favourite-card {
            background: #ffffff;
            border-radius: 18px;
            border: 1px solid rgba(148, 163, 184, 0.15);
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            display: flex;
            flex-direction: column;
            animation: bbFadeInUp 0.5s ease-out both;
          }

          .bb-favourite-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 30px rgba(37, 99, 235, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
            border-color: rgba(37, 99, 235, 0.25);
          }

          .bb-favourite-image-wrap {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 240px;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          }

          .bb-favourite-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .bb-favourite-card:hover .bb-favourite-image {
            transform: scale(1.06);
          }

          .bb-favourite-remove-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 22px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 10;
            font-weight: 700;
            line-height: 1;
          }

          .bb-favourite-remove-btn:hover {
            background: #ef4444;
            border-color: #ef4444;
            transform: scale(1.1);
          }

          .bb-favourite-content {
            padding: 22px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .bb-favourite-name {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .bb-favourite-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #94a3b8;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .bb-favourite-price {
            font-size: 20px;
            font-weight: 800;
            color: #2563eb;
            margin-top: 6px;
          }

          .bb-favourites-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
            animation: bbFadeInUp 0.5s ease-out both;
          }

          .bb-favourites-empty-icon {
            font-size: 80px;
            margin-bottom: 24px;
            opacity: 0.15;
          }

          .bb-favourites-empty-title {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 12px;
          }

          .bb-favourites-empty-text {
            font-size: 16px;
            color: #475569;
            max-width: 400px;
            line-height: 1.6;
            margin-bottom: 32px;
          }

          .bb-favourites-empty-button {
            display: inline-block;
            padding: 13px 32px;
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.02em;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }

          .bb-favourites-empty-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          }

          @keyframes bbFadeInDown {
            from {
              opacity: 0;
              transform: translateY(-16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bbFadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .bb-favourites-wrapper {
              padding: 40px 16px;
            }

            .bb-favourites-title {
              font-size: 32px;
            }

            .bb-favourites-grid {
              grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
              gap: 20px;
            }

            .bb-favourite-image-wrap {
              height: 200px;
            }

            .bb-favourite-content {
              padding: 16px;
              gap: 10px;
            }

            .bb-favourite-name {
              font-size: 14px;
            }
          }

          @media (max-width: 480px) {
            .bb-favourites-title {
              font-size: 24px;
            }

            .bb-favourites-grid {
              grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
              gap: 16px;
            }

            .bb-favourite-image-wrap {
              height: 160px;
            }

            .bb-favourite-content {
              padding: 12px;
            }

            .bb-favourite-name {
              font-size: 13px;
            }

            .bb-favourite-price {
              font-size: 16px;
            }

            .bb-favourites-empty-title {
              font-size: 22px;
            }
          }
        `}</style>

        <div className="bb-favourites-container">
          <div className="bb-favourites-header">
            <h1 className="bb-favourites-title">
              My Favourites
            </h1>
            {favouritesItems.length > 0 && (
              <p className="bb-favourites-count">
                {favouritesItems.length} item{favouritesItems.length !== 1 ? 's' : ''} saved
              </p>
            )}
          </div>

          {favouritesItems.length === 0 ? (
            <div className="bb-favourites-empty">
              <div className="bb-favourites-empty-icon">
                ♡
              </div>
              <h2 className="bb-favourites-empty-title">
                No Favourites Yet
              </h2>
              <p className="bb-favourites-empty-text">
                Start exploring and add products to your wishlist to save them for later.
              </p>
              <Link
                to="/"
                className="bb-favourites-empty-button"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="bb-favourites-grid">
              {favouritesItems.map((product) => (
                <div
                  key={product._id}
                  className="bb-favourite-card"
                >
                  <Link
                    to={`/product/${product._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'contents',
                    }}
                  >
                    <div className="bb-favourite-image-wrap">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="bb-favourite-image"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(product._id);
                        }}
                        className="bb-favourite-remove-btn"
                        title="Remove from favourites"
                        type="button"
                      >
                        ×
                      </button>
                    </div>

                    <div className="bb-favourite-content">
                      <h3 className="bb-favourite-name">
                        {product.name}
                      </h3>

                      {product.company && (
                        <div className="bb-favourite-meta">
                          <span>{product.company.name}</span>
                        </div>
                      )}

                      <div className="bb-favourite-price">
                        {product.price} EGP
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

export default FavouritesPage;
