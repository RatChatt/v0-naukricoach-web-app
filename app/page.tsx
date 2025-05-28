"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Globe, Award, BookOpen, Scale } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">UPSC Interview Coach</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your UPSC <span className="text-blue-600">Personality Test</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Prepare for your UPSC Civil Services Personality Test with AI-powered mock interviews, real-time feedback,
            and comprehensive practice across all key areas including current affairs, ethics, and your optional
            subject.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Mock Interview
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose UPSC Interview Coach?</h2>
            <p className="text-xl text-gray-600">AI-powered features designed specifically for UPSC aspirants</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>UPSC-Specific Questions</CardTitle>
                <CardDescription>
                  Questions tailored to your optional subject, home state, educational background, and current affairs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>AI-Driven Analysis</CardTitle>
                <CardDescription>
                  Real-time scoring on content knowledge, clarity of thought, and communication skills
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Current Affairs Focus</CardTitle>
                <CardDescription>
                  Updated questions on latest national and international developments, government policies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Scale className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Ethics & Integrity</CardTitle>
                <CardDescription>
                  Comprehensive practice on ethical dilemmas, case studies, and moral reasoning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Optional Subject Mastery</CardTitle>
                <CardDescription>
                  Deep-dive questions on your chosen optional subject with expert-level analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Board Simulation</CardTitle>
                <CardDescription>
                  Experience realistic UPSC interview board scenarios with multiple panel members
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* UPSC Specific Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete UPSC Interview Preparation</h2>
            <p className="text-xl text-gray-600">Cover all aspects of the UPSC Personality Test</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Interview Categories</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Personal Background</h4>
                    <p className="text-gray-600">
                      Questions about your education, family, hobbies, and life experiences
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Current Affairs</h4>
                    <p className="text-gray-600">
                      National and international events, government policies, and social issues
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Optional Subject</h4>
                    <p className="text-gray-600">In-depth questions on your chosen optional subject</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Ethics & Integrity</h4>
                    <p className="text-gray-600">Moral dilemmas, ethical case studies, and value-based questions</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Assessment Criteria</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Mental Alertness</h4>
                    <p className="text-gray-600">Quick thinking, problem-solving, and analytical ability</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Critical Powers of Assimilation</h4>
                    <p className="text-gray-600">Understanding complex issues and synthesizing information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Clear & Logical Exposition</h4>
                    <p className="text-gray-600">Articulating thoughts clearly and logically</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Balance of Judgment</h4>
                    <p className="text-gray-600">Balanced perspective and sound decision-making</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Ace Your UPSC Interview?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of UPSC aspirants who've improved their interview performance with our AI coach
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Your Preparation
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Brain className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-2xl font-bold">UPSC Interview Coach</span>
          </div>
          <p className="text-center text-gray-400 mt-4">© 2024 UPSC Interview Coach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
