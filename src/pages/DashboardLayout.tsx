import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiGrid, FiUsers, FiLogOut } from "react-icons/fi";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-dot" />
          PortfolioGen
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/portfolios" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FiUsers /> Portfolios
          </NavLink>
        </nav>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
