import { auth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard - Rassa Admin",
};

const StatCard = ({
  label,
  value,
  delta,
  positive,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
}) => (
  <div style={cardStyle}>
    <div style={cardTop}>
      <span style={cardLabel}>{label}</span>
      <div style={iconWrap}>{icon}</div>
    </div>
    <div style={cardValue}>{value}</div>
    <div style={{ ...cardDelta, color: positive ? "#16a34a" : "#dc2626" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {positive
          ? <><polyline points="18 15 12 9 6 15" /></>
          : <><polyline points="6 9 12 15 18 9" /></>}
      </svg>
      {delta} this month
    </div>
  </div>
);

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        * { box-sizing: border-box; }

        .stat-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important;
          transform: translateY(-2px);
        }

        .quick-link:hover {
          border-color: #c7c6c2 !important;
          background: #fefefe !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }

        .activity-row:hover {
          background: #f8f7f5 !important;
        }
      `}</style>

      {/* Page header */}
      <div style={pageHeader}>
        <div>
          <p style={eyebrow}>{greeting}, {firstName}</p>
          <h1 style={pageTitle}>Overview</h1>
        </div>
        <div style={dateBadge}>
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div style={statsGrid}>
        <StatCard
          label="Total Candidates"
          value="2,841"
          delta="+12%"
          positive={true}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Active Jobs"
          value="148"
          delta="+5%"
          positive={true}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          }
        />
        <StatCard
          label="Applications"
          value="9,204"
          delta="+23%"
          positive={true}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
        />
        <StatCard
          label="Interviews Scheduled"
          value="312"
          delta="-3%"
          positive={false}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
      </div>

      {/* Bottom row */}
      <div style={bottomRow}>
        {/* Recent activity */}
        <div style={panel}>
          <div style={panelHeader}>
            <span style={panelTitle}>Recent Activity</span>
            <span style={panelMeta}>Last 24 hours</span>
          </div>
          <div>
            {ACTIVITY.map((item, i) => (
              <div key={i} className="activity-row" style={{ ...activityRow, borderTop: i > 0 ? "1px solid #f0eeeb" : "none" }}>
                <div style={{ ...activityDot, background: item.color }} />
                <div style={activityContent}>
                  <span style={activityText}>{item.text}</span>
                  <span style={activityTime}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={panel}>
          <div style={panelHeader}>
            <span style={panelTitle}>Quick Access</span>
          </div>
          <div style={quickGrid}>
            {QUICK_LINKS.map(({ label, desc, color, href }) => (
              <a key={label} href={href} className="quick-link" style={{ ...quickLink, borderLeft: `3px solid ${color}` }}>
                <span style={quickLabel}>{label}</span>
                <span style={quickDesc}>{desc}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY = [
  { text: "New candidate registered — Sarah Chen", time: "2 min ago", color: "#6366f1" },
  { text: "Interview completed — Marcus Webb at Acme Corp", time: "18 min ago", color: "#10b981" },
  { text: "Job posting approved — Senior Engineer at Stripe", time: "41 min ago", color: "#0ea5e9" },
  { text: "CV analysis failed — retry queued", time: "1 hr ago", color: "#ef4444" },
  { text: "Batch match run completed — 84 new matches", time: "2 hr ago", color: "#f59e0b" },
  { text: "Company onboarded — Vercel Inc.", time: "3 hr ago", color: "#8b5cf6" },
];

const QUICK_LINKS = [
  { label: "CV Review", desc: "Pending CV analyses", color: "#f59e0b", href: "/cv" },
  { label: "Applications", desc: "Manage all applications", color: "#0ea5e9", href: "/applications" },
  { label: "Interviews", desc: "Scheduled interviews", color: "#10b981", href: "/interviews" },
  { label: "Matches", desc: "AI-generated matches", color: "#6366f1", href: "/matches" },
];

// Styles
const root: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "36px 32px",
};

const pageHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  marginBottom: "32px",
};

const eyebrow: React.CSSProperties = {
  fontSize: "13px",
  color: "#9ca3af",
  margin: "0 0 4px 0",
  fontWeight: 400,
};

const pageTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "32px",
  color: "#0f1420",
  margin: 0,
  letterSpacing: "-0.02em",
  lineHeight: 1,
};

const dateBadge: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  background: "#f0eeeb",
  border: "1px solid #e2e1de",
  borderRadius: "7px",
  padding: "6px 12px",
  fontWeight: 500,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  marginBottom: "24px",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1.5px solid #e2e1de",
  borderRadius: "12px",
  padding: "20px",
  transition: "all 0.18s ease",
  cursor: "default",
};

const cardTop: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const cardLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const iconWrap: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "#f8f7f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardValue: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: "30px",
  color: "#0f1420",
  lineHeight: 1,
  marginBottom: "8px",
  letterSpacing: "-0.02em",
};

const cardDelta: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  fontWeight: 500,
};

const bottomRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 380px",
  gap: "16px",
};

const panel: React.CSSProperties = {
  background: "white",
  border: "1.5px solid #e2e1de",
  borderRadius: "12px",
  overflow: "hidden",
};

const panelHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 20px",
  borderBottom: "1px solid #f0eeeb",
};

const panelTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#0f1420",
  letterSpacing: "-0.01em",
};

const panelMeta: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
  fontWeight: 500,
};

const activityRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "13px 20px",
  transition: "background 0.12s ease",
};

const activityDot: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  flexShrink: 0,
};

const activityContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  gap: "12px",
};

const activityText: React.CSSProperties = {
  fontSize: "13px",
  color: "#374151",
  lineHeight: 1.4,
};

const activityTime: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const quickGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  padding: "16px",
};

const quickLink: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "14px 16px",
  borderRadius: "8px",
  border: "1.5px solid #e2e1de",
  background: "white",
  textDecoration: "none",
  transition: "all 0.15s ease",
};

const quickLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#0f1420",
  letterSpacing: "-0.01em",
};

const quickDesc: React.CSSProperties = {
  fontSize: "11px",
  color: "#9ca3af",
};
