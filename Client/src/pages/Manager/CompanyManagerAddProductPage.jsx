import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  createMyCompanyProduct,
} from "../../services/companyManagerProductService";

import {
  getCategories,
} from "../../services/categoryService";

import { useSelector } from "react-redux";

import ImageUploader from "../../components/ImageUploader";
import "../Admin/AdminProductForm.css";

const CompanyManagerAddProductPage =
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
      useState(null);

    const [stock, setStock] =
      useState("");

    const [category, setCategory] =
      useState("");

    const auth = useSelector((state) => state.auth);

    const userInfo = auth.userInfo;
    const company = userInfo?.company;

    const [
      categories,
      setCategories,
    ] = useState([]);

    const [error, setError] =
      useState("");

    const [loading, setLoading] =
      useState(false);

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

        if (!images) {
            setError("Please upload product image");
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

        if (!price.trim()) {
            setError("Please enter product price");
            return false;
        }

        if (Number(price) <= 0) {
            setError("Price must be greater than 0");
            return false;
        }

        if (!stock.trim()) {
            setError("Please enter product stock");
            return false;
        }

        if (Number(stock) < 0) {
            setError("Stock cannot be negative");
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
          };

          await createMyCompanyProduct(
            productData
          );

          alert(
            "Product Added Successfully"
          );

          navigate(
            "/company-manager/products"
          );

        } catch (error) {

          console.log(
            error
          );

          setError(
            error.response?.data?.message ||
            "Something went wrong"
          );

        } finally {

          setLoading(false);
        }
      };

    return (
      <div className="product-form-page">
        <div className="product-form-container">
          <div className="product-hero">
            <div className="product-hero-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div className="product-hero-text">
              <h1>Add Product</h1>
              <p>Create a new product and publish it to the marketplace.</p>
            </div>
          </div>

          {error && <div className="product-error">{error}</div>}

          <form onSubmit={submitHandler} className="product-form">

            {/* Card 1: Product Information */}
            <div className="form-section">
              <div className="form-section-title">Product Information</div>
              <div className="form-row full">
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="form-row full">
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" />
                </div>
              </div>
            </div>

            {/* Card 2: Pricing & Inventory */}
            <div className="form-section">
              <div className="form-section-title">Pricing & Inventory</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Card 3: Category */}
            <div className="form-section">
              <div className="form-section-title">Category</div>
              <div className="form-row full">
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Card 4: Product Image */}
            <div className="form-section">
              <div className="form-section-title">Product Image</div>
              <div className="image-section">
                <ImageUploader value={images} onUpload={setImages} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default
  CompanyManagerAddProductPage;