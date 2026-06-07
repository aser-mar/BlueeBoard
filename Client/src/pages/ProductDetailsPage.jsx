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
} from "react-redux";

import {
  addToCart,
} from "../redux/slices/cartSlice";

import {
  getProductById,
} from "../services/productService";

const ProductDetailsPage =
  () => {

    const [product, setProduct] =
      useState(null);

    const { id } =
      useParams();

    const dispatch =
      useDispatch();

    useEffect(() => {

      const fetchProduct =
        async () => {

          try {

            const data =
              await getProductById(
                id
              );

            setProduct(data);

          } catch (error) {

            console.log(error);
          }
        };

      fetchProduct();

    }, [id]);

    const addProductToCart =
      () => {

        dispatch(
          addToCart(product)
        );
      };

    if (!product) {

      return (

        <div
          className="container"

          style={{
            paddingTop: "40px",
          }}
        >

          <h1>
            Loading...
          </h1>

        </div>
      );
    }

    return (

      <div
        className="container"

        style={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",

            gap: "40px",

            alignItems: "start",
          }}
        >

          {/* IMAGE */}

          <div>

            {
              product.images?.[0] && (

                <img
                  src={
                    product.images[0]
                  }

                  alt={
                    product.name
                  }

                  style={{
                    width: "100%",

                    borderRadius:
                      "12px",

                    objectFit:
                      "cover",

                    maxHeight:
                      "500px",
                  }}
                />
              )
            }

          </div>

          {/* DETAILS */}

          <div>

            <h1
              style={{
                marginBottom:
                  "20px",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: "#666",

                marginBottom:
                  "20px",

                lineHeight:
                  "1.8",
              }}
            >
              {
                product.description
              }
            </p>

            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              {product.price} EGP
            </h2>

            <p
              style={{
                marginBottom:
                  "25px",
              }}
            >
              Stock:
              {" "}

              {
                product.stock
              }
            </p>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",

                gap: "15px",

                flexWrap: "wrap",
              }}
            >

              <button
                onClick={
                  addProductToCart
                }

                style={{
                  padding:
                    "12px 20px",

                  border: "none",

                  borderRadius:
                    "8px",

                  background:
                    "#111",

                  color:
                    "white",

                  cursor:
                    "pointer",

                  fontSize:
                    "16px",
                }}
              >
                Add To Cart
              </button>

              <Link
                to="/cart"

                style={{
                  padding:
                    "12px 20px",

                  borderRadius:
                    "8px",

                  background:
                    "#eee",

                  textDecoration:
                    "none",

                  color:
                    "#111",

                  display:
                    "flex",

                  alignItems:
                    "center",
                }}
              >
                Go To Cart
              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  };

export default
ProductDetailsPage;