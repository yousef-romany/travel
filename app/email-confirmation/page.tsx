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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex justify-center items-center px-4 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/60 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-card border border-primary/20 rounded-2xl shadow-2xl relative">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Confirm Email</h1>
        <div className="text-center">
          <Loader className="animate-spin mx-auto text-primary" size={32} />
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    </div>
  );
}
