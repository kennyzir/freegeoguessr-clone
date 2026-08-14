import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { siteConfig } from '@/config/site'

const sameAs = Object.values(siteConfig.socials).filter(Boolean)

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}/icon-512x512.png`,
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon-512x512.png`,
  },
  ...(sameAs.length > 0 ? { sameAs } : {}),
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.homepageTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.homepageTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: `${siteConfig.name} brand mark`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: siteConfig.homepageTitle,
    description: siteConfig.description,
    images: ['/icon-512x512.png'],
  },
  keywords: [...siteConfig.keywords],
  icons: {
    icon: [
      { url: '/brand-mark.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/brand-mark.svg',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  // Google Search Console verification
  ...(siteConfig.gscVerification
    ? { verification: { google: siteConfig.gscVerification } }
    : {}),
  // PWA
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'theme-color': siteConfig.themeColor,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://img.qizhilu.org" />
        <link rel="preconnect" href="https://azgames.io" />
        <link rel="dns-prefetch" href="https://img.qizhilu.org" />
        <link rel="dns-prefetch" href="https://azgames.io" />
        {/* PWA Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
        {/* Google AdSense — loads async, no user impact on LCP */}
        {siteConfig.adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Google Analytics 4 */}
        {siteConfig.ga4MeasurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4MeasurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${siteConfig.ga4MeasurementId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 lg:pl-56">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
