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

import { useTranslation } from "react-i18next";
import ImageUploader from "../../components/ImageUploader";
import "./AdminProductForm.css";

const AdminEditProductPage =
  () => {
    const { t } = useTranslation();

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


    const [category, setCategory] =
      useState("");

    const [company, setCompany] =
      useState("");

    const [isSoldOut, setIsSoldOut] =
      useState(false);

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

            setIsSoldOut(
              data.isSoldOut || false
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

          setError(t("admin.errProductName"));

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

        if (Number(price) <= 0) {
          setError(t("admin.errProductPrice"));
          return false;
        }

        if (!images) {
          setError(t("admin.errProductImage"));
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

          const productData = {
            name,
            description,

            price: Number(price),
            isSoldOut,

            images: images
              ? [
                {
                  url: images.url,
                  public_id: images.public_id,
                },
              ]
              : [],



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

          setError(t("admin.errSomethingWentWrong"));

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
              <h1>{t("admin.editProduct")}</h1>
              <p>{t("admin.editProductDesc")}</p>
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

            {/* Card 4: Product Image */}
            <div className="form-section">
              <div className="form-section-title">{t("admin.productImage")}</div>
              <div className="image-section">
                <ImageUploader value={images} onUpload={setImages} />
              </div>
            </div>

            {/* Card 5: Visibility & Placement */}
            <div className="form-section">
              <div className="form-section-title">
                {t("admin.visibilityPlacement")}
              </div>

              <div className="form-row full">
                <div className="form-group">
                  <label>{t("admin.productPlacement")}</label>

                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                  >
                    <option value="normal">
                      {t("admin.normalProduct")}
                    </option>

                    <option value="featured">
                      {t("admin.featuredProduct")}
                    </option>

                    <option value="sponsored">
                      {t("admin.sponsoredProduct")}
                    </option>

                  </select>
                </div>
              </div>

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

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t("admin.updatingProduct") : t("admin.updateProduct")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default
  AdminEditProductPage;