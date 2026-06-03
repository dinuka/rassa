"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { GoogleIcon, LinkedInIcon } from "@repo/ui";

const Spinner = () => (
  <div className="auth-btn-loading">
    <div className="spinner" />
  </div>
);

const AuthButtons = () => {
  const [isLoading, setIsLoading] = useState<"google" | "linkedin" | undefined>(undefined);

  const handleSignIn = async (provider: "google" | "linkedin") => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      setIsLoading(undefined);
    }
  };

  return (
    <div className="auth-buttons">
      <button
        className="auth-btn"
        onClick={() => handleSignIn("google")}
        disabled={isLoading !== undefined}
      >
        <span className="auth-btn-icon">
          {isLoading === "google" ? <Spinner /> : <GoogleIcon />}
        </span>
        <span className="auth-btn-label">
          {isLoading === "google" ? "Signing in…" : "Continue with Google"}
        </span>
      </button>

      <button
        className="auth-btn"
        onClick={() => handleSignIn("linkedin")}
        disabled={isLoading !== undefined}
      >
        <span className="auth-btn-icon">
          {isLoading === "linkedin" ? <Spinner /> : <LinkedInIcon />}
        </span>
        <span className="auth-btn-label">
          {isLoading === "linkedin" ? "Signing in…" : "Continue with LinkedIn"}
        </span>
      </button>
    </div>
  );
};

export default AuthButtons;
