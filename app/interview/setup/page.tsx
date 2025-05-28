"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function InterviewSetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    optionalSubject: "",
    homeState: "",
    educationalBackground: "",
    workExperience: "",
    hobbies: "",
    boardComposition: "",
    sessionDuration: "",
    focusAreas: [] as string[],
    currentAffairsLevel: "",
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Start interview
      const interviewData = encodeURIComponent(JSON.stringify(formData))
      router.push(`/interview/session?data=${interviewData}`)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.optionalSubject && formData.homeState && formData.educationalBackground
      case 2:
        return formData.boardComposition && formData.sessionDuration && formData.currentAffairsLevel
      case 3:
        return formData.focusAreas.length > 0
      default:
        return false
    }
  }

  const handleFocusAreaToggle = (area: string) => {
    const newFocusAreas = formData.focusAreas.includes(area)
      ? formData.focusAreas.filter((a) => a !== area)
      : [...formData.focusAreas, area]
    setFormData({ ...formData, focusAreas: newFocusAreas })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">UPSC Interview Coach</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">Setup Mock Interview</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Personal Background"}
              {step === 2 && "Interview Configuration"}
              {step === 3 && "Focus Areas & Final Setup"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your background for personalized questions"}
              {step === 2 && "Configure your interview type and difficulty level"}
              {step === 3 && "Choose specific areas you want to focus on"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="optionalSubject">Optional Subject *</Label>
                  <Select
                    value={formData.optionalSubject}
                    onValueChange={(value) => setFormData({ ...formData, optionalSubject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your optional subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                      <SelectItem value="political-science">Political Science & International Relations</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                      <SelectItem value="sociology">Sociology</SelectItem>
                      <SelectItem value="philosophy">Philosophy</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="public-administration">Public Administration</SelectItem>
                      <SelectItem value="anthropology">Anthropology</SelectItem>
                      <SelectItem value="literature">Literature (English/Hindi/Regional)</SelectItem>
                      <SelectItem value="law">Law</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="medical-science">Medical Science</SelectItem>
                      <SelectItem value="engineering">Engineering (Civil/Mechanical/Electrical)</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="animal-husbandry">Animal Husbandry & Veterinary Science</SelectItem>
                      <SelectItem value="botany">Botany</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="geology">Geology</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="statistics">Statistics</SelectItem>
                      <SelectItem value="zoology">Zoology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="homeState">Home State/UT *</Label>
                  <Select
                    value={formData.homeState}
                    onValueChange={(value) => setFormData({ ...formData, homeState: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your home state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                      <SelectItem value="assam">Assam</SelectItem>
                      <SelectItem value="bihar">Bihar</SelectItem>
                      <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                      <SelectItem value="goa">Goa</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="haryana">Haryana</SelectItem>
                      <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                      <SelectItem value="jharkhand">Jharkhand</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="kerala">Kerala</SelectItem>
                      <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="manipur">Manipur</SelectItem>
                      <SelectItem value="meghalaya">Meghalaya</SelectItem>
                      <SelectItem value="mizoram">Mizoram</SelectItem>
                      <SelectItem value="nagaland">Nagaland</SelectItem>
                      <SelectItem value="odisha">Odisha</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="sikkim">Sikkim</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="tripura">Tripura</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="jammu-kashmir">Jammu & Kashmir</SelectItem>
                      <SelectItem value="ladakh">Ladakh</SelectItem>
                      <SelectItem value="andaman-nicobar">Andaman & Nicobar Islands</SelectItem>
                      <SelectItem value="chandigarh">Chandigarh</SelectItem>
                      <SelectItem value="dadra-nagar-haveli">Dadra & Nagar Haveli and Daman & Diu</SelectItem>
                      <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                      <SelectItem value="puducherry">Puducherry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="educationalBackground">Educational Background *</Label>
                  <Textarea
                    id="educationalBackground"
                    value={formData.educationalBackground}
                    onChange={(e) => setFormData({ ...formData, educationalBackground: e.target.value })}
                    placeholder="e.g., B.Tech in Computer Science from IIT Delhi, MBA from IIM Bangalore"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="workExperience">Work Experience (if any)</Label>
                  <Textarea
                    id="workExperience"
                    value={formData.workExperience}
                    onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                    placeholder="Describe your work experience, internships, or projects"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="hobbies">Hobbies & Interests</Label>
                  <Input
                    id="hobbies"
                    value={formData.hobbies}
                    onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                    placeholder="e.g., Reading, Cricket, Classical Music, Painting"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="boardComposition">Interview Board Composition *</Label>
                  <Select
                    value={formData.boardComposition}
                    onValueChange={(value) => setFormData({ ...formData, boardComposition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board composition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Board (5 members)</SelectItem>
                      <SelectItem value="chairman-focused">Chairman-focused Session</SelectItem>
                      <SelectItem value="subject-expert">Subject Expert Heavy</SelectItem>
                      <SelectItem value="diverse-panel">Diverse Expertise Panel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sessionDuration">Session Duration *</Label>
                  <Select
                    value={formData.sessionDuration}
                    onValueChange={(value) => setFormData({ ...formData, sessionDuration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20-25">20-25 minutes (Standard)</SelectItem>
                      <SelectItem value="15-20">15-20 minutes (Quick Round)</SelectItem>
                      <SelectItem value="25-30">25-30 minutes (Extended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentAffairsLevel">Current Affairs Preparation Level *</Label>
                  <Select
                    value={formData.currentAffairsLevel}
                    onValueChange={(value) => setFormData({ ...formData, currentAffairsLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preparation level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Basic awareness)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Regular reading)</SelectItem>
                      <SelectItem value="advanced">Advanced (Comprehensive preparation)</SelectItem>
                      <SelectItem value="expert">Expert (In-depth analysis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label>Focus Areas (Select multiple) *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      "National Issues",
                      "International Relations",
                      "Government Policies",
                      "Social Issues",
                      "Economic Developments",
                      "Environmental Concerns",
                      "Science & Technology",
                      "Defense & Security",
                      "Constitutional Matters",
                      "Administrative Reforms",
                      "Rural Development",
                      "Urban Planning",
                    ].map((area) => (
                      <div
                        key={area}
                        onClick={() => handleFocusAreaToggle(area)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.focusAreas.includes(area)
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-sm font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Interview Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Optional Subject:</strong> {formData.optionalSubject}
                    </div>
                    <div>
                      <strong>Home State:</strong> {formData.homeState}
                    </div>
                    <div>
                      <strong>Interview Type:</strong> {formData.boardComposition}
                    </div>
                    <div>
                      <strong>Preparation Level:</strong> {formData.currentAffairsLevel}
                    </div>
                    <div>
                      <strong>Focus Areas:</strong> {formData.focusAreas.join(", ")}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isStepValid()}>
                {step === 3 ? "Start Interview" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
