import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/i18n/language-provider";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";
import { LOCALE_META } from "@/i18n/config";
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

const SITE_URL = "https://www.aqoonsiplus.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AqoonsiPlus | Your Leadership. Your Identity. Your Legacy.",
    description:
      "Discover verified digital profiles, leadership histories, achievements, and professional legacies in one trusted platform.",
    siteName: "AqoonsiPlus",
    url: SITE_URL,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AqoonsiPlus | Your Leadership. Your Identity. Your Legacy.",
    description:
      "Discover verified digital profiles, leadership histories, achievements, and professional legacies in one trusted platform.",
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AqoonsiPlus",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "A trusted digital profile and information management platform for leaders, professionals, government officials, and public figures in Somalia.",
  sameAs: [
    "https://x.com/aqoonsiplus",
    "https://www.tiktok.com/@aqoonsiplus",
    "https://www.linkedin.com/in/aqoonsi-plus-b2267642a/",
    "https://www.facebook.com/share/19RPR1MFj3/?mibextid=wwXIfr",
  ],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AqoonsiPlus",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const dir = LOCALE_META[locale].dir;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${jakarta.variable} ${inter.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LanguageProvider locale={locale} dictionary={dictionary}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors closeButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
