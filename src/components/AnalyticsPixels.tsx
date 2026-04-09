"use client";

import Script from "next/script";

// ---------------------------------------------------------------------------
// Environment variable IDs -- set these in .env.local:
//   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
//   NEXT_PUBLIC_META_PIXEL_ID=1234567890
//   NEXT_PUBLIC_LINKEDIN_PARTNER_ID=1234567
// If a variable is not set the corresponding pixel is simply not rendered.
// ---------------------------------------------------------------------------

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

// ---------- Conversion event helpers ----------

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    lintrk: (...args: any[]) => void;
  }
}

/** Fire a GA4 custom event */
export function trackGA4Event(name: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

/** Fire a Meta Pixel standard or custom event */
export function trackMetaEvent(name: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, params);
  }
}

/** Fire a LinkedIn conversion */
export function trackLinkedInConversion(conversionId: string) {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", { conversion_id: conversionId });
  }
}

// ---------- Component ----------

export default function AnalyticsPixels() {
  return (
    <>
      {/* ---- Google Analytics 4 ---- */}
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        </>
      )}

      {/* ---- Meta Pixel ---- */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {/* ---- LinkedIn Insight Tag ---- */}
      {LINKEDIN_PARTNER_ID && (
        <>
          <Script id="linkedin-init" strategy="afterInteractive">
            {`_linkedin_partner_id="${LINKEDIN_PARTNER_ID}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);`}
          </Script>
          <Script id="linkedin-insight" strategy="afterInteractive">
            {`(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`}
          </Script>
        </>
      )}
    </>
  );
}
