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
} from "react-router-dom";

const CartPage = () => {

  const cartItems =
    useSelector(
      (state) =>
        state.cart.cartItems
    );

  const dispatch =
    useDispatch();

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (

    <div
      className="container"

      style={{
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >

      <h1
        style={{
          marginBottom: "30px",
        }}
      >
        Shopping Cart
      </h1>

      {
        cartItems.length === 0 ? (

          <div>

            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Cart is empty
            </h2>

            <Link to="/">

              <button
                style={{
                  padding:
                    "12px 20px",

                  border: "none",

                  borderRadius:
                    "8px",

                  background:
                    "#111",

                  color:
                    "#fff",

                  cursor:
                    "pointer",
                }}
              >
                Go Shopping
              </button>

            </Link>

          </div>

        ) : (

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "2fr 1fr",

              gap: "30px",
            }}
          >

            {/* CART ITEMS */}

            <div>

              {
                cartItems.map(
                  (item) => (

                  <div
                    key={item._id}

                    style={{
                      display: "flex",

                      gap: "20px",

                      alignItems:
                        "center",

                      border:
                        "1px solid #ddd",

                      borderRadius:
                        "12px",

                      padding:
                        "20px",

                      marginBottom:
                        "20px",

                      flexWrap:
                        "wrap",
                    }}
                  >

                    {/* IMAGE */}

                    {
                      item.images?.[0] && (

                        <img
                          src={
                            item
                              .images[0]
                          }

                          alt={
                            item.name
                          }

                          style={{
                            width:
                              "120px",

                            height:
                              "120px",

                            objectFit:
                              "cover",

                            borderRadius:
                              "10px",
                          }}
                        />
                      )
                    }

                    {/* INFO */}

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <h3
                        style={{
                          marginBottom:
                            "10px",
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        style={{
                          marginBottom:
                            "10px",

                          color:
                            "#666",
                        }}
                      >
                        Price:
                        {" "}
                        {item.price}
                        {" "}
                        EGP
                      </p>

                      <p>
                        Quantity:
                        {" "}
                        {
                          item.quantity
                        }
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display:
                          "flex",

                        gap: "10px",

                        flexWrap:
                          "wrap",
                      }}
                    >

                      <button
                        onClick={() =>
                          dispatch(
                            increaseQuantity(
                              item._id
                            )
                          )
                        }

                        style={{
                          width:
                            "40px",

                          height:
                            "40px",

                          border:
                            "none",

                          borderRadius:
                            "8px",

                          cursor:
                            "pointer",
                        }}
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQuantity(
                              item._id
                            )
                          )
                        }

                        style={{
                          width:
                            "40px",

                          height:
                            "40px",

                          border:
                            "none",

                          borderRadius:
                            "8px",

                          cursor:
                            "pointer",
                        }}
                      >
                        -
                      </button>

                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart(
                              item._id
                            )
                          )
                        }

                        style={{
                          padding:
                            "0 15px",

                          border:
                            "none",

                          borderRadius:
                            "8px",

                          background:
                            "crimson",

                          color:
                            "#fff",

                          cursor:
                            "pointer",
                        }}
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                ))
              }

            </div>

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

              <h3
                style={{
                  marginBottom:
                    "25px",
                }}
              >
                Total:
                {" "}
                {totalPrice}
                {" "}
                EGP
              </h3>

              <Link
                to="/checkout"
              >

                <button
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
                      "#111",

                    color:
                      "#fff",

                    cursor:
                      "pointer",

                    fontSize:
                      "16px",
                  }}
                >
                  Proceed To Checkout
                </button>

              </Link>

            </div>

          </div>
        )
      }

    </div>
  );
};

export default CartPage;