"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { Button, GoogleIcon, LinkedInIcon } from "@repo/ui";

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
    <div className="space-y-4">
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-full justify-center gap-3 text-base"
        onClick={() => handleSignIn("google")}
        isLoading={isLoading === "google"}
        disabled={isLoading !== undefined}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="h-12 w-full justify-center gap-3 text-base"
        onClick={() => handleSignIn("linkedin")}
        isLoading={isLoading === "linkedin"}
        disabled={isLoading !== undefined}
      >
        <LinkedInIcon />
        Continue with LinkedIn
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Secure authentication</span>
        </div>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        New to Rassa?{" "}
        <span className="text-foreground">Your account will be created automatically</span>
      </p>
    </div>
  );
};

export default AuthButtons;
