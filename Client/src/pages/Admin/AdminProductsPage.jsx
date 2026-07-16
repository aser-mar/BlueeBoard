import {
  useEffect,
  useMemo,
  useState,
} from "react";
import "./AdminProductsPage.css";
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";


import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import {
  Link,
} from "react-router-dom";

const AdminProductsPage =
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



    const filteredProducts = useMemo(() => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return products;

      return products.filter((product) => {
        const title = product.name?.toLowerCase() || "";
        const categoryName = product.category?.name?.toLowerCase() || "";
        const companyName =
          typeof product.company === "string"
            ? product.company.toLowerCase()
            : product.company?.name?.toLowerCase() || "";
        const priceText = product.price?.toString().toLowerCase() || "";

        return (
          title.includes(query) ||
          categoryName.includes(query) ||
          companyName.includes(query) ||
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
              await getProducts();

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

    }, []);

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

          await deleteProduct(id);

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
            <h1 className="page-title">Admin Products</h1>
            <p className="page-subtitle">Manage catalog, pricing and inventory</p>
          </div>

          <Link to="/admin/products/add" className="admin-products-add-button">
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
              placeholder="Search products, categories, companies, or price"
              aria-label="Search products"
            />
          </div>
          <Link to="/admin/products/add" className="admin-products-add-button">
            Add Product
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {products.length === 0 ? (

          <div className="admin-products-empty-state">
            <svg className="admin-products-empty-state__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2>No Products Found</h2>
            <p>Start adding products to populate your catalog.</p>
            <Link to="/admin/products/add" className="admin-products-empty-state__button">Add Product</Link>
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="admin-products-empty-state">
            <div className="admin-products-empty-state__icon">
              <HiOutlineSearch />
            </div>
            <h2>No matching products found.</h2>
            <p>Try another keyword or clear the search to view all products.</p>
            <Link to="/admin/products/add" className="admin-products-empty-state__button">Add Product</Link>
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
                      <span className="badge muted">{product.company?.name || "-"}</span>
                      <span className="badge muted">Stock: {product.stock}</span>
                    </div>
                    <div className="product-price admin-products-price">{product.price} EGP</div>
                  </div>

                </div>

                <div className="admin-products-actions">
                  <Link to={`/admin/products/${product._id}/edit`} className="admin-products-action-button">
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
  AdminProductsPage;