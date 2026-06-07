import {
  useState,
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

const CheckoutPage =
  () => {

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

    const totalPrice =
      cartItems.reduce(
        (total, item) =>
          total +
          item.price *
            item.quantity,
        0
      );

    const validateForm = () => {

  console.log("NAME:", name);
  console.log("PHONE:", phone);
  console.log("ADDRESS:", address);
  console.log("CART:", cartItems);

  if (cartItems.length === 0) {

    console.log("CART EMPTY");

    setError("Your cart is empty");

    return false;
  }

  if (name.trim().length < 3) {

    console.log("NAME ERROR");

    setError(
      "Name must be at least 3 characters"
    );

    return false;
  }

  const phoneRegex = /^[0-9]{11}$/;

  if (!phoneRegex.test(phone)) {

    console.log("PHONE ERROR");

    setError(
      "Phone number must be 11 digits"
    );

    return false;
  }

  if (address.trim().length < 10) {

    console.log("ADDRESS ERROR");

    setError(
      "Address must be at least 10 characters"
    );

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
            "Order Created Successfully"
          );

          navigate("/");

        } catch (error) {

          console.log(
  error.response?.data
);

console.log(error);

          setError(
            "Something went wrong"
          );

        } finally {

          setLoading(false);
        }
      };

    return (

      <div
        className="container"

        style={{
          paddingTop:
            "40px",

          paddingBottom:
            "40px",
        }}
      >

        <h1
          style={{
            marginBottom:
              "30px",
          }}
        >
          Checkout
        </h1>

        {
          error && (

            <div
              style={{
                background:
                  "#ffebee",

                color:
                  "#c62828",

                padding:
                  "12px",

                borderRadius:
                  "8px",

                marginBottom:
                  "20px",
              }}
            >
              {error}
            </div>
          )
        }

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "2fr 1fr",

            gap: "30px",
          }}
        >

          {/* FORM */}

          <form
            onSubmit={
              submitHandler
            }

            style={{
              border:
                "1px solid #ddd",

              borderRadius:
                "12px",

              padding:
                "30px",
            }}
          >

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <label>
                Full Name
              </label>

              <input
                type="text"

                placeholder="Your Name"

                value={name}

                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }

                style={{
                  width:
                    "100%",

                  padding:
                    "12px",

                  marginTop:
                    "8px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "8px",
                }}
              />

            </div>

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <label>
                Phone Number
              </label>

              <input
                type="text"

                placeholder="01xxxxxxxxx"

                value={phone}

                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }

                style={{
                  width:
                    "100%",

                  padding:
                    "12px",

                  marginTop:
                    "8px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "8px",
                }}
              />

            </div>

            <div
              style={{
                marginBottom:
                  "25px",
              }}
            >

              <label>
                Address
              </label>

              <textarea
                placeholder="Your Address"

                value={address}

                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }

                rows="5"

                style={{
                  width:
                    "100%",

                  padding:
                    "12px",

                  marginTop:
                    "8px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "8px",

                  resize:
                    "none",
                }}
              />

            </div>

            <button
              type="submit"

              disabled={loading}

              style={{
                width:
                  "100%",

                padding:
                  "14px",

                border:
                  "none",

                borderRadius:
                  "8px",

                background:
                  loading
                    ? "#777"
                    : "#111",

                color:
                  "#fff",

                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",

                fontSize:
                  "16px",
              }}
            >
              {
                loading
                  ? "Placing Order..."
                  : "Place Order"
              }
            </button>

          </form>

          {/* SUMMARY */}

          <div
            style={{
              border:
                "1px solid #ddd",

              borderRadius:
                "12px",

              padding:
                "25px",

              height:
                "fit-content",
            }}
          >

            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Order Summary
            </h2>

            {
              cartItems.length ===
              0 ? (

                <p>
                  Your cart is empty
                </p>

              ) : (

                cartItems.map(
                  (item) => (

                    <div
                      key={
                        item._id
                      }

                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        marginBottom:
                          "15px",

                        gap: "10px",
                      }}
                    >

                      <span>
                        {
                          item.name
                        }
                        {" "}
                        x
                        {" "}
                        {
                          item.quantity
                        }
                      </span>

                      <span>
                        {
                          item.price *
                          item.quantity
                        }
                        {" "}
                        EGP
                      </span>

                    </div>
                  )
                )
              )
            }

            <hr
              style={{
                margin:
                  "20px 0",
              }}
            />

            <h3>
              Total:
              {" "}
              {totalPrice}
              {" "}
              EGP
            </h3>

          </div>

        </div>

      </div>
    );
  };

export default CheckoutPage;