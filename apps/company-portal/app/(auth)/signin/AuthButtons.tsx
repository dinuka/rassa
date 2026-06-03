"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { GoogleIcon, LinkedInIcon } from "@repo/ui";

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
    <div className="cp-auth-buttons">
      <button
        className="cp-auth-btn"
        onClick={() => handleSignIn("google")}
        disabled={isLoading !== undefined}
      >
        <span className="cp-auth-btn-icon">
          {isLoading === "google" ? <div className="cp-spinner" /> : <GoogleIcon />}
        </span>
        {isLoading === "google" ? "Signing in…" : "Continue with Google"}
      </button>

      <button
        className="cp-auth-btn"
        onClick={() => handleSignIn("linkedin")}
        disabled={isLoading !== undefined}
      >
        <span className="cp-auth-btn-icon">
          {isLoading === "linkedin" ? <div className="cp-spinner" /> : <LinkedInIcon />}
        </span>
        {isLoading === "linkedin" ? "Signing in…" : "Continue with LinkedIn"}
      </button>
    </div>
  );
};

export default AuthButtons;
