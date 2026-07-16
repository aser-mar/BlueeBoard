import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";

import {
  Link,
  useNavigate,
} from "react-router-dom";



const CartPage = () => {

  const cartItems =
    useSelector(
      (state) =>
        state.cart.cartItems
    );

  const {
    userInfo,
  } = useSelector(
    (state) => state.auth
  );

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (
    <div className="bb-cart-wrapper">
      <style>{`
        .bb-cart-wrapper {
          min-height: calc(100vh - 68px);
          background: #f8fafc;
          padding: 60px 24px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .bb-cart-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .bb-cart-header {
          margin-bottom: 50px;
          animation: bbFadeInDown 0.5s ease-out both;
        }

        .bb-cart-title {
          font-size: 40px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .bb-cart-count {
          font-size: 15px;
          color: #475569;
          font-weight: 500;
        }

        .bb-cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .bb-cart-items-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .bb-cart-item {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          padding: 24px;
          display: grid;
          grid-template-columns: 140px 1fr auto;
          gap: 24px;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: bbFadeInUp 0.5s ease-out both;
        }

        .bb-cart-item:hover {
          border-color: rgba(37, 99, 235, 0.25);
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .bb-cart-item-image {
          width: 140px;
          height: 140px;
          border-radius: 14px;
          object-fit: cover;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .bb-cart-item-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bb-cart-item-name {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.5;
        }

        .bb-cart-item-company {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bb-cart-item-price {
          font-size: 18px;
          font-weight: 800;
          color: #2563eb;
          margin-top: 4px;
        }

        .bb-cart-item-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .bb-cart-quantity-control {
          display: flex;
          align-items: center;
          gap: 0;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid rgba(148, 163, 184, 0.2);
          overflow: hidden;
        }

        .bb-qty-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #475569;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .bb-qty-btn:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.08);
        }

        .bb-qty-display {
          width: 50px;
          text-align: center;
          color: #0f172a;
          font-weight: 700;
          font-size: 14px;
          background: transparent;
          border: none;
        }

        .bb-cart-remove-btn {
          padding: 10px 16px;
          border: 1.5px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border-radius: 10px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bb-cart-remove-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .bb-cart-summary {
          position: sticky;
          top: 100px;
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
          animation: bbFadeInUp 0.5s ease-out both;
        }

        .bb-cart-summary-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 24px;
        }

        .bb-cart-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          font-size: 14px;
          color: #475569;
        }

        .bb-cart-summary-divider {
          height: 1px;
          background: rgba(148, 163, 184, 0.1);
          margin: 20px 0;
        }

        .bb-cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 28px;
        }

        .bb-checkout-button {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          text-transform: uppercase;
        }

        .bb-checkout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .bb-cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 500px;
          text-align: center;
          animation: bbFadeInUp 0.5s ease-out both;
        }

        .bb-cart-empty-icon {
          font-size: 100px;
          margin-bottom: 28px;
          opacity: 0.15;
        }

        .bb-cart-empty-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .bb-cart-empty-text {
          font-size: 16px;
          color: #475569;
          max-width: 450px;
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .bb-continue-shopping-link {
          text-decoration: none;
        }

        .bb-continue-shopping-btn {
          display: inline-block;
          padding: 13px 36px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.02em;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          text-transform: uppercase;
        }

        .bb-continue-shopping-btn:hover {
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

        @media (max-width: 1024px) {
          .bb-cart-content {
            gap: 32px;
          }

          .bb-cart-summary {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .bb-cart-wrapper {
            padding: 40px 16px;
          }

          .bb-cart-title {
            font-size: 32px;
          }

          .bb-cart-content {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .bb-cart-item {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .bb-cart-item-image {
            width: 100%;
            height: 200px;
          }

          .bb-cart-item-actions {
            align-items: flex-start;
            flex-direction: row;
            justify-content: space-between;
          }

          .bb-cart-summary {
            position: sticky;
            top: 68px;
          }
        }

        @media (max-width: 480px) {
          .bb-cart-title {
            font-size: 24px;
          }

          .bb-cart-item {
            padding: 16px;
            gap: 12px;
          }

          .bb-cart-item-image {
            height: 160px;
          }

          .bb-cart-item-name {
            font-size: 14px;
          }

          .bb-cart-summary {
            padding: 24px;
          }

          .bb-cart-empty-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="bb-cart-container">
        <div className="bb-cart-header">
          <h1 className="bb-cart-title">
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <p className="bb-cart-count">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
            </p>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bb-cart-empty">
            <div className="bb-cart-empty-icon">
              🛒
            </div>
            <h2 className="bb-cart-empty-title">
              Your Cart is Empty
            </h2>
            <p className="bb-cart-empty-text">
              Start adding products to your cart and enjoy a seamless shopping experience. Discover amazing deals and premium company products.
            </p>
            <Link
              to="/"
              className="bb-continue-shopping-link"
            >
              <button className="bb-continue-shopping-btn">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="bb-cart-content">
            {/* CART ITEMS */}
            <div className="bb-cart-items-section">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bb-cart-item"
                >
                  {item.images?.[0] && (
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      className="bb-cart-item-image"
                    />
                  )}

                  <div className="bb-cart-item-details">
                    <h3 className="bb-cart-item-name">
                      {item.name}
                    </h3>
                    {item.company && (
                      <p className="bb-cart-item-company">
                        {item.company.name}
                      </p>
                    )}
                    <div className="bb-cart-item-price">
                      {item.price} EGP
                    </div>
                  </div>

                  <div className="bb-cart-item-actions">
                    <div className="bb-cart-quantity-control">
                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQuantity(
                              item._id
                            )
                          )
                        }
                        className="bb-qty-btn"
                      >
                        −
                      </button>
                      <div className="bb-qty-display">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() =>
                          dispatch(
                            increaseQuantity(
                              item._id
                            )
                          )
                        }
                        className="bb-qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        dispatch(
                          removeFromCart(
                            item._id
                          )
                        )
                      }
                      className="bb-cart-remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bb-cart-summary">
              <h2 className="bb-cart-summary-title">
                Order Summary
              </h2>

              <div className="bb-cart-summary-row">
                <span>Items ({cartItems.length})</span>
                <span>{cartItems.length === 1 ? '1 item' : `${cartItems.length} items`}</span>
              </div>

              <div className="bb-cart-summary-row">
                <span>Subtotal</span>
                <span>{totalPrice} EGP</span>
              </div>

              <div className="bb-cart-summary-divider"></div>

              <div className="bb-cart-total">
                <span>Total</span>
                <span>{totalPrice} EGP</span>
              </div>

              <Link to="/checkout">
                <button className="bb-checkout-button">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;