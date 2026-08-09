import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import TimelineHUD from "@/components/TimelineHUD";
import GlobalSweep from "@/components/GlobalSweep";
import ErrorBoundary from "@/components/ErrorBoundary";
import SmoothScrolling from "@/components/SmoothScrolling";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-instrument" 
});

export const metadata: Metadata = {
  title: "Videographer & Editor Portfolio",
  description: "Frames that move people.",
};

export const viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${instrument.variable} bg-bg text-text antialiased`}>
        <TimelineHUD />
        <GlobalSweep />
        <div className="relative z-10 pb-20 md:pb-32">
          <SmoothScrolling>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </SmoothScrolling>
        </div>
      </body>
    </html>
  );
}
