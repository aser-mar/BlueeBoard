import { Link } from "react-router-dom";
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineOfficeBuilding,
  HiOutlineCollection,
  HiOutlinePhotograph,
  HiOutlineShoppingBag,
  HiOutlinePlus,
} from "react-icons/hi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEffect, useState } from "react";

import { getProducts } from "../../services/productService";
import { getCompanies } from "../../services/companyService";
import { getBanners } from "../../services/bannerService";
import { getOrders } from "../../services/orderService";
import { getCategories } from "../../services/categoryService";
import { getCompanyManagers } from "../../services/companyManagerService";

import { useSelector } from "react-redux";

import "./AdminDashboard.css";

  const buildOrderAnalytics = (orders = []) => {
    const now = new Date();
    const trend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));

      return {
        name: date.toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        }),
        orders: 0,
        revenue: 0,
      };
    });

    let totalRevenue = 0;

  (orders || []).forEach((order) => {
    if (!order?.createdAt) return;

    const orderDate = new Date(order.createdAt);
    if (Number.isNaN(orderDate.getTime())) return;

    const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= 7) return;

    const dayIndex = 6 - diffDays;
    trend[dayIndex].orders += 1;
    const revenue = Number(order.totalPrice || 0);
    trend[dayIndex].revenue += revenue;
    totalRevenue += revenue;
  });

  return {
    trend,
    totalRevenue,
  };
};

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    products: 0,
    companies: 0,
    categories: 0,
    banners: 0,
    orders: 0,
    managers: 0,
  });
  const [analytics, setAnalytics] = useState({
    trend: [],
    totalRevenue: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, companies, categories, banners, orders, managers] =
          await Promise.all([
            getProducts(),
            getCompanies(),
            getCategories(),
            getBanners(),
            getOrders(token),
            getCompanyManagers(),
          ]);

        const { trend, totalRevenue } = buildOrderAnalytics(orders || []);

        setStats({
          products: products?.length || 0,
          companies: companies?.length || 0,
          categories: categories?.length || 0,
          banners: banners?.length || 0,
          orders: orders?.length || 0,
          managers: managers?.length || 0,
        });
        setAnalytics({
          trend,
          totalRevenue,
          loading: false,
        });
      } catch (error) {
        console.log("Dashboard Stats Error:", error);
        setAnalytics((prev) => ({ ...prev, loading: false }));
      }
    };

    if (token) {
      loadStats();
    }
  }, [token]);
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__hero">
        <div>
          <p className="admin-dashboard__eyebrow">Admin Console</p>
          <h1 className="admin-dashboard__title">Admin Dashboard</h1>
          <p className="admin-dashboard__subtitle">
            Manage products, companies, banners, categories and orders.
          </p>
        </div>
        <div className="admin-dashboard__hero-icon">
          <HiOutlineChartBar />
        </div>
      </div>

      <section className="admin-dashboard__stats">
        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--primary">
            <HiOutlineShoppingBag />
          </div>
          <div>
            <p className="admin-card__label">Products</p>
            <h2 className="admin-card__value">
            {stats.products}
            </h2>
            <p className="admin-card__note">Active catalog items</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--brand">
            <HiOutlineOfficeBuilding />
          </div>
          <div>
            <p className="admin-card__label">Companies</p>
            <h2 className="admin-card__value">
            {stats.companies}
            </h2>
            <p className="admin-card__note">Verified partners</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--accent">
            <HiOutlineCollection />
          </div>
          <div>
            <p className="admin-card__label">Categories</p>
            <h2 className="admin-card__value">
            {stats.categories}
            </h2>
            <p className="admin-card__note">Organized sections</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--soft">
            <HiOutlinePhotograph />
          </div>
          <div>
            <p className="admin-card__label">Banners</p>
            <h2 className="admin-card__value">
            {stats.banners}
            </h2>
            <p className="admin-card__note">Live campaign banners</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--contrast">
            <HiOutlineCube />
          </div>
          <div>
            <p className="admin-card__label">Orders</p>
            <h2 className="admin-card__value">
            {stats.orders}
            </h2>
            <p className="admin-card__note">Pending and delivered</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--primary">
            <HiOutlineOfficeBuilding />
          </div>
          <div>
            <p className="admin-card__label">Company Managers</p>
            <h2 className="admin-card__value">
            {stats.managers}
            </h2>
            <p className="admin-card__note">Partner accounts</p>
          </div>
        </article>
      </section>

      <section className="admin-dashboard__analytics">
        <div className="admin-dashboard__section-header">
          <div>
            <h2 className="admin-dashboard__section-title">Sales Insights</h2>
            <p className="admin-dashboard__section-subtitle">
              A quick view of recent order momentum and revenue activity.
            </p>
          </div>
        </div>

        {analytics.loading ? (
          <div className="admin-dashboard__analytics-grid">
            <article className="admin-card admin-analytics-card admin-analytics-card--loading">
              <div className="admin-analytics-card__placeholder" />
              <div className="admin-analytics-card__placeholder admin-analytics-card__placeholder--wide" />
            </article>
            <article className="admin-card admin-analytics-card admin-analytics-card--loading">
              <div className="admin-analytics-card__placeholder" />
              <div className="admin-analytics-card__placeholder admin-analytics-card__placeholder--wide" />
            </article>
          </div>
        ) : analytics.trend.length ? (
          <div className="admin-dashboard__analytics-grid">
            <article className="admin-card admin-analytics-card">
              <div className="admin-analytics-card__header">
                <div>
                  <p className="admin-card__label">Order Trend</p>
                  <h3 className="admin-analytics-card__title">Daily orders</h3>
                </div>
                <span className="admin-analytics-card__badge">Last 7 days</span>
              </div>
              <div className="admin-analytics-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trend}>
                    <defs>
                      <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.22)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#2563eb" fill="url(#ordersFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="admin-card admin-analytics-card">
              <div className="admin-analytics-card__header">
                <div>
                  <p className="admin-card__label">Revenue Trend</p>
                  <h3 className="admin-analytics-card__title">Daily revenue</h3>
                </div>
                <span className="admin-analytics-card__badge">${analytics.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="admin-analytics-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trend}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.22)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#revenueFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        ) : (
          <article className="admin-card admin-analytics-card admin-analytics-card--empty">
            <p className="admin-card__label">Analytics</p>
            <h3 className="admin-analytics-card__title">No order activity yet</h3>
            <p className="admin-dashboard__section-subtitle">
              Orders will appear here as soon as customers begin purchasing from the store.
            </p>
          </article>
        )}
      </section>

      <section className="admin-dashboard__quick-actions">
        <div className="admin-dashboard__section-header">
          <div>
            <h2 className="admin-dashboard__section-title">Quick Actions</h2>
            <p className="admin-dashboard__section-subtitle">
              Fast access to the most important creation flows.
            </p>
          </div>
        </div>

        <br />

        <div className="admin-dashboard__actions-grid">
          <Link className="admin-action-card" to="/admin/products/add">
            <div className="admin-action-card__icon">
              <HiOutlinePlus />
            </div>
            <div>
              <p className="admin-action-card__title">Add Product</p>
              <p className="admin-action-card__text">
                Launch a new product listing in the marketplace.
              </p>
            </div>
          </Link>

          <Link className="admin-action-card" to="/admin/add-company">
            <div className="admin-action-card__icon">
              <HiOutlinePlus />
            </div>
            <div>
              <p className="admin-action-card__title">Add Company</p>
              <p className="admin-action-card__text">
                Register a new vendor or partner profile.
              </p>
            </div>
          </Link>

          <Link className="admin-action-card" to="/admin/add-banner">
            <div className="admin-action-card__icon">
              <HiOutlinePlus />
            </div>
            <div>
              <p className="admin-action-card__title">Add Banner</p>
              <p className="admin-action-card__text">
                Create a new promotional banner for the homepage.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="admin-dashboard__management">
        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineShoppingBag />
            </div>
            <div>
              <h3 className="admin-section-card__heading">Products</h3>
              <p className="admin-section-card__copy">
                Manage current products or add new items to the catalog.
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/products">
              Manage Products
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/products/add">
              Add Product
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineOfficeBuilding />
            </div>
            <div>
              <h3 className="admin-section-card__heading">Companies</h3>
              <p className="admin-section-card__copy">
                Oversee company profiles and onboard new vendors.
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/companies">
              Manage Companies
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/add-company">
              Add Company
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineOfficeBuilding />
            </div>
            <div>
              <h3 className="admin-section-card__heading">Company Managers</h3>
              <p className="admin-section-card__copy">
                Oversee company manager accounts and assign companies.
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/company-managers">
              Manage Managers
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/company-managers/add">
              Add Manager
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineCollection />
            </div>
            <div>
              <h3 className="admin-section-card__heading">Categories</h3>
              <p className="admin-section-card__copy">
                Organize product categories and keep the storefront tidy.
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/categories">
              Manage Categories
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlinePhotograph />
            </div>
            <div>
              <h3 className="admin-section-card__heading">Banners</h3>
              <p className="admin-section-card__copy">
                Update homepage visuals and schedule new campaigns.
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/banners">
              Manage Banners
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/add-banner">
              Add Banner
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineChartBar />
            </div>
            <div>
              <h3 className="admin-section-card__heading">Orders</h3>
              <p className="admin-section-card__copy">
                Review order flow and track fulfillment status.
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/orders">
              Manage Orders
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;