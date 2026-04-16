import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PortfolioList from "./pages/PortfolioList";
import PortfolioDetail from "./pages/PortfolioDetail";

const isAuth = () => !!localStorage.getItem("admin_token");

const Protected = ({ children }: { children: React.ReactNode }) =>
  isAuth() ? <>{children}</> : <Navigate to="/login" replace />;

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <Protected>
          <DashboardLayout />
        </Protected>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="portfolios" element={<PortfolioList />} />
      <Route path="portfolios/:id" element={<PortfolioDetail />} />
    </Route>
  </Routes>
);

export default App;
