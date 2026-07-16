import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="dashboard-layout">

      <AdminSidebar />

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;