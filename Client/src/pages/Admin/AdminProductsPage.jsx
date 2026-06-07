import {
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import {
  Link,
} from "react-router-dom";

const AdminProductsPage =
  () => {

    const [
      products,
      setProducts,
    ] = useState([]);

    const [loading, setLoading] =
      useState(true);

    const [
      deleteLoadingId,
      setDeleteLoadingId,
    ] = useState(null);

    const [error, setError] =
      useState("");

    // FETCH PRODUCTS
    useEffect(() => {

      const loadProducts =
        async () => {

          try {

            const data =
              await getProducts();

            setProducts(
              data || []
            );

          } catch (error) {

            console.log(
              error
            );

            setError(
              "Failed to load products"
            );

          } finally {

            setLoading(false);
          }
        };

      loadProducts();

    }, []);

    // DELETE PRODUCT
    const deleteHandler =
      async (id) => {

        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this product?"
          );

        if (
          !confirmDelete
        ) {
          return;
        }

        try {

          setDeleteLoadingId(
            id
          );

          await deleteProduct(
            id
          );

          setProducts(
            (
              prevProducts
            ) =>
              prevProducts.filter(
                (
                  product
                ) =>
                  product._id !==
                  id
              )
          );

        } catch (error) {

          console.log(
            error
          );

          alert(
            "Failed to delete product"
          );

        } finally {

          setDeleteLoadingId(
            null
          );
        }
      };

    // LOADING
    if (loading) {

      return (

        <div
          className="container"

          style={{
            paddingTop:
              "40px",
          }}
        >

          <h2>
            Loading Products...
          </h2>

        </div>
      );
    }

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

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "30px",

            flexWrap:
              "wrap",

            gap: "15px",
          }}
        >

          <h1>
            Admin Products
          </h1>

          <Link
            to="/admin/products/add"

            style={{
              padding:
                "12px 18px",

              background:
                "#111",

              color:
                "#fff",

              borderRadius:
                "8px",

              textDecoration:
                "none",
            }}
          >
            Add Product
          </Link>

        </div>

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

        {
          products.length ===
          0 ? (

            <div
              style={{
                border:
                  "1px solid #ddd",

                borderRadius:
                  "12px",

                padding:
                  "30px",

                textAlign:
                  "center",
              }}
            >

              <h3>
                No Products Found
              </h3>

              <p>
                Start adding products
              </p>

            </div>

          ) : (

            products.map(
              (
                product
              ) => (

                <div
                  key={
                    product._id
                  }

                  style={{
                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    padding:
                      "20px",

                    marginBottom:
                      "20px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      gap: "20px",

                      flexWrap:
                        "wrap",
                    }}
                  >

                    {/* INFO */}

                    <div>

                      <h3
                        style={{
                          marginBottom:
                            "10px",
                        }}
                      >
                        {
                          product.name
                        }
                      </h3>

                      <p>
                        Price:
                        {" "}
                        {
                          product.price
                        }
                        {" "}
                        EGP
                      </p>

                      <p>
                        Stock:
                        {" "}
                        {
                          product.stock
                        }
                      </p>

                      <p>
                        Category:
                        {" "}
                        {
                          product
                            .category
                            ?.name ||
                          "No Category"
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

                      <Link
                        to={`/admin/products/${product._id}/edit`}

                        style={{
                          padding:
                            "10px 16px",

                          background:
                            "#111",

                          color:
                            "#fff",

                          borderRadius:
                            "8px",

                          textDecoration:
                            "none",
                        }}
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          deleteHandler(
                            product._id
                          )
                        }

                        disabled={
                          deleteLoadingId ===
                          product._id
                        }

                        style={{
                          padding:
                            "10px 16px",

                          border:
                            "none",

                          borderRadius:
                            "8px",

                          background:
                            "#c62828",

                          color:
                            "#fff",

                          cursor:
                            "pointer",

                          opacity:
                            deleteLoadingId ===
                            product._id
                              ? 0.7
                              : 1,
                        }}
                      >
                        {
                          deleteLoadingId ===
                          product._id
                            ? "Deleting..."
                            : "Delete"
                        }
                      </button>

                    </div>

                  </div>

                </div>
              )
            )
          )
        }

      </div>
    );
  };

export default
AdminProductsPage;