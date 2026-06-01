import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import AuthButtons from "./AuthButtons";

export const metadata = {
  title: "Admin Sign In - Rassa",
  description: "Sign in to the admin panel",
};

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied:
    "Your account is not authorised to access the admin portal. Contact your administrator.",
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
    <div className="signin-root">
      {/* Left brand panel */}
      <div className="signin-brand">
        <div className="signin-brand-inner">
          <div className="signin-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.15" />
              <rect x="7" y="7" width="8" height="8" rx="1.5" fill="white" />
              <rect x="17" y="7" width="8" height="8" rx="1.5" fill="white" fillOpacity="0.6" />
              <rect x="7" y="17" width="8" height="8" rx="1.5" fill="white" fillOpacity="0.6" />
              <rect x="17" y="17" width="8" height="8" rx="1.5" fill="white" fillOpacity="0.3" />
            </svg>
            <span className="signin-logo-text">Rassa</span>
          </div>

          <div className="signin-brand-copy">
            <h2 className="signin-brand-headline">Admin Portal</h2>
            <p className="signin-brand-sub">
              Internal operations & management console for authorized personnel only.
            </p>
          </div>

          <div className="signin-brand-footer">
            <span>© 2025 Rassa. All rights reserved.</span>
          </div>
        </div>

        {/* Decorative geometric background */}
        <div className="signin-brand-geo" aria-hidden="true">
          <div className="geo-circle geo-circle-1" />
          <div className="geo-circle geo-circle-2" />
          <div className="geo-grid" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="signin-form-panel">
        <div className="signin-form-inner">
          <div className="signin-header">
            <p className="signin-eyebrow">Secure Access</p>
            <h1 className="signin-title">
              Sign in to
              <br />
              Admin Portal
            </h1>
            <p className="signin-desc">Use your authorized organizational account to continue.</p>
          </div>

          {errorMessage && (
            <div className="signin-error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <AuthButtons />

          <div className="signin-divider">
            <span className="signin-divider-line" />
            <span className="signin-divider-text">restricted access</span>
            <span className="signin-divider-line" />
          </div>

          <p className="signin-notice">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Only pre-approved administrators may access this portal. Unauthorized access attempts
            are logged and monitored.
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        .signin-root {
          display: flex;
          min-height: 100vh;
          background: #f8f7f5;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Brand panel ── */
        .signin-brand {
          position: relative;
          width: 420px;
          flex-shrink: 0;
          background: linear-gradient(155deg, #1a1f36 0%, #0f1420 60%, #111827 100%);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .signin-brand-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 48px 44px;
        }

        .signin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: auto;
        }

        .signin-logo-text {
          font-size: 20px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.02em;
        }

        .signin-brand-copy {
          margin-bottom: 64px;
        }

        .signin-brand-headline {
          font-family: 'DM Serif Display', serif;
          font-size: 42px;
          line-height: 1.1;
          color: white;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }

        .signin-brand-sub {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          max-width: 280px;
        }

        .signin-brand-footer {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.01em;
        }

        /* Geometric decoration */
        .signin-brand-geo {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .geo-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .geo-circle-1 {
          width: 400px;
          height: 400px;
          bottom: -120px;
          right: -160px;
        }

        .geo-circle-2 {
          width: 240px;
          height: 240px;
          bottom: -20px;
          right: -60px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .geo-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: linear-gradient(135deg, transparent 40%, black 100%);
        }

        /* ── Form panel ── */
        .signin-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          background: #f8f7f5;
        }

        .signin-form-inner {
          width: 100%;
          max-width: 380px;
        }

        .signin-header {
          margin-bottom: 40px;
        }

        .signin-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          margin: 0 0 16px 0;
        }

        .signin-title {
          font-family: 'DM Serif Display', serif;
          font-size: 38px;
          line-height: 1.1;
          color: #0f1420;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .signin-desc {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Error banner ── */
        .signin-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px;
          margin-bottom: 20px;
          background: #fff5f5;
          border: 1.5px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
          color: #b91c1c;
          line-height: 1.5;
        }

        /* ── Auth buttons (native, no shared Button) ── */
        .auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .auth-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 0 20px;
          height: 52px;
          border-radius: 10px;
          border: 1.5px solid #e2e1de;
          background: white;
          color: #1a1f36;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          text-align: left;
          letter-spacing: -0.01em;
        }

        .auth-btn:hover:not(:disabled) {
          border-color: #c7c6c2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
          transform: translateY(-1px);
          background: #fefefe;
        }

        .auth-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }

        .auth-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .auth-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .auth-btn-label {
          flex: 1;
        }

        .auth-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e2e1de;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Divider ── */
        .signin-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0;
        }

        .signin-divider-line {
          flex: 1;
          height: 1px;
          background: #e2e1de;
        }

        .signin-divider-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9ca3af;
          white-space: nowrap;
        }

        /* ── Notice ── */
        .signin-notice {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.6;
          margin: 0;
          padding: 14px 16px;
          background: #f0eeeb;
          border-radius: 8px;
          border: 1px solid #e2e1de;
        }

        .signin-notice svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: #9ca3af;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .signin-root {
            flex-direction: column;
          }

          .signin-brand {
            width: 100%;
            min-height: 200px;
            flex-direction: row;
          }

          .signin-brand-inner {
            padding: 32px;
            flex-direction: row;
            align-items: center;
            gap: 24px;
          }

          .signin-brand-copy {
            margin-bottom: 0;
          }

          .signin-brand-headline {
            font-size: 28px;
          }

          .signin-brand-sub,
          .signin-brand-footer {
            display: none;
          }

          .signin-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
