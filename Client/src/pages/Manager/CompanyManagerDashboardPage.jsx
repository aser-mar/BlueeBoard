import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyCompanyProducts } from "../../services/companyManagerProductService";
import { getMyCompanyOrders } from "../../services/companyManagerOrderService";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../Admin/AdminDashboard.css";
import "../Admin/AdminProductsPage.css";

const buildOrderAnalytics = (orders = []) => {
  const now = new Date();
  const trend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return {
      name: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
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
      const revenue = Number(order.companySubtotal || 0);
      trend[dayIndex].revenue += revenue;
      totalRevenue += revenue;
    }
  });

  return { trend, totalRevenue };
};

const CompanyManagerDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  const [analytics, setAnalytics] = useState({
    trend: [],
    totalRevenue: 0,
    loading: true,
  });

  useEffect(() => {
    const loadProducts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [productData, orderData] = await Promise.all([
          getMyCompanyProducts(token),
          getMyCompanyOrders(),
        ]);
        setProducts(productData);
        const { trend, totalRevenue } = buildOrderAnalytics(orderData || []);
        setAnalytics({ trend, totalRevenue, loading: false });
      } catch (error) {
        console.error(error);
        setProducts([]);
        setAnalytics((prev) => ({ ...prev, loading: false }));
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
          <h1 className="admin-dashboard__title">{t("managerDashboard.title")}</h1>
          <p className="admin-dashboard__subtitle">{t("managerDashboard.subtitle")}</p>
        </div>
      </div>

      {/* ===== ANALYTICS ===== */}
      <section className="admin-dashboard__analytics">
        <div className="admin-dashboard__section-header">
          <div>
            <h2 className="admin-dashboard__section-title">{t("managerDashboard.salesInsights")}</h2>
            <p className="admin-dashboard__section-subtitle">
              {t("managerDashboard.salesInsightsSubtitle")}
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
                  <p className="admin-card__label">{t("managerDashboard.orderTrend")}</p>
                  <h3 className="admin-analytics-card__title">{t("managerDashboard.dailyOrders")}</h3>
                </div>
                <span className="admin-analytics-card__badge">{t("managerDashboard.last7Days")}</span>
              </div>
              <div className="admin-analytics-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trend}>
                    <defs>
                      <linearGradient id="cmOrdersFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.22)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} reversed={i18n.dir() === "rtl"} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} orientation={i18n.dir() === "rtl" ? "right" : "left"} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#2563eb" fill="url(#cmOrdersFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="admin-card admin-analytics-card">
              <div className="admin-analytics-card__header">
                <div>
                  <p className="admin-card__label">{t("managerDashboard.revenueTrend")}</p>
                  <h3 className="admin-analytics-card__title">{t("managerDashboard.dailyRevenue")}</h3>
                </div>
                <span className="admin-analytics-card__badge">{analytics.totalRevenue.toLocaleString()} EGP</span>
              </div>
              <div className="admin-analytics-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trend}>
                    <defs>
                      <linearGradient id="cmRevenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.22)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} reversed={i18n.dir() === "rtl"} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} orientation={i18n.dir() === "rtl" ? "right" : "left"} />
                    <Tooltip formatter={(value) => [`${value} EGP`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#cmRevenueFill)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        ) : (
          <article className="admin-card admin-analytics-card admin-analytics-card--empty">
            <p className="admin-card__label">{t("managerDashboard.analyticsLabel")}</p>
            <h3 className="admin-analytics-card__title">{t("managerDashboard.noOrderActivity")}</h3>
            <p className="admin-dashboard__section-subtitle">
              {t("managerDashboard.noOrderActivityNote")}
            </p>
          </article>
        )}
      </section>

      {products.length === 0 ? (
        <div className="admin-products-empty-state">
          <svg className="admin-products-empty-state__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>{t("managerDashboard.emptyTitle")}</h2>
          <p>{t("managerDashboard.emptyDesc")}</p>
          <Link to="/company-manager/products/add" className="admin-products-empty-state__button">{t("managerDashboard.addProduct")}</Link>
        </div>
      ) : (
        <>
          <div className="admin-products-table-wrap">
            <div className="admin-products-table-scroll">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>{t("managerDashboard.thProduct")}</th>
                    <th>{t("managerDashboard.thCategory")}</th>
                    <th>{t("managerDashboard.thPrice")}</th>
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