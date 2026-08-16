import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "AqoonsiPlus | Your Leadership. Your Identity. Your Legacy.",
    template: "%s | AqoonsiPlus",
  },
  description:
    "AqoonsiPlus is a trusted digital profile and information management platform for leaders, professionals, government officials, and public figures — verified profiles, leadership histories, and secure digital legacies.",
  keywords: [
    "AqoonsiPlus",
    "digital profile",
    "leadership archive",
    "verified profile",
    "government officials",
    "digital legacy",
  ],
  openGraph: {
    title: "AqoonsiPlus | Your Leadership. Your Identity. Your Legacy.",
    description:
      "Discover verified digital profiles, leadership histories, achievements, and professional legacies in one trusted platform.",
    siteName: "AqoonsiPlus",
    type: "website",
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
