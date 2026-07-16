import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import CompanyManagerLayout from "./layouts/CompanyManagerLayout";

import HomePage from "./pages/HomePage";

import CompanyProductsPage from "./pages/CompanyProductsPage";

import ProductDetailsPage from "./pages/ProductDetailsPage";

import CartPage from "./pages/CartPage";

import CheckoutPage from "./pages/CheckoutPage";

import NotFoundPage from "./pages/NotFoundPage";

import LoginPage from "./pages/LoginPage";

import FavouritesPage from "./pages/FavouritesPage";

import PublicLayout from "./layouts/PublicLayout";

import AdminDashboard
  from "./pages/Admin/AdminDashboard";

import AdminProductsPage
  from "./pages/Admin/AdminProductsPage";

import AdminAddProductPage
  from "./pages/Admin/AdminAddProductPage";

import AdminAddCompanyPage
  from "./pages/Admin/AdminAddCompanyPage";

import AdminCompaniesPage
  from "./pages/Admin/AdminCompaniesPage";

import AdminEditProductPage
  from "./pages/Admin/AdminEditProductPage";

import AdminEditCompanyPage
  from "./pages/Admin/AdminEditCompanyPage";

import AdminRoute
  from "./components/AdminRoute";

import AdminBannersPage
  from "./pages/Admin/AdminBannersPage";

import AdminAddBannerPage
  from "./pages/Admin/AdminAddBannerPage";

import AdminEditBannerPage
  from "./pages/Admin/AdminEditBannerPage";

import AdminOrdersPage
  from "./pages/Admin/AdminOrdersPage";

import AdminCategoriesPage
  from "./pages/Admin/AdminCategoriesPage";

import RegisterPage
  from "./pages/RegisterPage";

import MyOrdersPage
  from "./pages/MyOrdersPage";

import UserProfilePage
  from "./pages/UserProfilePage";

import AdminCompanyManagersPage
  from "./pages/Admin/AdminCompanyManagersPage";

import AdminAddCompanyManagerPage
  from "./pages/Admin/AdminAddCompanyManagerPage";

import AdminEditCompanyManagerPage
  from "./pages/Admin/AdminEditCompanyManagerPage";

import CompanyManagerRoute
  from "./routes/CompanyManagerRoute";

import CompanyManagerProductsPage
  from "./pages/Manager/CompanyManagerProductsPage";

import CompanyManagerAddProductPage
  from "./pages/Manager/CompanyManagerAddProductPage";

import CompanyManagerEditProductPage
  from "./pages/Manager/CompanyManagerEditProductPage";

import CompanyManagerDashboardPage
  from "./pages/Manager/CompanyManagerDashboardPage";

import AdminProfilePage 
  from "./pages/Admin/AdminProfilePage";

function App() {

  return (

    <BrowserRouter>

      <Routes>

  <Route element={<PublicLayout />}>

    <Route
      path="/"
      element={<HomePage />}
    />

    <Route
      path="/company/:id"
      element={<CompanyProductsPage />}
    />

    <Route
      path="/product/:id"
      element={<ProductDetailsPage />}
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

    <Route
    path="/favourites"
    element={<FavouritesPage />}
/>
  </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="products"
            element={<AdminProductsPage />}
          />

          <Route
            path="products/add"
            element={<AdminAddProductPage />}
          />

          <Route
            path="products/:id/edit"
            element={<AdminEditProductPage />}
          />

          <Route
            path="companies"
            element={<AdminCompaniesPage />}
          />

          <Route
            path="add-company"
            element={<AdminAddCompanyPage />}
          />

          <Route
            path="companies/:id/edit"
            element={<AdminEditCompanyPage />}
          />

          <Route
            path="banners"
            element={<AdminBannersPage />}
          />

          <Route
            path="add-banner"
            element={<AdminAddBannerPage />}
          />

          <Route
            path="banners/:id/edit"
            element={<AdminEditBannerPage />}
          />

          <Route
            path="orders"
            element={<AdminOrdersPage />}
          />

          <Route
            path="categories"
            element={<AdminCategoriesPage />}
          />

          <Route
            path="company-managers"
            element={<AdminCompanyManagersPage />}
          />

          <Route
            path="company-managers/add"
            element={<AdminAddCompanyManagerPage />}
          />

          <Route
            path="company-managers/:id/edit"
            element={<AdminEditCompanyManagerPage />}
          />

          <Route
            path="profile"
            element={<AdminProfilePage />}
          />
        </Route>

        <Route
          path="/company-manager"
          element={
            <CompanyManagerRoute>
              <CompanyManagerLayout />
            </CompanyManagerRoute>
          }
        >
          <Route
            index
            element={<CompanyManagerDashboardPage />}
          />

          <Route
            path="products"
            element={<CompanyManagerProductsPage />}
          />

          <Route
            path="products/add"
            element={<CompanyManagerAddProductPage />}
          />

          <Route
            path="products/:id/edit"
            element={<CompanyManagerEditProductPage />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;