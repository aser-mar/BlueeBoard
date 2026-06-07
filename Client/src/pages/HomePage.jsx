import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getCompanies,
} from "../services/companyService";

import {
  getFeaturedProducts,
} from "../services/productService";

import HomeBanner from "../components/HomeBanner";

const HomePage = () => {

  const [companies, setCompanies] =
    useState([]);

  const [
    featuredProducts,
    setFeaturedProducts,
  ] = useState([]);

  // FETCH COMPANIES
  useEffect(() => {

    const fetchCompanies =
      async () => {

        try {

          const data =
            await getCompanies();

          setCompanies(data);

        } catch (error) {

          console.log(error);
        }
      };

    fetchCompanies();

  }, []);

  // FETCH FEATURED PRODUCTS
  useEffect(() => {

    const fetchFeaturedProducts =
      async () => {

        try {

          const data =
            await getFeaturedProducts();

          setFeaturedProducts(
            data
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchFeaturedProducts();

  }, []);

  return (

    <div
      style={{
        padding: "20px",
      }}
    >

      <h1>
        Blue Board
      </h1>

      <HomeBanner />

      {/* ⭐ FEATURED PRODUCTS */}

      {
        featuredProducts
          .length > 0 && (

          <div
            style={{
              marginBottom:
                "50px",
            }}
          >

            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Featured Products
            </h2>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",

                gap: "20px",
              }}
            >

              {
                featuredProducts.map(
                  (product) => (

                    <Link
                      key={
                        product._id
                      }

                      to={`/product/${product._id}`}

                      style={{
                        textDecoration:
                          "none",

                        border:
                          "1px solid #ddd",

                        borderRadius:
                          "12px",

                        overflow:
                          "hidden",

                        background:
                          "#fff",

                        color:
                          "#111",
                      }}
                    >

                      <img
                        src={
                          product
                            .images?.[0] ||
                          "https://dummyimage.com/300x200/cccccc/000000&text=No+Image"
                        }

                        alt={
                          product.name
                        }

                        onError={(
                          e
                        ) => {

                          e.target.src =
                            "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                        }}

                        style={{
                          width:
                            "100%",

                          height:
                            "200px",

                          objectFit:
                            "cover",
                        }}
                      />

                      <div
                        style={{
                          padding:
                            "15px",
                        }}
                      >

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

                        <p
                          style={{
                            marginBottom:
                              "10px",

                            color:
                              "#666",
                          }}
                        >
                          {
                            product
                              .company
                              ?.name
                          }
                        </p>

                        <strong>
                          {
                            product.price
                          }
                          {" "}
                          EGP
                        </strong>

                      </div>

                    </Link>
                  )
                )
              }

            </div>

          </div>
        )
      }

      {/* COMPANIES */}

      <h2>
        Companies
      </h2>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",

          gap: "20px",
        }}
      >

        {
          companies.map(
            (company) => (

              <Link
                key={
                  company._id
                }

                to={`/company/${company._id}`}

                style={{
                  textDecoration:
                    "none",

                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "10px",

                  padding:
                    "15px",

                  textAlign:
                    "center",

                  background:
                    "#fff",
                }}
              >

                {
                  company.logo ? (

                    <img
                      src={
                        company.logo
                      }

                      alt={
                        company.name
                      }

                      onError={(
                        e
                      ) => {

                        e.target.style.display =
                          "none";
                      }}

                      style={{
                        width:
                          "70px",

                        height:
                          "70px",

                        objectFit:
                          "cover",

                        borderRadius:
                          "50%",
                      }}
                    />

                  ) : (

                    <div
                      style={{
                        width:
                          "70px",

                        height:
                          "70px",

                        borderRadius:
                          "50%",

                        background:
                          "#eee",

                        margin:
                          "0 auto",
                      }}
                    />
                  )
                }

                <h3
                  style={{
                    marginTop:
                      "10px",
                  }}
                >
                  {
                    company.name
                  }
                </h3>

              </Link>
            )
          )
        }

      </div>

    </div>
  );
};

export default HomePage;