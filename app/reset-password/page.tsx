import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/60 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-card border border-primary/20 rounded-2xl p-8 text-center shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
