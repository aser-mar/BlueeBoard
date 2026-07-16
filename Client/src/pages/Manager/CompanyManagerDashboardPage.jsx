import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyCompanyProducts } from "../../services/companyManagerProductService";
import "../Admin/AdminDashboard.css";
import "../Admin/AdminProductsPage.css";

const CompanyManagerDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadProducts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyCompanyProducts(token);
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [token]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__hero">
          <div className="skeleton skeleton--text-large"></div>
        </div>
        <div className="admin-products-skeleton-card">
          <div className="admin-products-skeleton-table">
            <div className="skeleton skeleton--row"></div>
            <div className="skeleton skeleton--row"></div>
            <div className="skeleton skeleton--row"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__hero">
        <div className="admin-dashboard__hero-content">
          <h1 className="admin-dashboard__title">Company Manager Dashboard</h1>
          <p className="admin-dashboard__subtitle">Manage your company products</p>
        </div>
        <Link to="/company-manager/products/add" className="admin-button">
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="admin-products-empty-state">
          <svg className="admin-products-empty-state__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>No Products Found</h2>
          <p>Start adding products to populate your catalog.</p>
          <Link to="/company-manager/products/add" className="admin-products-empty-state__button">Add Product</Link>
        </div>
      ) : (
        <>
          <div className="admin-products-table-wrap">
            <div className="admin-products-table-scroll">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-products-table__name">{product.name}</div>
                      </td>
                      <td>
                        <span className="badge muted">{product.category?.name || "-"}</span>
                      </td>
                      <td>
                        <div className="admin-products-table__meta">${product.price}</div>
                      </td>
                      <td>
                        <div className="admin-products-table__meta">{product.stock}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="admin-products-cards">
            {products.map((product) => (
              <article key={product._id} className="admin-products-card" style={{gridTemplateColumns: '1fr'}}>
                <div className="admin-products-card__content">
                  <div>
                    <h3>{product.name}</h3>
                    <p className="admin-products-card__company">
                      {product.category?.name || "-"}
                    </p>
                  </div>
                  <div className="admin-products-card__footer" style={{marginTop: '12px'}}>
                    <span className="admin-products-card__price">${product.price}</span>
                    <span className="admin-products-card__placement">Stock: {product.stock}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyManagerDashboardPage;