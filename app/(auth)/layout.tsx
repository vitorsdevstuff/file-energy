import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-primary to-primary/80 p-12 text-white">
        <Logo variant="dark" />

        <div className="max-w-md">
          <h1 className="mb-6 text-4xl font-bold">
            Interact with your documents powered by AI.
          </h1>
          <p className="text-lg text-white/80">
            File.energy helps you save time on document analysis and gives your
            energy to things that really matter.
          </p>
        </div>

        <p className="text-sm text-white/60">
          &copy; {new Date().getFullYear()} File.energy. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col justify-center px-4 lg:w-1/2 lg:px-16">
        <div className="lg:hidden mb-8">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
