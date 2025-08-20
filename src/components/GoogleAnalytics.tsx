"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  // Send page_view on route changes (App Router)
  useEffect(() => {
    if (!measurementId) return;
    const search = typeof window !== "undefined" ? window.location.search : "";
    const url = pathname + search;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", measurementId, {
        page_path: url,
      });
    }
  }, [pathname, measurementId]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname + window.location.search
          });
        `}
      </Script>
    </>
  );
}

