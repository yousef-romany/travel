import Footer from "@/components/layout/Footer";
import QuickProgramsButton from "@/components/programs/QuickProgramsButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <QuickProgramsButton />
    </div>
  );
}
