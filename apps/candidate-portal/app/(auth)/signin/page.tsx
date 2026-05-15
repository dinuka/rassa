import { AuthButtons } from "./auth-buttons";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sparkles, Target, FileText, Brain } from "lucide-react";

export const metadata = {
  title: "Sign In - Rassa",
  description: "Sign in to your Rassa account",
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-background p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Rassa</span>
          </div>
          <p className="text-muted-foreground text-sm">AI-Powered Career Platform</p>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl font-bold text-foreground leading-tight text-balance">
            Your career journey,<br />
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

        <div className="relative z-10 text-sm text-muted-foreground">
          Trusted by thousands of job seekers worldwide
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Rassa</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>

          <AuthButtons />

          <p className="text-center text-xs text-muted-foreground">
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

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
