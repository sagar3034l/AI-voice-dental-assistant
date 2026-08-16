import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import UserSync from "@/components/UserSync";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DentWise- AI powered Dental Assistant",
  description: "Get instant answers to your dental questions with DentWise, the AI-powered dental assistant. Our advanced technology provides accurate and reliable information to help you make informed decisions about your oral health. Whether you're looking for advice on dental procedures, oral hygiene, or general dental care, DentWise is here to help. Try it today and experience the future of dental assistance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: "#e78a53",
        colorBackground: "#f3f4f6",   // or whatever your intended value was
        colorForeground: "#111827",         // likely what you meant — common Tailwind gray-900
        colorMutedForeground: "#6b7280",
        colorInput: "#f3f4f6"
      }
    }}>
      <TanstackProvider>
        <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col dark" >
            {/* <TooltipProvider>{children}</TooltipProvider> */}

            <TooltipProvider>
              <UserSync /> 
              <Toaster />
              {children}
            </TooltipProvider>
          </body>
        </html>
      </TanstackProvider>
    </ClerkProvider>
  );
}
