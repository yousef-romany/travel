import { Suspense } from "react";
import EmailConfirmationContent from "./EmailConfirmationContent";
import { Loader } from "lucide-react";

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<EmailConfirmationFallback />}>
      <EmailConfirmationContent />
    </Suspense>
  );
}

function EmailConfirmationFallback() {
  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Confirm Email</h1>
        <div className="text-center">
          <Loader className="animate-spin mx-auto" size={32} />
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    </div>
  );
}
