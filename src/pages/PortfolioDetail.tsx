import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiX, FiTrash2, FiExternalLink } from "react-icons/fi";
import { getPortfolio, updateStatus, deletePortfolio } from "../api";
import "./PortfolioDetail.css";

interface Portfolio {
  _id: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  location: string;
  bio: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  skills: string[];
  works: Array<{ title: string; description: string; link: string; image: string }>;
  career: Array<{ company: string; role: string; duration: string; description: string }>;
  status: string;
  slug: string;
  createdAt: string;
}

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    if (id) getPortfolio(id).then(setPortfolio);
  }, [id]);

  const handleStatus = async (status: string) => {
    if (!id) return;
    const updated = await updateStatus(id, status);
    setPortfolio(updated);
  };

  const handleDelete = async () => {
    if (!id || !confirm("Delete this portfolio permanently?")) return;
    await deletePortfolio(id);
    navigate("/portfolios");
  };

  const statusColor = (s: string) =>
    s === "active" ? "var(--success)" : s === "pending" ? "var(--warning)" : "var(--danger)";

  if (!portfolio) return <div className="loading-page">Loading...</div>;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate("/portfolios")}>
          <FiArrowLeft /> Back
        </button>
        <div className="detail-actions">
          <a
            href={`http://localhost:5173/portfolio/${portfolio.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn view-link-btn"
            title="Open Portfolio"
          >
            <FiExternalLink /> Open
          </a>
          {portfolio.status !== "active" && (
            <button className="action-btn approve" onClick={() => handleStatus("active")} title="Approve">
              <FiCheck /> Approve
            </button>
          )}
          {portfolio.status !== "rejected" && (
            <button className="action-btn reject" onClick={() => handleStatus("rejected")} title="Reject">
              <FiX /> Reject
            </button>
          )}
          <button className="action-btn delete" onClick={handleDelete} title="Delete">
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left: main info */}
        <div className="detail-main">
          <div className="detail-card">
            <div className="detail-top">
              <div className="detail-avatar">{portfolio.name[0]}</div>
              <div>
                <h1>{portfolio.name}</h1>
                <p className="detail-title">{portfolio.title}</p>
                <span className="status-badge" style={{ color: statusColor(portfolio.status), borderColor: statusColor(portfolio.status) }}>
                  {portfolio.status}
                </span>
              </div>
            </div>
            {portfolio.bio && <p className="detail-bio">{portfolio.bio}</p>}
          </div>

          {/* Projects */}
          {portfolio.works?.filter(w => w.title).length > 0 && (
            <div className="detail-card">
              <h3>Projects</h3>
              <div className="works-list">
                {portfolio.works.filter(w => w.title).map((w, i) => (
                  <div key={i} className="work-item">
                    <div className="work-info">
                      <span className="work-title">{w.title}</span>
                      {w.description && <p className="work-desc">{w.description}</p>}
                    </div>
                    {w.link && (
                      <a href={w.link} target="_blank" rel="noopener noreferrer" className="work-link">
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career */}
          {portfolio.career?.filter(c => c.company).length > 0 && (
            <div className="detail-card">
              <h3>Experience</h3>
              <div className="career-list">
                {portfolio.career.filter(c => c.company).map((c, i) => (
                  <div key={i} className="career-item">
                    <div className="career-dot" />
                    <div>
                      <span className="career-role">{c.role}</span>
                      <span className="career-company"> @ {c.company}</span>
                      {c.duration && <p className="career-duration">{c.duration}</p>}
                      {c.description && <p className="career-desc">{c.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: sidebar info */}
        <div className="detail-sidebar">
          <div className="detail-card">
            <h3>Contact</h3>
            <div className="info-list">
              <InfoRow label="Email" value={portfolio.email} />
              <InfoRow label="Phone" value={portfolio.phone} />
              <InfoRow label="Location" value={portfolio.location} />
              <InfoRow label="Submitted" value={new Date(portfolio.createdAt).toLocaleDateString()} />
              <InfoRow label="Slug" value={portfolio.slug} />
            </div>
          </div>

          <div className="detail-card">
            <h3>Links</h3>
            <div className="links-list">
              {portfolio.github && <LinkItem label="GitHub" url={portfolio.github} />}
              {portfolio.linkedin && <LinkItem label="LinkedIn" url={portfolio.linkedin} />}
              {portfolio.twitter && <LinkItem label="Twitter" url={portfolio.twitter} />}
              {portfolio.website && <LinkItem label="Website" url={portfolio.website} />}
              {!portfolio.github && !portfolio.linkedin && !portfolio.twitter && !portfolio.website && (
                <p className="no-links">No links provided</p>
              )}
            </div>
          </div>

          {portfolio.skills?.length > 0 && (
            <div className="detail-card">
              <h3>Skills</h3>
              <div className="skills-wrap">
                {portfolio.skills.map((s, i) => (
                  <span key={i} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  value ? (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  ) : null
);

const LinkItem = ({ label, url }: { label: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="link-item">
    <span>{label}</span>
    <FiExternalLink size={12} />
  </a>
);

export default PortfolioDetail;
