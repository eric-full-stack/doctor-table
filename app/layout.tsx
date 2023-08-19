// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import HomeMenu from "@/components/home-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Doctor Table",
  description: "Control your finances with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="flex min-h-screen flex-col max-w-screen-2xl items-center mx-auto md:p-24 gap-12 p-5">
            <div className="z-10 w-full items-center justify-between font-mono text-sm flex">
              <p className="text-2xl">DoctorTable</p>
              <div className="flex items-center space-x-2 flex-1 ml-4 md:ml-12">
                <HomeMenu />
              </div>
              <div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
            {children}
            <Toaster />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
