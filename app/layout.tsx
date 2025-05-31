import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UPSC Interview Coach - AI-Powered Personality Test Preparation",
  description:
    "Master your UPSC Civil Services Personality Test with AI-powered mock interviews, adaptive questioning, and comprehensive feedback. Sign in with Google for instant access.",
  keywords: "UPSC, interview, preparation, AI, civil services, personality test, mock interview",
  openGraph: {
    title: "UPSC Interview Coach - AI-Powered Interview Preparation",
    description: "Master your UPSC interview with AI-powered mock sessions and personalized feedback",
    type: "website",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
