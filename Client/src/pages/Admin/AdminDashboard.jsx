import { Link } from "react-router-dom";
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineOfficeBuilding,
  HiOutlineCollection,
  HiOutlinePhotograph,
  HiOutlineShoppingBag,
  HiOutlinePlus,
  HiOutlineTag,
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
import { getSectors } from "../../services/sectorService";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

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
    if (order.status === "cancelled") return;

    const orderDate = new Date(order.createdAt);
    if (Number.isNaN(orderDate.getTime())) return;

    const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= 7) return;

    const dayIndex = 6 - diffDays;
    trend[dayIndex].orders += 1;

    if (order.status === "delivered") {
      const revenue = Number(order.totalPrice || 0);
      trend[dayIndex].revenue += revenue;
      totalRevenue += revenue;
    }
  });

  return {
    trend,
    totalRevenue,
  };
};

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const { token } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    products: 0,
    companies: 0,
    categories: 0,
    banners: 0,
    orders: 0,
    managers: 0,
    sectors: 0,
  });
  const [analytics, setAnalytics] = useState({
    trend: [],
    totalRevenue: 0,
    loading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, companies, categories, banners, orders, managers, sectors] =
          await Promise.all([
            getProducts(),
            getCompanies(),
            getCategories(),
            getBanners(),
            getOrders(token),
            getCompanyManagers(),
            getSectors(),
          ]);

        const { trend, totalRevenue } = buildOrderAnalytics(orders || []);

        setStats({
          products: products?.length || 0,
          companies: companies?.length || 0,
          categories: categories?.length || 0,
          banners: banners?.length || 0,
          orders: orders?.length || 0,
          managers: managers?.length || 0,
          sectors: sectors?.length || 0,
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
          <p className="admin-dashboard__eyebrow">{t("adminDashboard.eyebrow")}</p>
          <h1 className="admin-dashboard__title">{t("adminDashboard.title")}</h1>
          <p className="admin-dashboard__subtitle">
            {t("adminDashboard.subtitle")}
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
            <p className="admin-card__label">{t("adminDashboard.statsProducts")}</p>
            <h2 className="admin-card__value">
            {stats.products}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsProductsNote")}</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--brand">
            <HiOutlineOfficeBuilding />
          </div>
          <div>
            <p className="admin-card__label">{t("adminDashboard.statsCompanies")}</p>
            <h2 className="admin-card__value">
            {stats.companies}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsCompaniesNote")}</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--accent">
            <HiOutlineCollection />
          </div>
          <div>
            <p className="admin-card__label">{t("adminDashboard.statsCategories")}</p>
            <h2 className="admin-card__value">
            {stats.categories}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsCategoriesNote")}</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--accent">
            <HiOutlineTag />
          </div>
          <div>
            <p className="admin-card__label">{t("adminDashboard.statsSectors")}</p>
            <h2 className="admin-card__value">
            {stats.sectors}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsSectorsNote")}</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--soft">
            <HiOutlinePhotograph />
          </div>
          <div>
            <p className="admin-card__label">{t("adminDashboard.statsBanners")}</p>
            <h2 className="admin-card__value">
            {stats.banners}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsBannersNote")}</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--contrast">
            <HiOutlineCube />
          </div>
          <div>
            <p className="admin-card__label">{t("adminDashboard.statsOrders")}</p>
            <h2 className="admin-card__value">
            {stats.orders}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsOrdersNote")}</p>
          </div>
        </article>

        <article className="admin-card admin-card--stat">
          <div className="admin-card__icon admin-card__icon--primary">
            <HiOutlineOfficeBuilding />
          </div>
          <div>
            <p className="admin-card__label">{t("adminDashboard.statsManagers")}</p>
            <h2 className="admin-card__value">
            {stats.managers}
            </h2>
            <p className="admin-card__note">{t("adminDashboard.statsManagersNote")}</p>
          </div>
        </article>
      </section>

      <section className="admin-dashboard__analytics">
        <div className="admin-dashboard__section-header">
          <div>
            <h2 className="admin-dashboard__section-title">{t("adminDashboard.analyticsTitle")}</h2>
            <p className="admin-dashboard__section-subtitle">
              {t("adminDashboard.analyticsSubtitle")}
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
                  <p className="admin-card__label">{t("adminDashboard.orderTrend")}</p>
                  <h3 className="admin-analytics-card__title">{t("adminDashboard.dailyOrders")}</h3>
                </div>
                <span className="admin-analytics-card__badge">{t("adminDashboard.last7Days")}</span>
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
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} reversed={i18n.dir() === "rtl"} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} orientation={i18n.dir() === "rtl" ? "right" : "left"} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#2563eb" fill="url(#ordersFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="admin-card admin-analytics-card">
              <div className="admin-analytics-card__header">
                <div>
                  <p className="admin-card__label">{t("adminDashboard.revenueTrend")}</p>
                  <h3 className="admin-analytics-card__title">{t("adminDashboard.dailyRevenue")}</h3>
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
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} reversed={i18n.dir() === "rtl"} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} orientation={i18n.dir() === "rtl" ? "right" : "left"} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#revenueFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        ) : (
          <article className="admin-card admin-analytics-card admin-analytics-card--empty">
            <p className="admin-card__label">{t("adminDashboard.analyticsLabel")}</p>
            <h3 className="admin-analytics-card__title">{t("adminDashboard.noOrderActivity")}</h3>
            <p className="admin-dashboard__section-subtitle">
              {t("adminDashboard.noOrderActivityNote")}
            </p>
          </article>
        )}
      </section>

      <section className="admin-dashboard__quick-actions">
        <div className="admin-dashboard__section-header">
          <div>
            <h2 className="admin-dashboard__section-title">{t("adminDashboard.quickActions")}</h2>
            <p className="admin-dashboard__section-subtitle">
              {t("adminDashboard.quickActionsNote")}
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
              <p className="admin-action-card__title">{t("adminDashboard.actionAddProduct")}</p>
              <p className="admin-action-card__text">
                {t("adminDashboard.actionAddProductNote")}
              </p>
            </div>
          </Link>

          <Link className="admin-action-card" to="/admin/add-company">
            <div className="admin-action-card__icon">
              <HiOutlinePlus />
            </div>
            <div>
              <p className="admin-action-card__title">{t("adminDashboard.actionAddCompany")}</p>
              <p className="admin-action-card__text">
                {t("adminDashboard.actionAddCompanyNote")}
              </p>
            </div>
          </Link>

          <Link className="admin-action-card" to="/admin/add-banner">
            <div className="admin-action-card__icon">
              <HiOutlinePlus />
            </div>
            <div>
              <p className="admin-action-card__title">{t("adminDashboard.actionAddBanner")}</p>
              <p className="admin-action-card__text">
                {t("adminDashboard.actionAddBannerNote")}
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
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsProducts")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtProductsDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/products">
              {t("adminDashboard.mgtProductsBtn")}
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/products/add">
              {t("adminDashboard.mgtAddProductBtn")}
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineOfficeBuilding />
            </div>
            <div>
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsCompanies")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtCompaniesDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/companies">
              {t("adminDashboard.mgtCompaniesBtn")}
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/add-company">
              {t("adminDashboard.mgtAddCompanyBtn")}
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineOfficeBuilding />
            </div>
            <div>
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsManagers")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtManagersDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/company-managers">
              {t("adminDashboard.mgtManagersBtn")}
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/company-managers/add">
              {t("adminDashboard.mgtAddManagerBtn")}
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineCollection />
            </div>
            <div>
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsCategories")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtCategoriesDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/categories">
              {t("adminDashboard.mgtCategoriesBtn")}
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineTag />
            </div>
            <div>
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsSectors")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtSectorsDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/sectors">
              {t("adminDashboard.mgtSectorsBtn")}
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlinePhotograph />
            </div>
            <div>
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsBanners")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtBannersDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/banners">
              {t("adminDashboard.mgtBannersBtn")}
            </Link>
            <Link className="admin-button admin-button--secondary" to="/admin/add-banner">
              {t("adminDashboard.mgtAddBannerBtn")}
            </Link>
          </div>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-card__top">
            <div className="admin-section-card__icon-wrap">
              <HiOutlineChartBar />
            </div>
            <div>
              <h3 className="admin-section-card__heading">{t("adminDashboard.statsOrders")}</h3>
              <p className="admin-section-card__copy">
                {t("adminDashboard.mgtOrdersDesc")}
              </p>
            </div>
          </div>
          <div className="admin-section-card__actions">
            <Link className="admin-button" to="/admin/orders">
              {t("adminDashboard.mgtOrdersBtn")}
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;