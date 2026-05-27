"use client";

import { useSession } from "next-auth/react";

import { useLogout } from "@repo/auth";

const Header = () => {
  const logout = useLogout();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="rgba(255,255,255,0.12)" />
          <rect x="7" y="7" width="8" height="8" rx="1.5" fill="white" />
          <rect x="17" y="7" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.55)" />
          <rect x="7" y="17" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.55)" />
          <rect x="17" y="17" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.25)" />
        </svg>
        <span style={styles.brandName}>Rassa Admin</span>
        <span style={styles.brandSep}>|</span>
        <span style={styles.brandSub}>Internal Console</span>
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{initials}</div>
          <div style={styles.userMeta}>
            <span style={styles.userName}>{session?.user?.name ?? "Administrator"}</span>
            <span style={styles.userEmail}>{session?.user?.email ?? ""}</span>
          </div>
        </div>

        <div style={styles.divider} />

        <button style={styles.logoutBtn} onClick={logout} onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
        }} onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "60px",
    padding: "0 28px",
    background: "linear-gradient(135deg, #1a1f36 0%, #0f1420 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    fontFamily: "'DM Sans', sans-serif",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  brandName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "white",
    letterSpacing: "-0.01em",
  },
  brandSep: {
    color: "rgba(255,255,255,0.2)",
    fontSize: "14px",
  },
  brandSub: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.02em",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
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
    fontWeight: 500,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 1.2,
  },
  userEmail: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.2,
  },
  divider: {
    width: "1px",
    height: "24px",
    background: "rgba(255,255,255,0.12)",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 12px",
    borderRadius: "7px",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.55)",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.15s ease",
    letterSpacing: "-0.01em",
  },
};

export default Header;
