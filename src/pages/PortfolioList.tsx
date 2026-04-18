import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiTrash2, FiCheck, FiX, FiExternalLink, FiCheckSquare, FiSquare } from "react-icons/fi";
import { getPortfolios, updateStatus, deletePortfolio } from "../api";
import "./PortfolioList.css";

const API_BASE = `${(import.meta.env.VITE_API_URL as string | undefined)?.trim() || "https://portfolio-backend-anshudevil07s-projects.vercel.app/api"}/admin`;
const PORTFOLIO_URL = (import.meta.env.VITE_3D_PORTFOLIO_URL as string | undefined)?.trim() || "https://3d-portfolio-red-ten.vercel.app";
const getToken = () => localStorage.getItem("admin_token") || "";

interface Portfolio {
  _id: string;
  name: string;
  email: string;
  title: string;
  status: string;
  createdAt: string;
  slug: string;
}

const PortfolioList = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setSelected([]);
    const data = await getPortfolios({ status: statusFilter, search, page: String(page), limit: "10" });
    setPortfolios(data.portfolios || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  };

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const toggleAll = () =>
    setSelected(selected.length === portfolios.length ? [] : portfolios.map(p => p._id));

  const bulkAction = async (action: string) => {
    if (!selected.length) return;
    if (action === "delete" && !confirm(`Delete ${selected.length} portfolios?`)) return;
    setBulkLoading(true);
    await fetch(`${API_BASE}/portfolios/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ ids: selected, action }),
    });
    setBulkLoading(false);
    load();
  };

  useEffect(() => { load(); }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleStatus = async (id: string, status: string) => {
    await updateStatus(id, status);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this portfolio?")) return;
    await deletePortfolio(id);
    load();
  };

  const statusColor = (s: string) =>
    s === "active" ? "var(--success)" : s === "pending" ? "var(--warning)" : "var(--danger)";

  return (
    <div className="portfolio-list">
      <div className="page-header">
        <div>
          <h1>Portfolios</h1>
          <p>{total} total submissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <form className="search-box" onSubmit={handleSearch}>
          <FiSearch />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, title..." />
        </form>
        <div className="filter-tabs">
          {["all", "active", "rejected"].map(s => (
            <button key={s} className={`filter-tab ${statusFilter === s ? "active" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <div className="bulk-bar">
          <span>{selected.length} selected</span>
          <button className="bulk-btn bulk-activate" onClick={() => bulkAction("activate")} disabled={bulkLoading}>
            <FiCheck /> Activate
          </button>
          <button className="bulk-btn bulk-reject" onClick={() => bulkAction("reject")} disabled={bulkLoading}>
            <FiX /> Reject
          </button>
          <button className="bulk-btn bulk-delete" onClick={() => bulkAction("delete")} disabled={bulkLoading}>
            <FiTrash2 /> Delete
          </button>
          <button className="bulk-btn bulk-clear" onClick={() => setSelected([])}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="table-wrap">
        <div className="table-head">
          <span className="col-check" onClick={toggleAll}>
            {selected.length === portfolios.length && portfolios.length > 0 ? <FiCheckSquare /> : <FiSquare />}
          </span>
          <span>Name</span>
          <span>Title</span>
          <span>Email</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : portfolios.length === 0 ? (
          <div className="empty-state">No portfolios found</div>
        ) : (
          portfolios.map(p => (
            <div key={p._id} className={`table-row-item ${selected.includes(p._id) ? "row-selected" : ""}`}>
              <span className="col-check" onClick={() => toggleSelect(p._id)}>
                {selected.includes(p._id) ? <FiCheckSquare style={{ color: "var(--accent)" }} /> : <FiSquare />}
              </span>
              <span className="row-name">{p.name}</span>
              <span className="row-muted">{p.title}</span>
              <span className="row-muted">{p.email}</span>
              <span>
                <span className="status-badge" style={{ color: statusColor(p.status), borderColor: statusColor(p.status) }}>
                  {p.status}
                </span>
              </span>
              <span className="row-muted">{new Date(p.createdAt).toLocaleDateString()}</span>
              <span className="actions">
                <a href={`${PORTFOLIO_URL}/portfolio/${p.slug}`} target="_blank" rel="noopener noreferrer" className="action-btn view-link" title="Open Portfolio">
                  <FiExternalLink />
                </a>
                <button className="action-btn view" onClick={() => navigate(`/portfolios/${p._id}`)} title="View Details">
                  <FiEye />
                </button>
                {p.status !== "active" && (
                  <button className="action-btn approve" onClick={() => handleStatus(p._id, "active")} title="Approve">
                    <FiCheck />
                  </button>
                )}
                {p.status !== "rejected" && (
                  <button className="action-btn reject" onClick={() => handleStatus(p._id, "rejected")} title="Reject">
                    <FiX />
                  </button>
                )}
                <button className="action-btn delete" onClick={() => handleDelete(p._id)} title="Delete">
                  <FiTrash2 />
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
