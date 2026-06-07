import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";

import CompanyProductsPage from "./pages/CompanyProductsPage";

import ProductDetailsPage from "./pages/ProductDetailsPage";

import CartPage from "./pages/CartPage";

import CheckoutPage from "./pages/CheckoutPage";

import NotFoundPage from "./pages/NotFoundPage";

import LoginPage from "./pages/LoginPage";

import Header from "./components/Header";

import AdminDashboard
from "./pages/Admin/AdminDashboard";

import AdminProductsPage
from "./pages/Admin/AdminProductsPage";

import AdminAddProductPage
from "./pages/admin/AdminAddProductPage";

import AdminAddCompanyPage
from "./pages/admin/AdminAddCompanyPage";

import AdminCompaniesPage
from "./pages/admin/AdminCompaniesPage";

import AdminEditProductPage
from "./pages/admin/AdminEditProductPage";

import AdminEditCompanyPage
from "./pages/admin/AdminEditCompanyPage";

import AdminRoute
from "./components/AdminRoute";

import AdminBannersPage
from "./pages/admin/AdminBannersPage";

import AdminAddBannerPage
from "./pages/admin/AdminAddBannerPage";

import AdminEditBannerPage
from "./pages/admin/AdminEditBannerPage";

import AdminOrdersPage
from "./pages/admin/AdminOrdersPage";

import AdminCategoriesPage
from "./pages/admin/AdminCategoriesPage";

import RegisterPage 
from "./pages/RegisterPage";

import MyOrdersPage
from "./pages/MyOrdersPage";

import UserProfilePage
from "./pages/UserProfilePage";

function App() {

  return (

    <BrowserRouter>

      <Header />

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/company/:id"
          element={
            <CompanyProductsPage />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetailsPage />
          }
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AdminAddProductPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/:id/edit"
          element={
            <AdminRoute>
              <AdminEditProductPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-company"
          element={
            <AdminRoute>
              <AdminAddCompanyPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <AdminRoute>
              <AdminCompaniesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/companies/:id/edit"
          element={
            <AdminRoute>
              <AdminEditCompanyPage />
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

        <Route
          path="/admin/banners"
          element={
            <AdminRoute>
              <AdminBannersPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/banners/:id/edit"
          element={
            <AdminRoute>
              <AdminEditBannerPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-banner"
          element={
            <AdminRoute>
              <AdminAddBannerPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategoriesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/my-orders"
          element={<MyOrdersPage />}
        />

        <Route
          path="/profile"
          element={<UserProfilePage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;