import {
  useEffect,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import axios from "axios";

import {
  getCompanies,
} from "../../services/companyService";

const AdminCategoriesPage =
  () => {

    const [
      categories,
      setCategories,
    ] = useState([]);

    const [
      companies,
      setCompanies,
    ] = useState([]);

    const [name, setName] =
      useState("");

    const [
      company,
      setCompany,
    ] = useState("");

    const [
      editingId,
      setEditingId,
    ] = useState(null);

    const [
      editName,
      setEditName,
    ] = useState("");

    const [loading, setLoading] =
      useState(true);

    const [
      actionLoadingId,
      setActionLoadingId,
    ] = useState(null);

    const [error, setError] =
      useState("");

    const { token } =
      useSelector(
        (state) =>
          state.auth
      );

    const API =
      "http://localhost:5000/api/categories";

    // FETCH DATA
    useEffect(() => {

      const loadData =
        async () => {

          try {

            const categoriesRes =
              await axios.get(
                API
              );

            setCategories(
              categoriesRes.data ||
                []
            );

            const companiesData =
              await getCompanies();

            setCompanies(
              companiesData ||
                []
            );

          } catch (error) {

            console.log(
              error
            );

            setError(
              "Failed to load categories"
            );

          } finally {

            setLoading(false);
          }
        };

      loadData();

    }, []);

    // ADD CATEGORY
    const addCategory =
      async (e) => {

        e.preventDefault();

        if (
          !name.trim() ||
          !company
        ) {

          setError(
            "Please fill all fields"
          );

          return;
        }

        try {

          setError("");

          await axios.post(
            API,
            {
              name,
              company,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          const { data } =
            await axios.get(
              API
            );

          setCategories(
            data || []
          );

          setName("");

          setCompany("");

        } catch (error) {

          console.log(
            error
          );

          setError(
            "Failed to add category"
          );
        }
      };

    // START EDIT
    const startEdit =
      (cat) => {

        setEditingId(
          cat._id
        );

        setEditName(
          cat.name
        );
      };

    // SAVE EDIT
    const saveEdit =
      async (id) => {

        if (
          !editName.trim()
        ) {
          return;
        }

        try {

          setActionLoadingId(
            id
          );

          await axios.put(
            `${API}/${id}`,
            {
              name:
                editName,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          setCategories(
            (prev) =>
              prev.map(
                (cat) =>
                  cat._id ===
                  id
                    ? {
                        ...cat,
                        name:
                          editName,
                      }
                    : cat
              )
          );

          setEditingId(
            null
          );

          setEditName("");

        } catch (error) {

          console.log(
            error
          );

          alert(
            "Failed to update category"
          );

        } finally {

          setActionLoadingId(
            null
          );
        }
      };

    // DELETE CATEGORY
    const deleteCategory =
      async (id) => {

        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this category?"
          );

        if (
          !confirmDelete
        ) {
          return;
        }

        try {

          setActionLoadingId(
            id
          );

          await axios.delete(
            `${API}/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          setCategories(
            (prev) =>
              prev.filter(
                (cat) =>
                  cat._id !==
                  id
              )
          );

        } catch (error) {

          console.log(
            error
          );

          alert(
            "Failed to delete category"
          );

        } finally {

          setActionLoadingId(
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
            Loading Categories...
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

        <h1
          style={{
            marginBottom:
              "30px",
          }}
        >
          Categories
        </h1>

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

        {/* FORM */}

        <form
          onSubmit={
            addCategory
          }

          style={{
            border:
              "1px solid #ddd",

            borderRadius:
              "12px",

            padding:
              "20px",

            marginBottom:
              "30px",
          }}
        >

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "1fr 1fr auto",

              gap: "15px",
            }}
          >

            {/* NAME */}

            <input
              type="text"

              placeholder="Category Name"

              value={name}

              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

              style={{
                padding:
                  "12px",

                borderRadius:
                  "8px",

                border:
                  "1px solid #ccc",
              }}
            />

            {/* COMPANY */}

            <select
              value={company}

              onChange={(e) =>
                setCompany(
                  e.target.value
                )
              }

              style={{
                padding:
                  "12px",

                borderRadius:
                  "8px",

                border:
                  "1px solid #ccc",
              }}
            >

              <option value="">
                Select Company
              </option>

              {
                companies.map(
                  (comp) => (

                    <option
                      key={
                        comp._id
                      }

                      value={
                        comp._id
                      }
                    >
                      {
                        comp.name
                      }
                    </option>
                  )
                )
              }

            </select>

            <button
              type="submit"

              style={{
                padding:
                  "12px 18px",

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
              }}
            >
              Add
            </button>

          </div>

        </form>

        {/* EMPTY */}

        {
          categories.length ===
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
                No Categories Found
              </h3>

              <p>
                Start adding categories
              </p>

            </div>

          ) : (

            categories.map(
              (cat) => (

                <div
                  key={
                    cat._id
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

                      {
                        editingId ===
                        cat._id ? (

                          <input
                            type="text"

                            value={
                              editName
                            }

                            onChange={(
                              e
                            ) =>
                              setEditName(
                                e
                                  .target
                                  .value
                              )
                            }

                            style={{
                              padding:
                                "10px",

                              borderRadius:
                                "8px",

                              border:
                                "1px solid #ccc",

                              marginBottom:
                                "10px",
                            }}
                          />

                        ) : (

                          <h3
                            style={{
                              marginBottom:
                                "8px",
                            }}
                          >
                            {
                              cat.name
                            }
                          </h3>

                        )
                      }

                      <p
                        style={{
                          color:
                            "#666",
                        }}
                      >
                        Company:
                        {" "}
                        {
                          cat
                            .company
                            ?.name ||
                          "No Company"
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

                      {
                        editingId ===
                        cat._id ? (

                          <button
                            onClick={() =>
                              saveEdit(
                                cat._id
                              )
                            }

                            disabled={
                              actionLoadingId ===
                              cat._id
                            }

                            style={{
                              padding:
                                "10px 16px",

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
                            }}
                          >
                            {
                              actionLoadingId ===
                              cat._id
                                ? "Saving..."
                                : "Save"
                            }
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              startEdit(
                                cat
                              )
                            }

                            style={{
                              padding:
                                "10px 16px",

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
                            }}
                          >
                            Edit
                          </button>

                        )
                      }

                      <button
                        onClick={() =>
                          deleteCategory(
                            cat._id
                          )
                        }

                        disabled={
                          actionLoadingId ===
                          cat._id
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
                            actionLoadingId ===
                            cat._id
                              ? 0.7
                              : 1,
                        }}
                      >
                        {
                          actionLoadingId ===
                          cat._id
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
AdminCategoriesPage;