import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface EvaluationCriteria {
  content_knowledge: number
  clarity_of_thought: number
  communication_skills: number
  analytical_ability: number
  ethical_reasoning: number
  current_affairs_awareness: number
  administrative_aptitude: number
  leadership_potential: number
}

interface EvaluationResult {
  overall_score: number
  criteria_scores: EvaluationCriteria
  feedback: string
  strengths: string[]
  improvements: string[]
  follow_up_suggested: boolean
  complexity_adjustment: number
  detailed_analysis: {
    content_depth: string
    factual_accuracy: string
    perspective_balance: string
    practical_application: string
    communication_quality: string
    time_management: string
  }
  specific_suggestions: string[]
  benchmark_comparison: string
}

export async function evaluateResponse(
  question: string,
  answer: string,
  questionType: string,
  complexity: number,
  userBackground: any,
  timeTaken?: number,
): Promise<EvaluationResult> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are Dr. Rajesh Kothari, a senior UPSC interview board member with 25+ years of experience evaluating civil service candidates. You have personally interviewed over 3,000 candidates and have deep expertise in assessing personality traits, knowledge depth, and administrative potential.

EVALUATION CONTEXT:
Question: "${question}"
Question Type: ${questionType}
Complexity Level: ${complexity}/5
Candidate's Answer: "${answer}"
Time Taken: ${timeTaken ? `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}` : "Not specified"}

CANDIDATE BACKGROUND:
- Optional Subject: ${userBackground.optionalSubject || "Not specified"}
- Home State: ${userBackground.homeState || "Not specified"}
- Educational Background: ${userBackground.educationalBackground || "Not specified"}
- Current Affairs Level: ${userBackground.currentAffairsLevel || "Not specified"}
- Work Experience: ${userBackground.workExperience || "Not specified"}

EVALUATION FRAMEWORK:
You must evaluate this response using the exact standards and expectations of the UPSC Civil Services Personality Test. Consider the candidate's background and adjust expectations accordingly.

DETAILED SCORING CRITERIA (1-10 scale):

1. CONTENT KNOWLEDGE & ACCURACY (Weight: 25%)
   - Factual correctness and depth of understanding
   - Relevance to the question asked
   - Use of appropriate examples, data, and case studies
   - Understanding of policies, schemes, and current developments
   - Connection to broader governance context

2. CLARITY OF THOUGHT & EXPRESSION (Weight: 20%)
   - Logical structure and coherent flow of ideas
   - Clear articulation without ambiguity
   - Appropriate use of language and terminology
   - Ability to explain complex concepts simply
   - Coherent progression from introduction to conclusion

3. COMMUNICATION SKILLS (Weight: 15%)
   - Confidence and conviction in delivery
   - Appropriate tone and register for civil services
   - Engagement with the question
   - Persuasiveness and impact
   - Professional communication style

4. ANALYTICAL & CRITICAL THINKING (Weight: 15%)
   - Ability to analyze complex issues from multiple angles
   - Cause-effect understanding and systems thinking
   - Problem-solving approach and solution orientation
   - Critical evaluation of different perspectives
   - Synthesis of information from various sources

5. ETHICAL REASONING (Weight: 10%)
   - Moral clarity and ethical framework
   - Balance between competing values and interests
   - Understanding of public service ethics and values
   - Integrity in approach and decision-making
   - Consideration of stakeholder impacts

6. CURRENT AFFAIRS AWARENESS (Weight: 5%)
   - Knowledge of recent developments and their implications
   - Understanding of policy changes and their impact
   - Awareness of national and international context
   - Connection to contemporary governance challenges

7. ADMINISTRATIVE APTITUDE (Weight: 5%)
   - Understanding of governance processes and structures
   - Practical implementation perspective
   - Stakeholder awareness and management
   - Administrative feasibility and ground realities
   - Policy-implementation nexus understanding

8. LEADERSHIP POTENTIAL (Weight: 5%)
   - Vision and strategic thinking capability
   - Decision-making under uncertainty
   - Ability to inspire and influence others
   - Taking responsibility and accountability
   - Change management and innovation mindset

SPECIFIC EVALUATION GUIDELINES BY QUESTION TYPE:

FOR PERSONAL QUESTIONS:
- Assess self-awareness, authenticity, and learning from experiences
- Look for genuine motivation and clear career vision
- Evaluate ability to connect personal experiences to public service
- Check for maturity, emotional intelligence, and self-reflection

FOR CURRENT AFFAIRS QUESTIONS:
- Demand factual accuracy and recent knowledge
- Expect policy understanding and implementation awareness
- Look for multi-dimensional analysis and balanced perspectives
- Assess ability to connect local, national, and global contexts

FOR ETHICS QUESTIONS:
- Prioritize moral reasoning and value-based decision making
- Expect consideration of all stakeholders and competing interests
- Look for practical wisdom and real-world applicability
- Assess integrity, transparency, and accountability in approach

FOR GOVERNANCE QUESTIONS:
- Focus on administrative understanding and implementation challenges
- Expect knowledge of government structures and processes
- Look for citizen-centric and service delivery orientation
- Assess innovation, efficiency, and effectiveness mindset

FOR OPTIONAL SUBJECT QUESTIONS:
- Expect deep subject knowledge and conceptual clarity
- Look for ability to connect subject expertise to public administration
- Assess interdisciplinary thinking and practical applications
- Evaluate teaching and knowledge-sharing capability

SCORING STANDARDS:
- 9-10: Exceptional - Demonstrates mastery with original insights and comprehensive understanding
- 7-8: Very Good - Shows strong knowledge with good analysis, examples, and balanced perspective
- 5-6: Satisfactory - Basic understanding with some gaps, needs more depth and examples
- 3-4: Below Average - Limited knowledge with significant gaps, superficial treatment
- 1-2: Poor - Inadequate understanding with major errors, irrelevant or incorrect content

BENCHMARK COMPARISON:
Compare this response to typical UPSC interview standards:
- Top 10% candidates (Rank 1-100): Score 8.5-10
- Top 25% candidates (Rank 101-500): Score 7.5-8.4
- Average successful candidates (Rank 501-1000): Score 6.5-7.4
- Below average but selected (Rank 1001+): Score 5.5-6.4
- Not recommended: Score below 5.5

DETAILED ANALYSIS REQUIREMENTS:
1. Content Depth: Analyze the substantive quality, factual accuracy, and conceptual understanding
2. Factual Accuracy: Verify correctness of facts, figures, policies, and references mentioned
3. Perspective Balance: Evaluate whether multiple viewpoints and stakeholder interests were considered
4. Practical Application: Assess real-world applicability, implementation feasibility, and ground realities
5. Communication Quality: Evaluate language use, structure, clarity, and professional presentation
6. Time Management: Assess appropriateness of response length and depth for time taken

SPECIFIC FEEDBACK REQUIREMENTS:
- Provide specific examples from the candidate's response
- Reference actual policies, schemes, or current events where relevant
- Give actionable improvement suggestions with concrete steps
- Compare performance to expected UPSC standards
- Suggest specific areas for further study or practice

Return your evaluation in this exact JSON format:
{
  "overall_score": 7.2,
  "criteria_scores": {
    "content_knowledge": 7,
    "clarity_of_thought": 8,
    "communication_skills": 7,
    "analytical_ability": 6,
    "ethical_reasoning": 7,
    "current_affairs_awareness": 8,
    "administrative_aptitude": 7,
    "leadership_potential": 6
  },
  "feedback": "Comprehensive, specific feedback addressing strengths and improvement areas with examples from the response...",
  "strengths": ["Specific strength 1 with example", "Specific strength 2 with example", "Specific strength 3 with example"],
  "improvements": ["Specific improvement area 1 with actionable steps", "Specific improvement area 2 with actionable steps"],
  "follow_up_suggested": true,
  "complexity_adjustment": 0,
  "detailed_analysis": {
    "content_depth": "Detailed analysis of knowledge depth and substance with specific examples...",
    "factual_accuracy": "Assessment of factual correctness with specific verification...",
    "perspective_balance": "Evaluation of multiple viewpoints with specific analysis...",
    "practical_application": "Assessment of real-world applicability with specific examples...",
    "communication_quality": "Analysis of language, structure, and presentation quality...",
    "time_management": "Assessment of response appropriateness for time taken..."
  },
  "specific_suggestions": [
    "Read about [specific policy/scheme] and its implementation challenges",
    "Practice structuring answers using the MECE framework",
    "Study recent developments in [specific area] from the candidate's state"
  ],
  "benchmark_comparison": "This response would rank in the [percentile] of UPSC candidates. To reach top 25%, focus on [specific areas]..."
}

CRITICAL INSTRUCTIONS:
- Be rigorous and maintain UPSC interview standards
- Provide specific, actionable feedback with examples
- Reference actual content from the candidate's response
- Give realistic scores based on actual UPSC expectations
- Suggest concrete improvement strategies
- Compare to real UPSC benchmark standards`,
    })

    const evaluation = JSON.parse(text)

    // Validate and ensure all required fields are present
    if (!evaluation.criteria_scores || !evaluation.detailed_analysis) {
      throw new Error("Incomplete evaluation response")
    }

    // Ensure scores are within valid range
    Object.keys(evaluation.criteria_scores).forEach((key) => {
      const score = evaluation.criteria_scores[key]
      if (score < 1 || score > 10) {
        evaluation.criteria_scores[key] = Math.max(1, Math.min(10, score))
      }
    })

    // Ensure overall score is calculated correctly
    const criteriaValues = Object.values(evaluation.criteria_scores) as number[]
    const calculatedOverall = criteriaValues.reduce((sum, score) => sum + score, 0) / criteriaValues.length
    evaluation.overall_score = Number(calculatedOverall.toFixed(1))

    return evaluation
  } catch (error) {
    console.error("AI evaluation error:", error)

    // Enhanced fallback evaluation with more sophisticated analysis
    return generateEnhancedFallbackEvaluation(question, answer, questionType, complexity, userBackground, timeTaken)
  }
}

function generateEnhancedFallbackEvaluation(
  question: string,
  answer: string,
  questionType: string,
  complexity: number,
  userBackground: any,
  timeTaken?: number,
): EvaluationResult {
  const answerLength = answer.length
  const wordCount = answer.split(" ").length
  const hasExamples = /example|instance|case|for instance|such as/i.test(answer)
  const hasPolicy = /policy|scheme|government|ministry|act|bill|constitution/i.test(answer)
  const hasData = /percent|%|crore|lakh|billion|million|\d+/i.test(answer)
  const hasMultiplePerspectives = /however|although|on the other hand|alternatively|but|while/i.test(answer)
  const hasImplementation = /implement|execution|ground level|grassroots|practical|feasible/i.test(answer)
  const hasStakeholders = /stakeholder|citizen|people|community|society|public/i.test(answer)

  // Calculate base score based on multiple factors
  let baseScore = 5.0

  // Length and depth assessment
  if (wordCount > 150) baseScore += 1.0
  else if (wordCount > 100) baseScore += 0.5
  else if (wordCount < 50) baseScore -= 1.0

  // Content quality assessment
  if (hasExamples) baseScore += 0.8
  if (hasPolicy) baseScore += 0.6
  if (hasData) baseScore += 0.4
  if (hasMultiplePerspectives) baseScore += 0.7
  if (hasImplementation) baseScore += 0.5
  if (hasStakeholders) baseScore += 0.3

  // Question type specific adjustments
  switch (questionType) {
    case "current-affairs":
      if (!hasPolicy) baseScore -= 0.5
      if (!hasData) baseScore -= 0.3
      break
    case "ethics":
      if (!hasMultiplePerspectives) baseScore -= 0.7
      if (!hasStakeholders) baseScore -= 0.5
      break
    case "governance":
      if (!hasImplementation) baseScore -= 0.6
      if (!hasStakeholders) baseScore -= 0.4
      break
  }

  // Time management assessment
  if (timeTaken) {
    const timeMinutes = timeTaken / 60
    if (timeMinutes < 1)
      baseScore -= 0.5 // Too rushed
    else if (timeMinutes > 4)
      baseScore -= 0.3 // Too slow
    else if (timeMinutes >= 2 && timeMinutes <= 3) baseScore += 0.2 // Optimal time
  }

  // Complexity adjustment
  const complexityFactor = (complexity - 3) * 0.2
  baseScore += complexityFactor

  // Ensure score is within bounds
  baseScore = Math.max(1, Math.min(10, baseScore))

  const variation = () => (Math.random() - 0.5) * 0.4 // Small random variation

  const criteriaScores = {
    content_knowledge: Number((baseScore + variation()).toFixed(1)),
    clarity_of_thought: Number((baseScore + variation()).toFixed(1)),
    communication_skills: Number((baseScore + variation()).toFixed(1)),
    analytical_ability: Number((baseScore + variation()).toFixed(1)),
    ethical_reasoning: Number((baseScore + variation()).toFixed(1)),
    current_affairs_awareness: Number((baseScore + variation()).toFixed(1)),
    administrative_aptitude: Number((baseScore + variation()).toFixed(1)),
    leadership_potential: Number((baseScore + variation()).toFixed(1)),
  }

  return {
    overall_score: Number(baseScore.toFixed(1)),
    criteria_scores: criteriaScores,
    feedback: generateContextualFeedback(
      answer,
      questionType,
      baseScore,
      hasExamples,
      hasPolicy,
      hasMultiplePerspectives,
    ),
    strengths: generateSpecificStrengths(
      answer,
      questionType,
      hasExamples,
      hasPolicy,
      hasMultiplePerspectives,
      hasImplementation,
    ),
    improvements: generateSpecificImprovements(
      answer,
      questionType,
      baseScore,
      hasExamples,
      hasPolicy,
      hasMultiplePerspectives,
    ),
    follow_up_suggested: baseScore >= 6.5 && Math.random() > 0.3,
    complexity_adjustment: baseScore >= 7.5 ? 1 : baseScore < 5.5 ? -1 : 0,
    detailed_analysis: {
      content_depth: generateContentDepthAnalysis(answer, questionType, wordCount, hasExamples, hasData),
      factual_accuracy: generateFactualAccuracyAnalysis(answer, questionType, hasPolicy, hasData),
      perspective_balance: generatePerspectiveAnalysis(answer, hasMultiplePerspectives, hasStakeholders),
      practical_application: generatePracticalApplicationAnalysis(answer, hasImplementation, hasStakeholders),
      communication_quality: generateCommunicationAnalysis(answer, wordCount, answerLength),
      time_management: generateTimeManagementAnalysis(timeTaken, wordCount),
    },
    specific_suggestions: generateSpecificSuggestions(questionType, userBackground, baseScore),
    benchmark_comparison: generateBenchmarkComparison(baseScore),
  }
}

function generateContextualFeedback(
  answer: string,
  questionType: string,
  score: number,
  hasExamples: boolean,
  hasPolicy: boolean,
  hasMultiplePerspectives: boolean,
): string {
  let feedback = ""

  if (score >= 7.5) {
    feedback = "Strong response demonstrating good understanding and analytical thinking. "
  } else if (score >= 6.0) {
    feedback = "Satisfactory answer with room for improvement in depth and analysis. "
  } else {
    feedback = "Basic response that needs significant enhancement in content and structure. "
  }

  if (!hasExamples && questionType !== "personal") {
    feedback += "Include specific examples or case studies to strengthen your arguments. "
  }

  if (!hasPolicy && (questionType === "current-affairs" || questionType === "governance")) {
    feedback += "Reference relevant government policies, schemes, or recent initiatives. "
  }

  if (!hasMultiplePerspectives && questionType === "ethics") {
    feedback += "Consider multiple stakeholder perspectives and potential conflicts of interest. "
  }

  switch (questionType) {
    case "ethics":
      feedback +=
        "For ethics questions, clearly outline your moral reasoning framework and consider long-term implications."
      break
    case "current-affairs":
      feedback += "Stay updated with recent developments and connect them to broader governance implications."
      break
    case "governance":
      feedback += "Focus on practical implementation challenges and citizen-centric solutions."
      break
    case "personal":
      feedback += "Demonstrate self-reflection and connect your experiences to public service values."
      break
  }

  return feedback
}

function generateSpecificStrengths(
  answer: string,
  questionType: string,
  hasExamples: boolean,
  hasPolicy: boolean,
  hasMultiplePerspectives: boolean,
  hasImplementation: boolean,
): string[] {
  const strengths = []

  if (answer.length > 200) {
    strengths.push("Comprehensive response with adequate detail and depth")
  }

  if (hasExamples) {
    strengths.push("Effective use of examples to illustrate key points")
  }

  if (hasPolicy) {
    strengths.push("Good awareness of relevant policies and government initiatives")
  }

  if (hasMultiplePerspectives) {
    strengths.push("Balanced perspective considering different viewpoints")
  }

  if (hasImplementation) {
    strengths.push("Practical approach with focus on implementation aspects")
  }

  if (/clear|structure|first|second|finally/i.test(answer)) {
    strengths.push("Well-structured response with logical flow")
  }

  if (questionType === "ethics" && /moral|ethical|value|principle/i.test(answer)) {
    strengths.push("Clear ethical reasoning and value-based approach")
  }

  if (strengths.length === 0) {
    strengths.push("Clear communication and relevance to the question")
  }

  return strengths.slice(0, 3)
}

function generateSpecificImprovements(
  answer: string,
  questionType: string,
  score: number,
  hasExamples: boolean,
  hasPolicy: boolean,
  hasMultiplePerspectives: boolean,
): string[] {
  const improvements = []

  if (answer.length < 150) {
    improvements.push("Provide more detailed and comprehensive responses with deeper analysis")
  }

  if (!hasExamples && questionType !== "personal") {
    improvements.push("Include specific examples, case studies, or real-world instances")
  }

  if (!hasPolicy && (questionType === "current-affairs" || questionType === "governance")) {
    improvements.push("Reference relevant government policies, schemes, and recent initiatives")
  }

  if (!hasMultiplePerspectives) {
    improvements.push("Consider multiple perspectives and potential challenges or counterarguments")
  }

  if (score < 6.5) {
    improvements.push("Strengthen factual knowledge and current affairs awareness through regular reading")
  }

  switch (questionType) {
    case "current-affairs":
      if (!/recent|latest|current|2023|2024/i.test(answer)) {
        improvements.push("Include recent developments and their contemporary relevance")
      }
      break
    case "ethics":
      if (!/stakeholder|impact|consequence/i.test(answer)) {
        improvements.push("Analyze impact on all stakeholders and long-term consequences")
      }
      break
    case "governance":
      if (!/citizen|public|service delivery/i.test(answer)) {
        improvements.push("Focus more on citizen-centric governance and service delivery")
      }
      break
  }

  return improvements.slice(0, 2)
}

function generateContentDepthAnalysis(
  answer: string,
  questionType: string,
  wordCount: number,
  hasExamples: boolean,
  hasData: boolean,
): string {
  if (wordCount > 200 && hasExamples && hasData) {
    return "Response demonstrates excellent depth with comprehensive coverage, specific examples, and supporting data. Shows mastery of the subject matter."
  } else if (wordCount > 150 && hasExamples) {
    return "Good depth shown with relevant examples, though could benefit from more specific data and detailed analysis of implications."
  } else if (wordCount > 100) {
    return "Adequate depth but lacks specific examples and detailed analysis. Consider providing more comprehensive coverage with supporting evidence."
  } else {
    return "Response lacks sufficient depth and detail. Needs significant expansion with specific examples, data, and comprehensive analysis."
  }
}

function generateFactualAccuracyAnalysis(
  answer: string,
  questionType: string,
  hasPolicy: boolean,
  hasData: boolean,
): string {
  if (hasPolicy && hasData) {
    return "Response demonstrates good factual awareness with relevant policy references and supporting data."
  } else if (hasPolicy) {
    return "Shows awareness of relevant policies but could benefit from more specific data and statistics."
  } else {
    return "Limited factual content. Include more specific facts, figures, and policy references to strengthen credibility."
  }
}

function generatePerspectiveAnalysis(
  answer: string,
  hasMultiplePerspectives: boolean,
  hasStakeholders: boolean,
): string {
  if (hasMultiplePerspectives && hasStakeholders) {
    return "Excellent balance showing consideration of multiple viewpoints and stakeholder interests."
  } else if (hasMultiplePerspectives) {
    return "Good attempt at balanced perspective, though could explore stakeholder impacts more thoroughly."
  } else {
    return "Response shows limited perspective. Consider multiple viewpoints, potential challenges, and stakeholder interests."
  }
}

function generatePracticalApplicationAnalysis(
  answer: string,
  hasImplementation: boolean,
  hasStakeholders: boolean,
): string {
  if (hasImplementation && hasStakeholders) {
    return "Strong practical orientation with clear implementation focus and stakeholder consideration."
  } else if (hasImplementation) {
    return "Good practical approach but could elaborate more on stakeholder management and ground-level challenges."
  } else {
    return "Limited practical application. Focus more on implementation feasibility, ground realities, and stakeholder management."
  }
}

function generateCommunicationAnalysis(answer: string, wordCount: number, answerLength: number): string {
  const avgWordLength = answerLength / wordCount
  const hasStructure = /first|second|third|finally|conclusion|moreover|furthermore/i.test(answer)

  if (hasStructure && avgWordLength > 4 && wordCount > 150) {
    return "Excellent communication with clear structure, appropriate vocabulary, and professional presentation."
  } else if (hasStructure && wordCount > 100) {
    return "Good communication skills with clear structure, though could enhance vocabulary and depth."
  } else {
    return "Communication needs improvement. Focus on better structure, appropriate vocabulary, and clearer expression."
  }
}

function generateTimeManagementAnalysis(timeTaken?: number, wordCount?: number): string {
  if (!timeTaken) {
    return "Time management assessment not available."
  }

  const timeMinutes = timeTaken / 60
  const wordsPerMinute = wordCount ? wordCount / timeMinutes : 0

  if (timeMinutes >= 2 && timeMinutes <= 3 && wordsPerMinute > 40) {
    return "Excellent time management with optimal response time and good content density."
  } else if (timeMinutes < 1.5) {
    return "Response appears rushed. Take more time to think through and structure your answer comprehensively."
  } else if (timeMinutes > 4) {
    return "Response took longer than optimal. Practice concise yet comprehensive answering within 2-3 minutes."
  } else {
    return "Reasonable time management, though could optimize for better content-to-time ratio."
  }
}

function generateSpecificSuggestions(questionType: string, userBackground: any, score: number): string[] {
  const suggestions = []

  switch (questionType) {
    case "current-affairs":
      suggestions.push("Read The Hindu editorial and PIB daily for current affairs")
      suggestions.push("Follow government press releases and policy announcements")
      if (userBackground.homeState) {
        suggestions.push(`Study recent developments and schemes specific to ${userBackground.homeState}`)
      }
      break
    case "ethics":
      suggestions.push("Study case studies from Ethics, Integrity and Aptitude by Lexicon Publications")
      suggestions.push("Practice ethical dilemma scenarios with stakeholder analysis")
      suggestions.push("Read about constitutional values and Nolan Committee principles")
      break
    case "governance":
      suggestions.push("Study Second Administrative Reforms Commission reports")
      suggestions.push("Read about e-governance initiatives and digital India programs")
      suggestions.push("Understand citizen charter and service delivery mechanisms")
      break
    case "personal":
      suggestions.push("Reflect on experiences and connect them to public service values")
      suggestions.push("Practice STAR method for answering behavioral questions")
      break
  }

  if (score < 6.5) {
    suggestions.push("Practice mock interviews with structured answer framework")
    suggestions.push("Improve general awareness through standard UPSC preparation materials")
  }

  return suggestions.slice(0, 3)
}

function generateBenchmarkComparison(score: number): string {
  if (score >= 8.5) {
    return "This response would rank in the top 10% of UPSC candidates (Rank 1-100 level). Excellent standard maintained."
  } else if (score >= 7.5) {
    return "This response would rank in the top 25% of UPSC candidates (Rank 101-500 level). Very good performance with minor areas for improvement."
  } else if (score >= 6.5) {
    return "This response meets the average successful candidate standard (Rank 501-1000 level). Focus on depth and examples to reach top quartile."
  } else if (score >= 5.5) {
    return "This response is at the minimum selection threshold. Significant improvement needed in content depth and analytical thinking."
  } else {
    return "This response falls below UPSC selection standards. Comprehensive preparation needed across all evaluation criteria."
  }
}

export async function generateFollowUpQuestion(
  originalQuestion: string,
  userAnswer: string,
  questionType: string,
  userBackground: any,
): Promise<string> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a senior UPSC interview board member. Based on the candidate's response, generate a thoughtful follow-up question that probes deeper into their understanding.

ORIGINAL QUESTION: "${originalQuestion}"
CANDIDATE'S ANSWER: "${userAnswer}"
QUESTION TYPE: ${questionType}

CANDIDATE BACKGROUND:
- Optional Subject: ${userBackground.optionalSubject || "Not specified"}
- Home State: ${userBackground.homeState || "Not specified"}
- Educational Background: ${userBackground.educationalBackground || "Not specified"}

FOLLOW-UP GUIDELINES:
1. Probe deeper into their reasoning or knowledge gaps
2. Test practical application of their ideas
3. Explore different dimensions or challenge assumptions
4. Connect to real-world governance scenarios
5. Assess implementation understanding

FOLLOW-UP TYPES TO CONSIDER:
- "Can you elaborate on the practical challenges in implementing [specific point they mentioned]?"
- "How would you address the potential criticism that [counter-argument]?"
- "What role should [specific stakeholder] play in this context?"
- "How does this relate to [recent policy/development]?"
- "What if [scenario change] - how would your approach differ?"

Generate a single, specific follow-up question that would be appropriate for a UPSC interview. The question should be challenging but fair, directly related to their response, and test deeper understanding.

Return only the follow-up question, nothing else.`,
    })

    return text.trim()
  } catch (error) {
    console.error("Follow-up generation error:", error)

    // Enhanced fallback follow-ups based on question type and content analysis
    const answerLower = userAnswer.toLowerCase()

    const fallbacks = {
      ethics: answerLower.includes("stakeholder")
        ? "How would you prioritize competing stakeholder interests when they conflict?"
        : "Can you think of a situation where this ethical principle might conflict with practical administrative needs?",
      "current-affairs": answerLower.includes("policy")
        ? "What challenges do you foresee in the ground-level implementation of this policy?"
        : "How do you think this issue will evolve in the next 5 years, and what role should the government play?",
      governance: answerLower.includes("citizen")
        ? "How would you measure the success of such citizen-centric initiatives?"
        : "What would be the key challenges in implementing this at the district level?",
      personal: answerLower.includes("experience")
        ? "How would you apply the lessons from this experience in your role as a civil servant?"
        : "How has this experience shaped your approach to leadership and decision-making?",
      "optional-subject": "How can insights from your optional subject inform policy-making in this area?",
      default: "Can you elaborate on the practical challenges in implementing this approach?",
    }

    return fallbacks[questionType as keyof typeof fallbacks] || fallbacks.default
  }
}

export async function generateAdaptiveQuestion(
  previousResponses: any[],
  userBackground: any,
  targetComplexity: number,
  focusArea?: string,
): Promise<{
  question: string
  type: string
  complexity: number
  category: string
}> {
  try {
    const responseHistory = previousResponses.slice(-3).map((r) => ({
      question: r.question.text,
      score: r.score,
      type: r.question.type,
      strengths: r.strengths || [],
      weaknesses: r.improvements || [],
      detailedAnalysis: r.detailedAnalysis || {},
    }))

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a UPSC interview board member. Generate a new question based on the candidate's performance pattern and areas needing improvement.

CANDIDATE BACKGROUND:
- Optional Subject: ${userBackground.optionalSubject || "Not specified"}
- Home State: ${userBackground.homeState || "Not specified"}
- Educational Background: ${userBackground.educationalBackground || "Not specified"}
- Current Affairs Level: ${userBackground.currentAffairsLevel || "Not specified"}

RECENT PERFORMANCE ANALYSIS:
${responseHistory
  .map(
    (r, i) => `
Response ${i + 1}: ${r.type} question (Score: ${r.score}/10)
Question: ${r.question}
Key Strengths: ${r.strengths.join(", ")}
Areas for improvement: ${r.weaknesses.join(", ")}
Analysis: ${r.detailedAnalysis.content_depth || "Basic analysis"}
`,
  )
  .join("\n")}

TARGET COMPLEXITY: ${targetComplexity}/5
FOCUS AREA: ${focusArea || "General"}

ADAPTIVE QUESTION STRATEGY:
1. Identify the candidate's weakest area from recent responses
2. Target that area with an appropriate complexity question
3. Avoid repeating similar question types from recent responses
4. Ensure UPSC relevance and contemporary importance
5. Consider their background for personalization

COMPLEXITY GUIDELINES:
- Level 1-2: Basic knowledge and understanding
- Level 3: Application and analysis with examples
- Level 4: Synthesis, evaluation, and complex scenarios
- Level 5: Original thinking, policy formulation, and leadership scenarios

QUESTION CATEGORIES TO CONSIDER:
- current-affairs: Recent developments, policy implications
- ethics: Moral dilemmas, value conflicts, stakeholder management
- governance: Administrative challenges, service delivery, reforms
- personal: Leadership, decision-making, self-awareness
- optional-subject: Subject expertise application to governance
- social-issues: Development challenges, inclusion, justice
- economy: Economic policy, development, fiscal management
- environment: Sustainability, climate change, conservation
- science-tech: Innovation, digital governance, emerging technologies

Generate a question that:
- Addresses identified weak areas from performance history
- Matches the target complexity level
- Is highly relevant to civil services and contemporary governance
- Tests deeper understanding beyond surface knowledge
- Considers their specific background and state context

Return in this exact JSON format:
{
  "question": "Your specific, challenging question here that addresses weak areas",
  "type": "current-affairs|ethics|governance|personal|optional-subject|social-issues|economy|environment|science-tech",
  "complexity": ${targetComplexity},
  "category": "specific category matching the type"
}`,
    })

    const result = JSON.parse(text)
    return result
  } catch (error) {
    console.error("Adaptive question generation error:", error)

    // Enhanced fallback questions based on complexity and focus area
    const fallbackQuestions = {
      3: {
        "current-affairs":
          "What are the key challenges in implementing the Digital India initiative at the grassroots level, and how would you address them?",
        ethics:
          "As a District Collector, you discover that a popular welfare scheme is being misused by influential local leaders. How would you handle this situation?",
        governance:
          "What measures would you suggest to improve transparency and accountability in government decision-making at the district level?",
        default:
          "How can technology be leveraged to improve public service delivery in rural areas while ensuring digital inclusion?",
      },
      4: {
        "current-affairs":
          "Analyze the implications of India's G20 presidency for its foreign policy objectives and domestic development agenda. How should civil servants contribute?",
        ethics:
          "You are posted in a district where a major industrial project promises economic growth but threatens environmental sustainability. How would you balance these competing interests?",
        governance:
          "Design a comprehensive strategy to improve the effectiveness of government schemes at the grassroots level, considering implementation challenges and stakeholder management.",
        default:
          "What are the key challenges facing India's federal structure in the 21st century, and how can administrative reforms address them?",
      },
      5: {
        "current-affairs":
          "Evaluate the long-term implications of climate change on India's agricultural policy and food security strategy. What role should civil servants play in adaptation and mitigation?",
        ethics:
          "Design an ethical framework for AI governance in public administration that balances efficiency, privacy, transparency, and accountability. How would you implement it?",
        governance:
          "If you were tasked with restructuring India's administrative system to meet 21st-century challenges, what would be your key reform priorities and implementation strategy?",
        default:
          "Critically analyze the evolving role of civil services in India's democratic governance and propose a vision for the next decade.",
      },
    }

    const complexityLevel = Math.min(Math.max(targetComplexity, 3), 5) as 3 | 4 | 5
    const questions = fallbackQuestions[complexityLevel]
    const questionText = questions[focusArea as keyof typeof questions] || questions.default

    return {
      question: questionText,
      type: focusArea || "governance",
      complexity: targetComplexity,
      category: focusArea || "governance",
    }
  }
}
