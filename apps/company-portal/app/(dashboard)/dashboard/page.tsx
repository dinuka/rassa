import { auth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard — Rassa for Companies",
};

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }

        .cp-card { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .cp-card:hover { box-shadow: 0 8px 24px rgba(12,20,69,0.09) !important; transform: translateY(-2px); }

        .cp-job-row { transition: background 0.12s ease; }
        .cp-job-row:hover { background: #f7f8fc !important; }

        .cp-quick-btn { transition: all 0.15s ease; }
        .cp-quick-btn:hover { border-color: #b8c0d8 !important; background: white !important; box-shadow: 0 4px 12px rgba(12,20,69,0.08) !important; }
      `}</style>

      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <p style={s.greeting}>
            {greeting}, {firstName}
          </p>
          <h1 style={s.pageTitle}>Hiring Dashboard</h1>
        </div>
        <a href="/jobs/new" style={s.newJobBtn}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post a Job
        </a>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {STATS.map(({ label, value, delta, positive, color, icon }) => (
          <div key={label} className="cp-card" style={s.statCard}>
            <div style={s.statTop}>
              <span style={s.statLabel}>{label}</span>
              <div style={{ ...s.statIcon, background: `${color}14` }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: icon }}
                />
              </div>
            </div>
            <div style={s.statValue}>{value}</div>
            <div style={{ ...s.statDelta, color: positive ? "#16a34a" : "#dc2626" }}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {positive ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
              {delta} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={s.contentRow}>
        {/* Active jobs */}
        <div style={s.panel}>
          <div style={s.panelHead}>
            <span style={s.panelTitle}>Active Jobs</span>
            <a href="/jobs" style={s.panelLink}>
              View all →
            </a>
          </div>
          <div>
            {JOBS.map((job, i) => (
              <div
                key={job.title}
                className="cp-job-row"
                style={{ ...s.jobRow, borderTop: i > 0 ? "1px solid #f0f2f8" : "none" }}
              >
                <div>
                  <div style={s.jobTitle}>{job.title}</div>
                  <div style={s.jobMeta}>
                    {job.location} · {job.type}
                  </div>
                </div>
                <div style={s.jobRight}>
                  <div style={s.jobApps}>{job.applications} applicants</div>
                  <div
                    style={{
                      ...s.jobBadge,
                      background: job.urgent ? "#fff3e0" : "#f0f8ff",
                      color: job.urgent ? "#d97706" : "#4f8ef7",
                    }}
                  >
                    {job.urgent ? "Urgent" : "Active"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={s.rightCol}>
          {/* Pipeline summary */}
          <div style={s.panel}>
            <div style={s.panelHead}>
              <span style={s.panelTitle}>Pipeline</span>
            </div>
            <div style={s.pipelineList}>
              {PIPELINE.map(({ stage, count, color }) => (
                <div key={stage} style={s.pipelineRow}>
                  <div style={s.pipelineLabel}>
                    <span style={{ ...s.pipelineDot, background: color }} />
                    {stage}
                  </div>
                  <div style={s.pipelineRight}>
                    <div
                      style={{
                        ...s.pipelineBar,
                        width: "120px",
                        background: "#f0f2f8",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "6px",
                          width: `${Math.min(100, (count / 60) * 100)}%`,
                          background: color,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <span style={s.pipelineCount}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={s.panel}>
            <div style={s.panelHead}>
              <span style={s.panelTitle}>Quick Actions</span>
            </div>
            <div style={s.quickGrid}>
              {QUICK.map(({ label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  className="cp-quick-btn"
                  style={{ ...s.quickBtn, borderLeft: `3px solid ${color}` }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  {
    label: "Open Positions",
    value: "24",
    delta: "+3",
    positive: true,
    color: "#4f8ef7",
    icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  },
  {
    label: "Total Applicants",
    value: "847",
    delta: "+18%",
    positive: true,
    color: "#7c3aed",
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    label: "Interviews This Week",
    value: "31",
    delta: "+7",
    positive: true,
    color: "#10b981",
    icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  },
  {
    label: "Avg. Time to Hire",
    value: "11d",
    delta: "-2d",
    positive: true,
    color: "#f59e0b",
    icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
];

const JOBS = [
  {
    title: "Senior Frontend Engineer",
    location: "Remote",
    type: "Full-time",
    applications: 48,
    urgent: false,
  },
  {
    title: "Product Manager",
    location: "London, UK",
    type: "Full-time",
    applications: 92,
    urgent: true,
  },
  { title: "Data Analyst", location: "Remote", type: "Contract", applications: 34, urgent: false },
  {
    title: "DevOps Engineer",
    location: "Berlin, DE",
    type: "Full-time",
    applications: 21,
    urgent: false,
  },
  { title: "UX Designer", location: "Remote", type: "Part-time", applications: 57, urgent: false },
];

const PIPELINE = [
  { stage: "Applied", count: 847, color: "#4f8ef7" },
  { stage: "Screening", count: 204, color: "#7c3aed" },
  { stage: "Interview", count: 58, color: "#10b981" },
  { stage: "Offer", count: 12, color: "#f59e0b" },
  { stage: "Hired", count: 7, color: "#16a34a" },
];

const QUICK = [
  { label: "Review CVs", href: "/cv", color: "#f59e0b" },
  { label: "View Matches", href: "/matches", color: "#7c3aed" },
  { label: "Applications", href: "/applications", color: "#4f8ef7" },
  { label: "Interviews", href: "/interviews", color: "#10b981" },
];

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Sora', sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "36px 32px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  greeting: {
    fontSize: "13px",
    color: "#9aa3bf",
    marginBottom: "4px",
  },
  pageTitle: {
    fontFamily: "'Lora', serif",
    fontSize: "32px",
    color: "#0c1445",
    letterSpacing: "-0.02em",
    lineHeight: 1,
    margin: 0,
  },
  newJobBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    color: "white",
    fontSize: "13px",
    fontWeight: 600,
    borderRadius: "10px",
    textDecoration: "none",
    letterSpacing: "-0.01em",
    boxShadow: "0 4px 12px rgba(79,142,247,0.35)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    border: "1.5px solid #e8eaf2",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(12,20,69,0.05)",
  },
  statTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  statLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#9aa3bf",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  statIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontFamily: "'Lora', serif",
    fontSize: "30px",
    color: "#0c1445",
    lineHeight: 1,
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  statDelta: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  contentRow: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "16px",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  panel: {
    background: "white",
    border: "1.5px solid #e8eaf2",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(12,20,69,0.04)",
  },
  panelHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderBottom: "1px solid #f0f2f8",
  },
  panelTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0c1445",
    letterSpacing: "-0.01em",
  },
  panelLink: {
    fontSize: "12px",
    color: "#4f8ef7",
    textDecoration: "none",
    fontWeight: 500,
  },
  jobRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    cursor: "default",
  },
  jobTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#0c1445",
    letterSpacing: "-0.01em",
    marginBottom: "3px",
  },
  jobMeta: {
    fontSize: "12px",
    color: "#9aa3bf",
  },
  jobRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  jobApps: {
    fontSize: "12px",
    color: "#6b7a99",
    fontWeight: 500,
  },
  jobBadge: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    padding: "2px 8px",
    borderRadius: "20px",
  },
  pipelineList: {
    padding: "12px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  pipelineRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  pipelineLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#0c1445",
    fontWeight: 500,
    minWidth: "80px",
  },
  pipelineDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  pipelineRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    justifyContent: "flex-end",
  },
  pipelineBar: {},
  pipelineCount: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#0c1445",
    minWidth: "28px",
    textAlign: "right",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    padding: "14px",
  },
  quickBtn: {
    display: "block",
    padding: "12px 14px",
    background: "#f7f8fc",
    border: "1.5px solid #e8eaf2",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#0c1445",
    textDecoration: "none",
    letterSpacing: "-0.01em",
    fontFamily: "'Sora', sans-serif",
    boxShadow: "0 1px 3px rgba(12,20,69,0.04)",
  },
};
