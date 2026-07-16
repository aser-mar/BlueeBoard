import { Outlet } from "react-router-dom";
import CompanyManagerSidebar from "../components/CompanyManagerSidebar";
import "./CompanyManagerLayout.css";

const CompanyManagerLayout = () => {
  return (
    <div className="dashboard-layout">

      <CompanyManagerSidebar />

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
};

export default CompanyManagerLayout;