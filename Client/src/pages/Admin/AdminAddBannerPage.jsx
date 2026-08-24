import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createBanner } from "../../services/bannerService";
import { uploadImage } from "../../services/uploadService";
import { getProducts } from "../../services/productService";
import {
  HiOutlinePhotograph,
  HiOutlineSparkles,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";

import "./AdminBannerForm.css";

const AdminAddBannerPage =
  () => {
    const { t } = useTranslation();

  const navigate =
    useNavigate();

  const [title, setTitle] =
    useState("");

  const [image, setImage] =
    useState("");

  const [link, setLink] =
    useState("");

  const [position,
    setPosition] =
    useState(1);

  const [uploading,
    setUploading] =
    useState(false);

  const [product,
    setProduct] = 
    useState("");

  const [products,
    setProducts] = 
    useState([]);

  const [error,
    setError] =
    useState("");

  const { token } =
    useSelector(
      (state) => state.auth
    );

  useEffect(() => {

  }, []);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
}, []);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setUploading(true);

    const result = await uploadImage(file, token);

    setImage(result || null);

  } catch (error) {
    console.log(error);
    alert("Image upload failed");
  } finally {
    setUploading(false);
  }
};

  const validateForm = () => {
    if (!title.trim()) {
      setError(t("admin.errBannerTitle"));
      return false;
    }

    if (!image) {
      setError(t("admin.errBannerImage"));
      return false;
    }

    if (!product) {
      setError(t("admin.errBannerProduct"));
      return false;
    }

    if (!position || Number(position) <= 0) {
      setError(t("admin.errBannerPosition"));
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
          product,
        };

        await createBanner(
          bannerData
        );

        alert(
          "Banner Added"
        );

        navigate(
          "/admin/banners"
        );

      } catch (error) {
  console.log(error);

    setError(
      error.response?.data?.message ||
      error.response?.data?.error ||
      t("admin.errSomethingWentWrong")
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
          <h1>{t("admin.addBanner")}</h1>
          <p>{t("admin.addBannerDesc")}</p>
        </div>
      </header>

      {error && <div className="banner-error" role="status">{error}</div>}

      <form onSubmit={submitHandler} className="banner-form">
        {/* Banner Information */}
        <section className="form-section">
          <div className="form-section-title">
            <span>📋</span>
            {t("admin.bannerInfo")}
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label htmlFor="title">{t("admin.bannerTitle")}</label>
              <input
                id="title"
                type="text"
                placeholder={t("admin.bannerTitle")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="link">{t("admin.linkOptional")}</label>
              <input
                id="link"
                type="text"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">{t("admin.displayPosition")}</label>
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
              <label htmlFor="product">{t("admin.product")}</label>
              <select
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">{t("admin.selectProduct")}</option>
                {products.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name}
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
            {t("admin.bannerImage")}
          </div>
          <div className="image-section">
            <label className="upload-zone">
              <div className="upload-icon">🖼️</div>
              <p className="upload-text">Click to upload banner image</p>
              <p className="upload-sub">PNG, JPG recommended: 1200x400px</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {uploading && <div className="uploading-badge">Uploading image...</div>}
            {image && !uploading && (
              <div className="banner-preview-container">
                <img src={image?.url} alt="banner preview" />
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {uploading ? t("admin.addingBanner") : t("admin.addBanner")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddBannerPage;