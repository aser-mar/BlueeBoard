import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getProductById,
  updateProduct,
} from "../../services/productService";

import {
  getCategories,
} from "../../services/categoryService";

import ImageUploader from "../../components/ImageUploader";
import "./AdminProductForm.css";

const AdminEditProductPage =
  () => {

    const { id } =
      useParams();

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

    const [company, setCompany] =
      useState("");

    const [
      placement,
      setPlacement,
    ] = useState("normal");

    const [
      categories,
      setCategories,
    ] = useState([]);

    const [error, setError] =
      useState("");

    const [loading, setLoading] =
      useState(false);

    // FETCH PRODUCT
    useEffect(() => {

      const fetchProduct =
        async () => {

          try {

            const data =
              await getProductById(
                id
              );

            setName(
              data.name || ""
            );

            setDescription(
              data.description ||
              ""
            );

            setPrice(
              data.price || ""
            );

            setImages(
              data.images?.[0] || null
            );

            setStock(
              data.stock || ""
            );

            setCategory(
              data.category?._id ||
              data.category ||
              ""
            );

            setCompany(
              data.company?._id ||
              data.company ||
              ""
            );

            setPlacement(
              data.placement || "normal"
            );

          } catch (error) {

            console.log(
              error
            );
          }
        };

      fetchProduct();

    }, [id]);

    // FETCH CATEGORIES
    useEffect(() => {

      if (!company) return;

      const fetchCategories = async () => {

        try {

          const data =
            await getCategories(company);

          setCategories(data || []);

        } catch (error) {

          console.log(error);
        }
      };

      fetchCategories();

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

        if (Number(price) <= 0) {
          setError("Price must be greater than 0");
          return false;
        }

        if (!images) {
          setError("Please upload product image");
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

          const productData = {
            name,
            description,

            price: Number(price),

            images: images
              ? [
                {
                  url: images.url,
                  public_id: images.public_id,
                },
              ]
              : [],

            stock: Number(stock),

            category,

            company,

            placement,
          };

          await updateProduct(
            id,
            productData
          );

          alert(
            "Product Updated Successfully"
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
      <div className="product-form-page">
        <div className="product-form-container">
          <div className="product-hero">
            <div className="product-hero-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <div className="product-hero-text">
              <h1>Edit Product</h1>
              <p>Update product information and manage marketplace visibility.</p>
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

            {/* Card 5: Visibility & Placement */}
            <div className="form-section">
              <div className="form-section-title">
                Visibility & Placement
              </div>

              <div className="form-row full">
                <div className="form-group">
                  <label>Product Placement</label>

                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
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
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default
  AdminEditProductPage;