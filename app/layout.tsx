import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CivilsCoach.ai - AI-Powered UPSC Interview Preparation | Master Your Personality Test",
  description:
    "Master your UPSC Civil Services Personality Test with CivilsCoach.ai. AI-powered mock interviews, real-time feedback, DAF-based questions, current affairs, and ethics practice. Join 10,000+ aspirants preparing with personalized AI coaching.",
  keywords: [
    "UPSC interview preparation",
    "UPSC personality test",
    "AI mock interview",
    "civil services interview",
    "UPSC coaching",
    "DAF based questions",
    "current affairs UPSC",
    "ethics UPSC",
    "optional subject practice",
    "CivilsCoach.ai",
    "AI interview coach",
    "UPSC interview questions",
    "personality test preparation",
    "civil services coaching",
    "UPSC interview tips",
  ].join(", "),
  authors: [{ name: "CivilsCoach.ai Team" }],
  creator: "CivilsCoach.ai",
  publisher: "CivilsCoach.ai",
  robots: "index, follow",
  openGraph: {
    title: "CivilsCoach.ai - Master Your UPSC Personality Test with AI",
    description:
      "AI-powered UPSC interview preparation with realistic mock interviews, instant feedback, and personalized coaching. Join 10,000+ successful aspirants.",
    type: "website",
    url: "https://www.civilscoach.ai",
    siteName: "CivilsCoach.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CivilsCoach.ai - AI-Powered UPSC Interview Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CivilsCoach.ai - AI-Powered UPSC Interview Preparation",
    description: "Master your UPSC Personality Test with AI mock interviews and personalized feedback",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.civilscoach.ai",
  },
  other: {
    "google-site-verification": "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.civilscoach.ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:locale" content="en_US" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CivilsCoach.ai",
              description: "AI-powered UPSC interview preparation platform",
              url: "https://www.civilscoach.ai",
              logo: "https://www.civilscoach.ai/logo.png",
              sameAs: ["https://twitter.com/civilscoach", "https://linkedin.com/company/civilscoach"],
              offers: {
                "@type": "Offer",
                name: "UPSC Interview Preparation",
                description: "AI-powered mock interviews and personalized coaching",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
