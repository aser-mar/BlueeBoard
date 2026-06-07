
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  createProduct,
} from "../../services/productService";

import {
  getCategories,
} from "../../services/categoryService";

import {
  getCompanies,
} from "../../services/companyService";

const AdminAddProductPage =
  () => {

    const navigate =
      useNavigate();

    const [name, setName] =
      useState("");

    const [
      description,
      setDescription,
    ] = useState("");

    const [price, setPrice] =
      useState("");

    const [images, setImages] =
      useState("");

    const [stock, setStock] =
      useState("");

    const [category, setCategory] =
      useState("");

    const [company, setCompany] =
      useState("");

    // ⭐ NEW
    const [
      placement,
      setPlacement,
    ] = useState("normal");

    const [
      categories,
      setCategories,
    ] = useState([]);

    const [
      companies,
      setCompanies,
    ] = useState([]);

    const [error, setError] =
      useState("");

    const [loading, setLoading] =
      useState(false);

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
          }
        };

      loadCompanies();

    }, []);

    // FETCH CATEGORIES
    useEffect(() => {

      const loadCategories =
        async () => {

          try {

            if (!company) {

              setCategories([]);

              return;
            }

            const data =
              await getCategories(
                company
              );

            setCategories(
              data || []
            );

          } catch (error) {

            console.log(
              error
            );
          }
        };

      loadCategories();

    }, [company]);

    // VALIDATION
    const validateForm =
      () => {

        if (
          name.trim()
            .length < 3
        ) {

          setError(
            "Product name must be at least 3 characters"
          );

          return false;
        }

        if (
          description
            .trim()
            .length < 10
        ) {

          setError(
            "Description must be at least 10 characters"
          );

          return false;
        }

        if (
          Number(price) <= 0
        ) {

          setError(
            "Price must be greater than 0"
          );

          return false;
        }

        if (
          Number(stock) < 0
        ) {

          setError(
            "Stock cannot be negative"
          );

          return false;
        }

        if (!company) {

          setError(
            "Please select a company"
          );

          return false;
        }

        if (!category) {

          setError(
            "Please select a category"
          );

          return false;
        }

        setError("");

        return true;
      };

    // SUBMIT
    const submitHandler =
      async (e) => {

        e.preventDefault();

        const isValid =
          validateForm();

        if (!isValid) {
          return;
        }

        try {

          setLoading(true);

          const productData =
            {
              name,

              description,

              price,

              images: images
                ? [images]
                : [],

              stock,

              category,

              company,

              // ⭐ NEW
              placement,
            };

          await createProduct(
            productData
          );

          alert(
            "Product Added Successfully"
          );

          navigate(
            "/admin/products"
          );

        } catch (error) {

          console.log(
            error
          );

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
          Add Product
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

        <form
          onSubmit={
            submitHandler
          }

          style={{
            maxWidth:
              "600px",
          }}
        >

          <input
            type="text"

            placeholder="Product Name"

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

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          />

          <textarea
            placeholder="Description"

            value={description}

            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }

            rows="5"

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",

              resize:
                "none",
            }}
          />

          <input
            type="number"

            placeholder="Price"

            value={price}

            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          />

          <input
            type="text"

            placeholder="Image URL"

            value={images}

            onChange={(e) =>
              setImages(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          />

          <input
            type="number"

            placeholder="Stock"

            value={stock}

            onChange={(e) =>
              setStock(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          />

          {/* COMPANY */}

          <select
            value={company}

            onChange={(e) => {

              setCompany(
                e.target.value
              );

              setCategory("");
            }}

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

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

          {/* CATEGORY */}

          <select
            value={category}

            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "20px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          >

            <option value="">
              Select Category
            </option>

            {
              categories.map(
                (cat) => (

                  <option
                    key={
                      cat._id
                    }

                    value={
                      cat._id
                    }
                  >
                    {
                      cat.name
                    }
                  </option>
                )
              )
            }

          </select>

          {/* ⭐ PRODUCT PLACEMENT */}

          <select
            value={placement}

            onChange={(e) =>
              setPlacement(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              padding:
                "12px",

              marginBottom:
                "25px",

              borderRadius:
                "8px",

              border:
                "1px solid #ccc",
            }}
          >

            <option value="normal">
              Normal Product
            </option>

            <option value="featured">
              Featured Product ⭐
            </option>

            <option value="sponsored">
              Sponsored Product 💰
            </option>

          </select>

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
                ? "Adding Product..."
                : "Add Product"
            }
          </button>

        </form>

      </div>
    );
  };

export default
AdminAddProductPage;