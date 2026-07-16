import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBannerById, updateBanner } from "../../services/bannerService";
import { uploadImage } from "../../services/uploadService";
import { getProducts } from "../../services/productService";
import {
  HiOutlineSparkles,
  HiOutlinePhotograph,
} from "react-icons/hi";

import "./AdminBannerForm.css";

const AdminEditBannerPage = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const { token } =
    useSelector(
      (state) => state.auth
    );

  const [title,
    setTitle] =
    useState("");

  const [image,
    setImage] =
    useState("");

  const [uploading,
    setUploading] =
    useState(false);

  const [link,
    setLink] =
    useState("");

  const [position,
    setPosition] =
    useState(1);

  const [isActive,
    setIsActive] =
    useState(true);

  const [product, setProduct] = useState("");

  const [products, setProducts] = useState([]);

  const [error, setError] = useState("");  

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getBannerById(
              id
            );

          setTitle(
            data.title
          );

          setImage(
            data.image || null
          );

          setLink(
            data.link
          );

          setPosition(
            data.position
          );

          setIsActive(
            data.isActive
          );

          setProduct(
            data.product?._id ||
            data.product ||
            ""
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchData();  

  }, [id]);

  useEffect(() => {

  const fetchProducts = async () => {

    try {

      const data =
        await getProducts();

      setProducts(data || []);

    } catch (error) {

      console.log(error);
    }
  };

  fetchProducts();

}, []);

  const handleImageUpload =
  async (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      setUploading(true);

      const result =
  await uploadImage(
    file,
    token
  );

setImage(
  result || null
);

    } catch (error) {

      console.log(error);

      alert(
        "Image upload failed"
      );

    } finally {

      setUploading(false);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError("Please enter banner title");
      return false;
    }

    if (!image) {
      setError("Please upload banner image");
      return false;
    }

    if (!product) {
      setError("Please select banner product");
      return false;
    }

    if (!position || Number(position) <= 0) {
      setError("Please enter a valid position greater than 0");
      return false;
    }

    setError("");
    return true;
  };

  const submitHandler =
    async (e) => {

      e.preventDefault();

      if (!validateForm()) return;

      try {

        const bannerData = {
          title,
          image,
          link,
          position,
          isActive,
          product,  
        };

        await updateBanner(
          id,
          bannerData
        );

        alert(
          "Banner Updated"
        );

        navigate(
          "/admin/banners"
        );

      } catch (error) {
        console.log(error);

        setError(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
        );
      }
    };

  return (
    <div className="banner-form-container">
      <header className="banner-hero">
        <div className="banner-hero-icon">
          <HiOutlineSparkles />
        </div>
        <div className="banner-hero-text">
          <h1>Edit Banner</h1>
          <p>Update banner content and manage homepage visibility.</p>
        </div>
      </header>

      {error && <div className="banner-error" role="status">{error}</div>}

      <form onSubmit={submitHandler} className="banner-form">
        {/* Banner Information */}
        <section className="form-section">
          <div className="form-section-title">
            <span>📋</span>
            Banner Information
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label htmlFor="title">Banner Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter banner title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="link">Link (Optional)</label>
              <input
                id="link"
                type="text"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Display Position</label>
              <input
                id="position"
                type="number"
                placeholder="1"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label htmlFor="product">Product</label>
              <select
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Banner Image */}
        <section className="form-section">
          <div className="form-section-title">
            <HiOutlinePhotograph />
            Banner Image
          </div>
          <div className="image-section">
            {image && (
              <div className="banner-preview-container">
                <img src={image?.url} alt="banner preview" />
              </div>
            )}
            <label className="upload-zone">
              <div className="upload-icon">🖼️</div>
              <p className="upload-text">Click to upload new image</p>
              <p className="upload-sub">PNG, JPG recommended: 1200x400px</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {uploading && <div className="uploading-badge">Uploading image...</div>}
          </div>
        </section>

        {/* Visibility Settings */}
        <section className="form-section">
          <div className="form-section-title">
            <span>👁️</span>
            Visibility Settings
          </div>
          <div className="checkbox-group">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="isActive">Active</label>
          </div>
        </section>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default
AdminEditBannerPage;