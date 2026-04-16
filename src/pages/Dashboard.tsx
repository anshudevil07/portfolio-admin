import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiCheckCircle, FiXCircle, FiEye, FiTrendingUp, FiExternalLink, FiAlertCircle } from "react-icons/fi";
import { getStats } from "../api";
import "./Dashboard.css";

interface StatsData {
  total: number;
  active: number;
  rejected: number;
  totalViews: number;
  topPortfolios: Array<{ _id: string; name: string; slug: string; status: string; analytics?: { views: number } }>;
  recent: Array<{ _id: string; name: string; email: string; status: string; createdAt: string; slug: string; analytics?: { views: number } }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getStats()
      .then(data => {
        if (data?.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Could not connect to backend. Make sure the server is running on port 5000."))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s: string) => s === "active" ? "var(--success)" : "var(--danger)";

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner" />
      <p>Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="dash-error">
      <FiAlertCircle size={32} />
      <h2>Connection Error</h2>
      <p>{error}</p>
      <button onClick={() => { setLoading(true); setError(""); getStats().then(setStats).catch(() => setError("Still can't connect.")).finally(() => setLoading(false)); }}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of all portfolio submissions</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FiUsers />} label="Total" value={stats?.total ?? 0} color="var(--accent)" />
        <StatCard icon={<FiCheckCircle />} label="Active" value={stats?.active ?? 0} color="var(--success)" />
        <StatCard icon={<FiXCircle />} label="Rejected" value={stats?.rejected ?? 0} color="var(--danger)" />
        <StatCard icon={<FiEye />} label="Total Views" value={stats?.totalViews ?? 0} color="var(--accent2)" />
      </div>

      <div className="dash-grid">
        {/* Recent submissions */}
        <div className="recent-section">
          <h2>Recent Submissions</h2>
          <div className="recent-table">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Views</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {(stats?.recent ?? []).length === 0 ? (
              <div className="empty-state">No submissions yet</div>
            ) : (
              (stats?.recent ?? []).map(p => (
                <div key={p._id} className="table-row" onClick={() => navigate(`/portfolios/${p._id}`)}>
                  <span className="row-name">{p.name}</span>
                  <span className="row-muted">{p.email}</span>
                  <span className="row-views"><FiEye size={11} /> {p.analytics?.views ?? 0}</span>
                  <span>
                    <span className="status-badge" style={{ color: statusColor(p.status), borderColor: statusColor(p.status) }}>
                      {p.status}
                    </span>
                  </span>
                  <span className="row-muted">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top portfolios */}
        <div className="top-section">
          <h2><FiTrendingUp size={16} /> Top Portfolios</h2>
          <div className="top-list">
            {(stats?.topPortfolios ?? []).length === 0 ? (
              <div className="empty-state">No data yet</div>
            ) : (
              (stats?.topPortfolios ?? []).map((p, i) => (
                <div key={p._id} className="top-item">
                  <span className="top-rank">#{i + 1}</span>
                  <div className="top-info">
                    <span className="top-name">{p.name}</span>
                    <span className="top-views"><FiEye size={11} /> {p.analytics?.views ?? 0} views</span>
                  </div>
                  <a href={`http://localhost:5173/portfolio/${p.slug}`} target="_blank" rel="noopener noreferrer" className="top-link" onClick={e => e.stopPropagation()}>
                    <FiExternalLink size={13} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ color, background: `${color}18`, borderColor: `${color}30` }}>{icon}</div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default Dashboard;
