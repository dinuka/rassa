"use client";

import { useSession } from "next-auth/react";

import { useLogout } from "@repo/auth";

const Header = () => {
  const logout = useLogout();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "C";

  return (
    <header style={s.header}>
      <div style={s.brand}>
        <div style={s.logoMark}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span style={s.brandName}>Rassa</span>
        <span style={s.brandSep} />
        <span style={s.brandContext}>Hiring Console</span>
      </div>

      <div style={s.right}>
        <div style={s.userChip}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.userMeta}>
            <span style={s.userName}>{session?.user?.name ?? "Recruiter"}</span>
            <span style={s.userEmail}>{session?.user?.email ?? ""}</span>
          </div>
        </div>

        <div style={s.sep} />

        <button
          style={s.logoutBtn}
          onClick={logout}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f0f2f8";
            (e.currentTarget as HTMLButtonElement).style.color = "#0c1445";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#6b7a99";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </header>
  );
};

const s: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "60px",
    padding: "0 28px",
    background: "white",
    borderBottom: "1px solid #e8eaf2",
    fontFamily: "'Sora', sans-serif",
    boxShadow: "0 1px 3px rgba(12,20,69,0.04)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoMark: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#0c1445",
    letterSpacing: "-0.02em",
  },
  brandSep: {
    width: "1px",
    height: "16px",
    background: "#e8eaf2",
  },
  brandContext: {
    fontSize: "12px",
    color: "#9aa3bf",
    fontWeight: 500,
    letterSpacing: "0.01em",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    color: "white",
    letterSpacing: "0.02em",
    flexShrink: 0,
  },
  userMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  userName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#0c1445",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  userEmail: {
    fontSize: "11px",
    color: "#9aa3bf",
    lineHeight: 1.2,
  },
  sep: {
    width: "1px",
    height: "24px",
    background: "#e8eaf2",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 12px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#6b7a99",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "'Sora', sans-serif",
    cursor: "pointer",
    transition: "all 0.15s ease",
    letterSpacing: "-0.01em",
  },
};

export default Header;
