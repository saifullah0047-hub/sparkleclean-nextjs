import type { Metadata } from "next";
import "./globals.css";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AICleaningAssistant from "@/components/AICleaningAssistant";
import dataRaw from "@/data/data.json";
import type { SiteData } from "@/data/types";

const site = dataRaw.site as SiteData;

export const metadata: Metadata = {
  title: {
    default: site.meta.title,
    template: `%s \u2014 ${site.name}`,
  },
  description: site.meta.description,
  icons: {
    icon: [{ url: "/img/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link href="/lib/animate/animate.min.css" rel="stylesheet" />
        <link href="/lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
        <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
      </head>
      <body>
        <Spinner />
        <Navbar />
        {children}
        <Footer />
        <BackToTop />
        <AICleaningAssistant />
      </body>
    </html>
  );
}
