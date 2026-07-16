import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSelector } from "react-redux";

import {
  getMyCompanyProducts,
  deleteMyCompanyProduct,
} from "../../services/companyManagerProductService";

import {
  Link,
} from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import "../Admin/AdminProductsPage.css";

const CompanyManagerProductsPage =
  () => {

    const [
      products,
      setProducts,
    ] = useState([]);

    const [loading, setLoading] =
      useState(true);

    const [
      deleteLoadingId,
      setDeleteLoadingId,
    ] = useState(null);

    const [error, setError] =
      useState("");

    const [searchTerm, setSearchTerm] =
      useState("");

    const { token } = useSelector(
      (state) => state.auth
    );

    const filteredProducts = useMemo(() => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return products;

      return products.filter((product) => {
        const title = product.name?.toLowerCase() || "";
        const categoryName = product.category?.name?.toLowerCase() || "";
        const priceText = product.price?.toString().toLowerCase() || "";

        return (
          title.includes(query) ||
          categoryName.includes(query) ||
          priceText.includes(query)
        );
      });
    }, [products, searchTerm]);

    // FETCH PRODUCTS
    useEffect(() => {

      const loadProducts =
        async () => {

          try {

            const data =
              await getMyCompanyProducts(token);

            setProducts(
              data || []
            );

          } catch (error) {

            console.log(
              error
            );

            setError(
              "Failed to load products"
            );

          } finally {

            setLoading(false);
          }
        };

      loadProducts();

    }, [token]);

    // DELETE PRODUCT
    const deleteHandler =
      async (id) => {

        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this product?"
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

          await deleteMyCompanyProduct(id);

          setProducts(
            (
              prevProducts
            ) =>
              prevProducts.filter(
                (
                  product
                ) =>
                  product._id !==
                  id
              )
          );

        } catch (error) {

          console.log(
            error
          );

          alert(
            "Failed to delete product"
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
        <div className="admin-products-page">
          <div className="admin-products-header">
            <div className="skeleton skeleton--text-large"></div>
          </div>
          <div className="admin-products-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="admin-products-skeleton-card">
                <div className="skeleton skeleton--icon-small"></div>
                <div className="skeleton skeleton--text-medium"></div>
                <div className="skeleton skeleton--text-sm"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="admin-products-page">
        <div className="admin-products-header">
          <div className="page-title-group">
            <h1 className="page-title">Company Products</h1>
            <p className="page-subtitle">Manage your company's catalog and inventory</p>
          </div>
          <Link to="/company-manager/products/add" className="admin-products-add-button">
            Add Product
          </Link>
        </div>

        <div className="admin-products-search-card">
          <div className="admin-products-search">
            <HiOutlineSearch className="admin-products-search__icon" />
            <input
              className="admin-products-search__input"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, categories, or price"
              aria-label="Search products"
            />
          </div>
          <Link to="/company-manager/products/add" className="admin-products-add-button">
            Add Product
          </Link>
        </div>

        {error && <div className="alert alert-error admin-products-error">{error}</div>}

        {filteredProducts.length === 0 ? (
          <div className="admin-products-empty-state">
            <div className="admin-products-empty-state__icon">
              <HiOutlineSearch />
            </div>
            <h2>No matching products found.</h2>
            <p>Try another keyword or clear the search to view all products.</p>
            <Link to="/company-manager/products/add" className="admin-products-empty-state__button">Add Product</Link>
          </div>
        ) : (
          <div className="admin-products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card admin-products-card">
                <div className="product-main">
                  <div className="product-media">
                    <img
                      src={product.images?.[0]?.url || product.images?.[0] || "/no-image.png"}
                      alt={product.name}
                      className="product-image admin-products-image"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name admin-products-name">{product.name}</h3>
                    <div className="product-meta admin-products-meta">
                      <span className="badge muted">{product.category?.name || "No Category"}</span>
                      <span className="badge muted">Stock: {product.stock}</span>
                    </div>
                    <div className="product-price admin-products-price">{product.price} EGP</div>
                  </div>
                </div>
                <div className="admin-products-actions">
                  <Link to={`/company-manager/products/${product._id}/edit`} className="admin-products-action-button">
                    <HiOutlinePencil className="admin-products-action-button__icon" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteHandler(product._id)}
                    disabled={deleteLoadingId === product._id}
                    className="admin-products-action-button admin-products-action-button--danger"
                    aria-disabled={deleteLoadingId === product._id}
                  >
                    {deleteLoadingId === product._id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <HiOutlineTrash className="admin-products-action-button__icon" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default
  CompanyManagerProductsPage;