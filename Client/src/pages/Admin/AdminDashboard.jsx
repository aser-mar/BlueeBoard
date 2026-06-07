import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <hr />

      {/* PRODUCTS */}
      <h2>Products</h2>
      <Link to="/admin/products">Manage Products</Link>
      <br />
      <Link to="/admin/add-product">Add Product</Link>

      <hr />

      {/* COMPANIES */}
      <h2>Companies</h2>
      <Link to="/admin/companies">Manage Companies</Link>
      <br />
      <Link to="/admin/add-company">Add Company</Link>

      <hr />

      {/* CATEGORIES */}
      <h2>Categories</h2>
      <Link to="/admin/categories">Manage Categories</Link>
      <br />

      <hr />

      {/* BANNERS */}
      <h2>Banners</h2>
      <Link to="/admin/banners">Manage Banners</Link>
      <br />
      <Link to="/admin/add-banner">Add Banner</Link>

      <hr />

      {/* ORDERS */}
      <h2>Orders</h2>
      <Link to="/admin/orders">Manage Orders</Link>
    </div>
  );
};

export default AdminDashboard;