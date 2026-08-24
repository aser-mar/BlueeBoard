import {
  useState,
  useEffect,
} from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  clearCart,
} from "../redux/slices/cartSlice";

import {
  createOrder,
} from "../services/orderService";

import {
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineCash,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";

import "./CheckoutPage.css";

const CheckoutPage =
  () => {
    const { t } = useTranslation();

    const {
  cartItems,
} = useSelector(
  (state) => state.cart
);

const {
  token,
  userInfo,
} = useSelector(
  (state) => state.auth
);

const { isPreviewMode } = useSelector(
  (state) => state.previewMode
);

    const [name, setName] =
      useState("");

    const [phone, setPhone] =
      useState("");

    const [
      address,
      setAddress,
    ] = useState("");

    const [error, setError] =
      useState("");

    const [loading, setLoading] =
      useState(false);

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

      const [paymentMethod, setPaymentMethod] = useState("cash");

    const validateForm = () => {

  console.log("NAME:", name);
  console.log("PHONE:", phone);
  console.log("ADDRESS:", address);
  console.log("CART:", cartItems);

  if (cartItems.length === 0) {
    console.log("CART EMPTY");
    setError(t("checkout.errCartEmpty"));
    return false;
  }

  if (name.trim().length < 3) {
    console.log("NAME ERROR");
    setError(t("checkout.errName"));
    return false;
  }

  const phoneRegex = /^[0-9]{11}$/;

  if (!phoneRegex.test(phone)) {
    console.log("PHONE ERROR");
    setError(t("checkout.errPhone"));
    return false;
  }

  if (address.trim().length < 10) {
    console.log("ADDRESS ERROR");
    setError(t("checkout.errAddress"));
    return false;
  }

  console.log("VALIDATION PASSED");

  setError("");

  return true;
};

    const submitHandler =
      async (e) => {

        e.preventDefault();

        console.log(
  "SUBMIT WORKING"
);
console.log(
  "TOKEN:",
  token
);

console.log(
  "CART:",
  cartItems
);

        if (!userInfo) {

        navigate("/login");

        return;
        }

        if (isPreviewMode) {
          alert(t("errors.checkoutPreviewModeDisabled"));
          return;
        }

        console.log("BUTTON CLICKED");

        const isValid =
          validateForm();

        console.log(
  "VALIDATION:",
  isValid
);

        if (!isValid) {
          return;
        }

        try {

          setLoading(true);

          const orderData =
            {
              customerName:
                name,

              phone,

              address,

              paymentMethod,

              items:
                cartItems.map(
                  (item) => ({
                    product:
                      item._id,

                    quantity:
                      item.quantity,
                  })
                ),

              totalPrice,
            };

          await createOrder(
            orderData,
            token
          );

          dispatch(
            clearCart()
          );

          alert(
            t("checkout.orderSuccess")
          );

          navigate("/");

        } catch (error) {

          console.log(
  error.response?.data
);

console.log(error);

          setError(
            t("checkout.errSomething")
          );

        } finally {

          setLoading(false);
        }
      };

    return (

      <div className="bb-checkout-page">
        <div className="bb-checkout-hero">
          <div className="bb-checkout-hero-icon">
            <HiOutlineShoppingCart />
          </div>
          <div>
            <h1 className="bb-checkout-title">{t("checkout.title")}</h1>
            <p className="bb-checkout-subtitle">
              {t("checkout.subtitle")}
            </p>
          </div>
        </div>

        {error && (
          <div className="bb-checkout-alert">
            <HiOutlineExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bb-checkout-empty">
            <div className="bb-checkout-empty-icon">
              <HiOutlineShoppingCart />
            </div>
            <h2 className="bb-checkout-empty-title">{t("cart.emptyTitle")}</h2>
            <p className="bb-checkout-empty-text">
              {t("checkout.emptyDesc")}
            </p>
            <button
              className="bb-checkout-empty-button"
              onClick={() => navigate("/")}
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        ) : (
          <div className="bb-checkout-grid">
            <form
              onSubmit={
                submitHandler
              }
              className="bb-checkout-form"
            >
              <div className="bb-checkout-card">
                <div className="bb-checkout-card-header">
                  <div className="bb-checkout-card-icon">
                    <HiOutlineUser />
                  </div>
                  <div>
                    <h2 className="bb-checkout-card-title">{t("checkout.customerInfo")}</h2>
                    <p className="bb-checkout-card-copy">
                      {t("checkout.customerInfoDesc")}
                    </p>
                  </div>
                </div>

                <div className="bb-checkout-field">
                  <label className="bb-checkout-label" htmlFor="name">
                    {t("checkout.fullName")}
                  </label>
                  <div className="bb-checkout-input-group">
                    <HiOutlineUser className="bb-checkout-input-icon" />
                    <input
                      id="name"
                      type="text"
                      placeholder={t("checkout.namePlaceholder")}
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="bb-checkout-input"
                    />
                  </div>
                </div>

                <div className="bb-checkout-field">
                  <label className="bb-checkout-label" htmlFor="phone">
                    {t("checkout.phone")}
                  </label>
                  <div className="bb-checkout-input-group">
                    <HiOutlinePhone className="bb-checkout-input-icon" />
                    <input
                      id="phone"
                      type="text"
                      placeholder="01xxxxxxxxx"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      className="bb-checkout-input"
                    />
                  </div>
                </div>

                <div className="bb-checkout-field">
                  <label className="bb-checkout-label" htmlFor="address">
                    {t("checkout.address")}
                  </label>
                  <div className="bb-checkout-textarea-group">
                    <HiOutlineLocationMarker className="bb-checkout-input-icon bb-checkout-input-icon--textarea" />
                    <textarea
                      id="address"
                      placeholder={t("checkout.addressPlaceholder")}
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      rows="5"
                      className="bb-checkout-textarea"
                    />
                  </div>
                </div>

                <div className="bb-checkout-field">
                  <label className="bb-checkout-label">
                    {t("checkout.paymentMethod")}
                  </label>
                  <div className="bb-checkout-payment-grid">
                    <label className={`bb-checkout-payment-card ${paymentMethod === "cash" ? "bb-checkout-payment-card--active" : ""}`}>
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="bb-checkout-hidden-radio"
                      />
                      <div className="bb-checkout-payment-icon">
                        <HiOutlineCash />
                      </div>
                      <div>
                        <div className="bb-checkout-payment-title">{t("checkout.cashOnDelivery")}</div>
                      </div>
                    </label>

                    <label className={`bb-checkout-payment-card ${paymentMethod === "card" ? "bb-checkout-payment-card--active" : ""}`}>
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="bb-checkout-hidden-radio"
                      />
                      <div className="bb-checkout-payment-icon">
                        <HiOutlineCreditCard />
                      </div>
                      <div>
                        <div className="bb-checkout-payment-title">{t("checkout.card")}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bb-checkout-submit"
                >
                  {loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}
                </button>
              </div>
            </form>

            <aside className="bb-checkout-summary">
              <div className="bb-checkout-card bb-checkout-summary-card">
                <div className="bb-checkout-card-header">
                  <div className="bb-checkout-card-icon">
                    <HiOutlineCreditCard />
                  </div>
                  <div>
                    <h2 className="bb-checkout-card-title">{t("cart.orderSummary")}</h2>
                    <p className="bb-checkout-card-copy">
                      {t("checkout.reviewItems")}
                    </p>
                  </div>
                </div>

                <div className="bb-checkout-summary-list">
                  {cartItems.map((item) => (
                    <div key={item._id} className="bb-checkout-summary-item">
                      <div>
                        <div className="bb-checkout-summary-item-name">{item.name}</div>
                        <div className="bb-checkout-summary-item-meta">{t("checkout.qty")}: {item.quantity}</div>
                      </div>
                      <div className="bb-checkout-summary-item-price">
                        {item.price * item.quantity} {t("common.currency")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bb-checkout-summary-divider"></div>

                <div className="bb-checkout-total-row">
                  <span>{t("cart.subtotal")}</span>
                  <span>{totalPrice} {t("common.currency")}</span>
                </div>

                <div className="bb-checkout-total-row bb-checkout-total-row--grand">
                  <span>{t("cart.total")}</span>
                  <span>{totalPrice} {t("common.currency")}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    );
  };

export default CheckoutPage;