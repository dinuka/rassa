import { redirect } from "next/navigation";

import { RassaLogoIcon } from "@repo/ui";

import { auth } from "@/lib/auth";

import AuthButtons from "./AuthButtons";

export const metadata = {
  title: "Sign In — Rassa for Companies",
  description: "Sign in to your company hiring account",
};

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Your account doesn't have access. Please contact support.",
  OAuthSignin: "Could not start the sign-in flow. Please try again.",
  OAuthCallback: "Something went wrong during sign-in. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to a different sign-in method.",
  SessionRequired: "You must be signed in to access this page.",
  Default: "An unexpected error occurred. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : null;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cp-root { font-family: 'Sora', sans-serif; }

        /* Brand panel */
        .cp-brand {
          position: relative;
          width: 480px;
          flex-shrink: 0;
          background: #0c1445;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .cp-brand-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 52px 48px;
        }

        .cp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: auto;
        }

        .cp-logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cp-logo-name {
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }

        .cp-logo-tag {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.08);
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }

        .cp-headline {
          font-family: 'Lora', serif;
          font-size: 40px;
          line-height: 1.15;
          color: white;
          letter-spacing: -0.01em;
          margin-bottom: 48px;
        }

        .cp-headline em {
          font-style: italic;
          color: #4f8ef7;
        }

        .cp-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 56px;
        }

        .cp-feature {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .cp-feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: rgba(79, 142, 247, 0.15);
          border: 1px solid rgba(79, 142, 247, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .cp-feature-text h4 {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.01em;
          margin-bottom: 2px;
        }

        .cp-feature-text p {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.5;
        }

        .cp-stat-row {
          display: flex;
          gap: 32px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .cp-stat-value {
          font-family: 'Lora', serif;
          font-size: 28px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 4px;
        }

        .cp-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Decorative blobs */
        .cp-deco {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .cp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }

        .cp-blob-1 {
          width: 300px;
          height: 300px;
          top: -80px;
          right: -80px;
          background: radial-gradient(circle, rgba(79,142,247,0.2) 0%, transparent 70%);
        }

        .cp-blob-2 {
          width: 250px;
          height: 250px;
          bottom: 60px;
          left: -60px;
          background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
        }

        .cp-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom right, transparent 20%, black 60%, transparent 90%);
        }

        /* Form panel */
        .cp-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #f7f8fc;
        }

        .cp-form-inner {
          width: 100%;
          max-width: 400px;
        }

        .cp-form-header {
          margin-bottom: 36px;
        }

        .cp-form-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4f8ef7;
          margin-bottom: 12px;
        }

        .cp-form-title {
          font-family: 'Lora', serif;
          font-size: 34px;
          line-height: 1.15;
          color: #0c1445;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }

        .cp-form-desc {
          font-size: 14px;
          color: #6b7a99;
          line-height: 1.6;
        }

        /* Error */
        .cp-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px;
          margin-bottom: 24px;
          background: #fff5f5;
          border: 1.5px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
          color: #b91c1c;
          line-height: 1.5;
          font-family: 'Sora', sans-serif;
        }

        .cp-error svg { flex-shrink: 0; margin-top: 1px; }

        /* Auth buttons */
        .cp-auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cp-auth-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 0 20px;
          height: 52px;
          border-radius: 12px;
          border: 1.5px solid #dde1ed;
          background: white;
          color: #0c1445;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 1px 4px rgba(12,20,69,0.06);
          letter-spacing: -0.01em;
        }

        .cp-auth-btn:hover:not(:disabled) {
          border-color: #b8c0d8;
          box-shadow: 0 6px 16px rgba(12,20,69,0.1);
          transform: translateY(-1px);
        }

        .cp-auth-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(12,20,69,0.06);
        }

        .cp-auth-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .cp-auth-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .cp-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #dde1ed;
          border-top-color: #4f8ef7;
          border-radius: 50%;
          animation: cp-spin 0.7s linear infinite;
        }

        @keyframes cp-spin { to { transform: rotate(360deg); } }

        /* Divider */
        .cp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
        }

        .cp-divider-line {
          flex: 1;
          height: 1px;
          background: #dde1ed;
        }

        .cp-divider-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #9aa3bf;
          white-space: nowrap;
        }

        /* Footer note */
        .cp-footer-note {
          font-size: 12px;
          color: #9aa3bf;
          line-height: 1.6;
          text-align: center;
        }

        .cp-footer-note a {
          color: #4f8ef7;
          text-decoration: none;
        }

        .cp-footer-note a:hover { text-decoration: underline; }

        /* Responsive */
        @media (max-width: 900px) {
          .cp-brand { display: none; }
          .cp-form-panel { background: white; }
        }
      `}</style>

      {/* Brand panel */}
      <div className="cp-brand">
        <div className="cp-brand-inner">
          <div className="cp-logo">
            <div className="cp-logo-mark">
              <RassaLogoIcon size={18} />
            </div>
            <span className="cp-logo-name">Rassa</span>
            <span className="cp-logo-tag">for companies</span>
          </div>

          <h2 className="cp-headline">
            Hire smarter with
            <br />
            <em>AI-powered</em>
            <br />
            talent matching
          </h2>

          <div className="cp-features">
            <div className="cp-feature">
              <div className="cp-feature-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f8ef7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <div className="cp-feature-text">
                <h4>Smart Candidate Matching</h4>
                <p>Surface the right candidates automatically using deep skill analysis</p>
              </div>
            </div>
            <div className="cp-feature">
              <div className="cp-feature-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f8ef7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="cp-feature-text">
                <h4>Instant CV Screening</h4>
                <p>Rank and score applicants in seconds, not days</p>
              </div>
            </div>
            <div className="cp-feature">
              <div className="cp-feature-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f8ef7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="cp-feature-text">
                <h4>Interview Intelligence</h4>
                <p>AI-generated questions tailored to each candidate and role</p>
              </div>
            </div>
          </div>

          <div className="cp-stat-row">
            <div>
              <div className="cp-stat-value">12k+</div>
              <div className="cp-stat-label">Candidates placed</div>
            </div>
            <div>
              <div className="cp-stat-value">94%</div>
              <div className="cp-stat-label">Match accuracy</div>
            </div>
            <div>
              <div className="cp-stat-value">3×</div>
              <div className="cp-stat-label">Faster hiring</div>
            </div>
          </div>
        </div>

        <div className="cp-deco" aria-hidden="true">
          <div className="cp-blob cp-blob-1" />
          <div className="cp-blob cp-blob-2" />
          <div className="cp-dots" />
        </div>
      </div>

      {/* Form panel */}
      <div className="cp-form-panel">
        <div className="cp-form-inner">
          <div className="cp-form-header">
            <p className="cp-form-eyebrow">Company portal</p>
            <h1 className="cp-form-title">Welcome back</h1>
            <p className="cp-form-desc">
              Sign in to manage your jobs, candidates, and hiring pipeline.
            </p>
          </div>

          {errorMessage && (
            <div className="cp-error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <AuthButtons />

          <div className="cp-divider">
            <span className="cp-divider-line" />
            <span className="cp-divider-text">new to rassa?</span>
            <span className="cp-divider-line" />
          </div>

          <p className="cp-footer-note">
            Your company account is created automatically on first sign-in.
            <br />
            By continuing you agree to our <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Sora', sans-serif",
  },
};
