import { redirect } from "next/navigation";

import { Brain, FileText, Sparkles, Target } from "lucide-react";

import { auth } from "@/lib/auth";

import AuthButtons from "./AuthButtons";

export const metadata = {
  title: "Sign In - Rassa",
  description: "Sign in to your Rassa account",
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
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="from-primary/10 via-background to-background relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br p-12 lg:flex lg:w-1/2">
        <div className="from-primary/5 absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] via-transparent to-transparent" />

        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <Sparkles className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-foreground text-2xl font-bold">Rassa</span>
          </div>
          <p className="text-muted-foreground text-sm">AI-Powered Career Platform</p>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-foreground text-4xl leading-tight font-bold text-balance">
            Your career journey,
            <br />
            <span className="text-primary">powered by AI</span>
          </h1>

          <div className="space-y-6">
            <FeatureItem
              icon={<Target className="h-5 w-5" />}
              title="Smart Job Matching"
              description="Get matched with opportunities that fit your skills and experience"
            />
            <FeatureItem
              icon={<FileText className="h-5 w-5" />}
              title="AI Resume Builder"
              description="Generate tailored resumes for each job application"
            />
            <FeatureItem
              icon={<Brain className="h-5 w-5" />}
              title="Interview Preparation"
              description="Practice with AI-generated questions specific to your target role"
            />
          </div>
        </div>

        <div className="text-muted-foreground relative z-10 text-sm">
          Trusted by thousands of job seekers worldwide
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <Sparkles className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-foreground text-2xl font-bold">Rassa</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-foreground text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to continue to your dashboard</p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <AuthButtons />

          <p className="text-muted-foreground text-center text-xs">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="text-foreground font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);
