import {
  useEffect,
  useState,
} from "react";

import {
  getCompanies,
  deleteCompany,
} from "../../services/companyService";

import {
  Link,
} from "react-router-dom";

const AdminCompaniesPage =
  () => {

    const [
      companies,
      setCompanies,
    ] = useState([]);

    const [loading, setLoading] =
      useState(true);

    const [
      deleteLoadingId,
      setDeleteLoadingId,
    ] = useState(null);

    const [error, setError] =
      useState("");

    // FETCH COMPANIES
    useEffect(() => {

      const loadCompanies =
        async () => {

          try {

            const data =
              await getCompanies();

            setCompanies(
              data || []
            );

          } catch (error) {

            console.log(
              error
            );

            setError(
              "Failed to load companies"
            );

          } finally {

            setLoading(false);
          }
        };

      loadCompanies();

    }, []);

    // DELETE COMPANY
    const deleteHandler =
      async (id) => {

        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this company?"
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

          await deleteCompany(
            id
          );

          setCompanies(
            (
              prevCompanies
            ) =>
              prevCompanies.filter(
                (
                  company
                ) =>
                  company._id !==
                  id
              )
          );

        } catch (error) {

          console.log(
            error
          );

          alert(
            "Failed to delete company"
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
            Loading Companies...
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

        {/* HEADER */}

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
            Admin Companies
          </h1>

          <Link
            to="/admin/companies/add"

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
            Add Company
          </Link>

        </div>

        {/* ERROR */}

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

        {/* EMPTY */}

        {
          companies.length ===
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
                No Companies Found
              </h3>

              <p>
                Start adding companies
              </p>

            </div>

          ) : (

            companies.map(
              (
                company
              ) => (

                <div
                  key={
                    company._id
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

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: "15px",

                          marginBottom:
                            "12px",

                          flexWrap:
                            "wrap",
                        }}
                      >

                        {/* LOGO */}

                        {
                          company.logo ? (

                            <img
                              src={
                                company.logo
                              }

                              alt={
                                company.name
                              }

                              style={{
                                width:
                                  "70px",

                                height:
                                  "70px",

                                objectFit:
                                  "cover",

                                borderRadius:
                                  "12px",

                                border:
                                  "1px solid #ddd",
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
                                  "12px",

                                background:
                                  "#eee",

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                fontSize:
                                  "12px",

                                color:
                                  "#666",
                              }}
                            >
                              No Logo
                            </div>
                          )
                        }

                        <div>

                          <h3
                            style={{
                              marginBottom:
                                "8px",
                            }}
                          >
                            {
                              company.name
                            }
                          </h3>

                          <p
                            style={{
                              color:
                                "#666",

                              maxWidth:
                                "500px",

                              lineHeight:
                                "1.6",
                            }}
                          >
                            {
                              company.description ||
                              "No description"
                            }
                          </p>

                        </div>

                      </div>

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
                        to={`/admin/companies/${company._id}/edit`}

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
                            company._id
                          )
                        }

                        disabled={
                          deleteLoadingId ===
                          company._id
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
                            company._id
                              ? 0.7
                              : 1,
                        }}
                      >
                        {
                          deleteLoadingId ===
                          company._id
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
AdminCompaniesPage;