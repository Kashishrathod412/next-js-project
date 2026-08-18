import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import localFont from 'next/font/local'
import TimelineHUD from "@/components/TimelineHUD";
import GlobalSweep from "@/components/GlobalSweep";
import ErrorBoundary from "@/components/ErrorBoundary";
import SmoothScrolling from "@/components/SmoothScrolling";
import GlobalLoading from "@/components/GlobalLoading";
import WhatsAppButton from "@/components/WhatsAppButton";
import InstagramButton from "@/components/InstagramButton";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-instrument" 
});
const deltha = localFont({
  src: '../../public/font/Deltha.ttf',
  variable: '--font-deltha'
});
const equinox = localFont({
  src: '../../public/font/Equinox-Typeface/Equinox_Typeface_Dfonts.org/Equinox Bold.otf',
  variable: '--font-equinox'
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
      <body className={`${inter.variable} ${instrument.variable} ${deltha.variable} ${equinox.variable} bg-bg text-text antialiased font-deltha`}>
        <SmoothScrolling>
          <GlobalLoading />
          <TimelineHUD />
          <GlobalSweep />
          <WhatsAppButton />
          <InstagramButton />
          <div className="relative z-10 pb-20 md:pb-32">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </SmoothScrolling>
      </body>
    </html>
  );
}

