import { Link, useLocation } from "react-router-dom";

const ManagerSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      style={{
        width: "250px",
        background: "#f4f4f4",
        minHeight: "100vh",
        padding: "30px 20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2 style={{ marginBottom: "30px", fontSize: "1.2rem", fontWeight: "bold" }}>
        Company Manager
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "15px" }}>
          <Link
            to="/company-manager"
            style={{
              textDecoration: "none",
              color: isActive("/company-manager") ? "#111" : "#666",
              fontWeight: isActive("/company-manager") ? "bold" : "normal",
              display: "block",
              padding: "10px",
              borderRadius: "8px",
              background: isActive("/company-manager") ? "#fff" : "transparent",
              border: isActive("/company-manager") ? "1px solid #ddd" : "none",
            }}
          >
            Dashboard
          </Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link
            to="/company-manager/products"
            style={{
              textDecoration: "none",
              color: isActive("/company-manager/products") ? "#111" : "#666",
              fontWeight: isActive("/company-manager/products") ? "bold" : "normal",
              display: "block",
              padding: "10px",
              borderRadius: "8px",
              background: isActive("/company-manager/products") ? "#fff" : "transparent",
              border: isActive("/company-manager/products") ? "1px solid #ddd" : "none",
            }}
          >
            Products
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ManagerSidebar;