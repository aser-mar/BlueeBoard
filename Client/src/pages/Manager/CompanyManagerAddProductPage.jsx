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
import { useTranslation } from "react-i18next";

import ImageUploader from "../../components/ImageUploader";
import "../Admin/AdminProductForm.css";

const CompanyManagerAddProductPage =
  () => {
    const { t } = useTranslation();

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


    const [category, setCategory] =
      useState("");

    const [isSoldOut, setIsSoldOut] =
      useState(false);

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

          setError(t("admin.errProductName"));

          return false;
        }

        if (!images) {
            setError(t("admin.errProductImage"));
            return false;
        }

        if (
          description
            .trim()
            .length < 10
        ) {

          setError(t("admin.errProductDesc"));

          return false;
        }

        if (!price.trim()) {
            setError(t("admin.errProductPrice"));
            return false;
        }

        if (Number(price) <= 0) {
            setError(t("admin.errProductPrice"));
            return false;
        }


        if (!category) {

          setError(t("admin.errSelectCategory"));

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
            isSoldOut,

            images: images
              ? [images]
              : [],



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
            t("admin.errSomethingWentWrong")
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
              <h1>{t("admin.addProduct")}</h1>
              <p>{t("admin.addProductDesc")}</p>
            </div>
          </div>

          {error && <div className="product-error" role="status">{error}</div>}

          <form onSubmit={submitHandler} className="product-form">

            {/* Card 1: Product Information */}
            <div className="form-section">
              <div className="form-section-title">{t("admin.productInfo")}</div>
              <div className="form-row full">
                <div className="form-group">
                  <label>{t("admin.productName")}</label>
                  <input type="text" placeholder={t("admin.productName")} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="form-row full">
                <div className="form-group">
                  <label>{t("admin.description")}</label>
                  <textarea placeholder={t("admin.description")} value={description} onChange={(e) => setDescription(e.target.value)} rows="5" />
                </div>
              </div>
            </div>

            {/* Card 2: Pricing & Inventory */}
            <div className="form-section">
              <div className="form-section-title">{t("admin.pricingInventory")}</div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t("admin.price")}</label>
                  <input type="number" placeholder={t("admin.price")} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

              </div>
            </div>

            {/* Card 3: Category */}
            <div className="form-section">
              <div className="form-section-title">{t("admin.category")}</div>
              <div className="form-row full">
                <div className="form-group">
                  <label>{t("admin.category")}</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">{t("admin.selectCategory")}</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">{t("admin.availability")}</div>
              <div className="form-group">
                <label>{t("admin.markSoldOut")}</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isSoldOut"
                    checked={isSoldOut}
                    onChange={(e) => setIsSoldOut(e.target.checked)}
                  />
                  <label htmlFor="isSoldOut">
                    {t("admin.soldOutDesc")}
                  </label>
                </div>
              </div>
            </div>

            {/* Card 4: Product Image */}
            <div className="form-section">
              <div className="form-section-title">{t("admin.productImage")}</div>
              <div className="image-section">
                <ImageUploader value={images} onUpload={setImages} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t("admin.addingProduct") : t("admin.addProduct")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default
  CompanyManagerAddProductPage;