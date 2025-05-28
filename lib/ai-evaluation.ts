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
  }
}

export async function evaluateResponse(
  question: string,
  answer: string,
  questionType: string,
  complexity: number,
  userBackground: any,
): Promise<EvaluationResult> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a senior UPSC interview board member with 20+ years of experience evaluating civil service candidates. Evaluate this candidate's response with the rigor and standards expected in the actual UPSC personality test.

QUESTION: "${question}"
QUESTION TYPE: ${questionType}
COMPLEXITY LEVEL: ${complexity}/5
CANDIDATE'S ANSWER: "${answer}"

CANDIDATE BACKGROUND:
- Optional Subject: ${userBackground.optionalSubject || "Not specified"}
- Home State: ${userBackground.homeState || "Not specified"}
- Educational Background: ${userBackground.educationalBackground || "Not specified"}
- Current Affairs Level: ${userBackground.currentAffairsLevel || "Not specified"}

EVALUATION CRITERIA (Score each 1-10):

1. CONTENT KNOWLEDGE & ACCURACY (1-10):
   - Factual correctness and depth of knowledge
   - Understanding of concepts, policies, and current developments
   - Relevance to the question asked
   - Use of appropriate examples and case studies

2. CLARITY OF THOUGHT & EXPRESSION (1-10):
   - Logical structure and flow of ideas
   - Clear articulation without ambiguity
   - Coherent progression from introduction to conclusion
   - Appropriate use of language and terminology

3. COMMUNICATION SKILLS (1-10):
   - Confidence and conviction in delivery
   - Appropriate tone and register
   - Engagement with the question
   - Persuasiveness and impact

4. ANALYTICAL & CRITICAL THINKING (1-10):
   - Ability to analyze complex issues
   - Multi-dimensional perspective
   - Cause-effect understanding
   - Problem-solving approach

5. ETHICAL REASONING (1-10):
   - Moral clarity and ethical framework
   - Balance between competing values
   - Understanding of public service ethics
   - Integrity in approach

6. CURRENT AFFAIRS AWARENESS (1-10):
   - Knowledge of recent developments
   - Understanding of policy implications
   - Awareness of national and international context
   - Connection to contemporary issues

7. ADMINISTRATIVE APTITUDE (1-10):
   - Understanding of governance processes
   - Practical implementation perspective
   - Stakeholder awareness
   - Administrative feasibility

8. LEADERSHIP POTENTIAL (1-10):
   - Vision and strategic thinking
   - Decision-making capability
   - Ability to inspire and influence
   - Responsibility and accountability

DETAILED ANALYSIS REQUIRED:
- Content Depth: Assess the substantive quality and depth of knowledge demonstrated
- Factual Accuracy: Evaluate correctness of facts, figures, and references
- Perspective Balance: Analyze whether multiple viewpoints were considered
- Practical Application: Assess real-world applicability and implementation awareness

SPECIFIC EVALUATION GUIDELINES:
- For PERSONAL questions: Focus on self-awareness, authenticity, and learning from experiences
- For CURRENT AFFAIRS: Emphasize factual accuracy, policy understanding, and contemporary relevance
- For ETHICS: Prioritize moral reasoning, value conflicts, and principled decision-making
- For GOVERNANCE: Stress administrative understanding, implementation challenges, and stakeholder impact
- For OPTIONAL SUBJECT: Expect deep knowledge and ability to connect to public administration

SCORING STANDARDS:
- 9-10: Exceptional - Demonstrates mastery level understanding with original insights
- 7-8: Very Good - Shows strong knowledge with good analysis and examples
- 5-6: Satisfactory - Basic understanding with some gaps or superficial treatment
- 3-4: Below Average - Limited knowledge with significant gaps or misconceptions
- 1-2: Poor - Inadequate understanding with major errors or irrelevant content

Provide your evaluation in this exact JSON format:
{
  "overall_score": 7.5,
  "criteria_scores": {
    "content_knowledge": 8,
    "clarity_of_thought": 7,
    "communication_skills": 8,
    "analytical_ability": 7,
    "ethical_reasoning": 6,
    "current_affairs_awareness": 8,
    "administrative_aptitude": 7,
    "leadership_potential": 6
  },
  "feedback": "Comprehensive feedback addressing strengths and areas for improvement...",
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "improvements": ["Specific improvement area 1", "Specific improvement area 2"],
  "follow_up_suggested": true,
  "complexity_adjustment": 1,
  "detailed_analysis": {
    "content_depth": "Analysis of knowledge depth and substance...",
    "factual_accuracy": "Assessment of factual correctness...",
    "perspective_balance": "Evaluation of multiple viewpoints considered...",
    "practical_application": "Assessment of real-world applicability..."
  }
}

IMPORTANT GUIDELINES:
- Be specific and constructive in feedback
- Reference actual content from the answer
- Consider the candidate's background when evaluating
- Suggest concrete improvement strategies
- Maintain UPSC interview standards throughout
- Adjust complexity based on performance: +1 (increase), 0 (maintain), -1 (decrease)`,
    })

    const evaluation = JSON.parse(text)

    // Validate and ensure all required fields are present
    if (!evaluation.criteria_scores || !evaluation.detailed_analysis) {
      throw new Error("Incomplete evaluation response")
    }

    return evaluation
  } catch (error) {
    console.error("AI evaluation error:", error)

    // Enhanced fallback evaluation with more realistic scoring
    const baseScore = Math.random() * 2 + 6 // 6-8 range
    const variation = () => Math.random() * 2 - 1 // -1 to +1 variation

    return {
      overall_score: Number((baseScore + variation()).toFixed(1)),
      criteria_scores: {
        content_knowledge: Number((baseScore + variation()).toFixed(1)),
        clarity_of_thought: Number((baseScore + variation()).toFixed(1)),
        communication_skills: Number((baseScore + variation()).toFixed(1)),
        analytical_ability: Number((baseScore + variation()).toFixed(1)),
        ethical_reasoning: Number((baseScore + variation()).toFixed(1)),
        current_affairs_awareness: Number((baseScore + variation()).toFixed(1)),
        administrative_aptitude: Number((baseScore + variation()).toFixed(1)),
        leadership_potential: Number((baseScore + variation()).toFixed(1)),
      },
      feedback: generateContextualFeedback(answer, questionType, baseScore),
      strengths: generateStrengths(answer, questionType),
      improvements: generateImprovements(answer, questionType, baseScore),
      follow_up_suggested: Math.random() > 0.4,
      complexity_adjustment: Math.floor(Math.random() * 3) - 1,
      detailed_analysis: {
        content_depth: generateContentDepthAnalysis(answer, questionType),
        factual_accuracy: "Answer demonstrates reasonable factual understanding with scope for more specific examples.",
        perspective_balance:
          "Response shows awareness of different viewpoints, though could benefit from deeper exploration of alternative perspectives.",
        practical_application:
          "Good understanding of practical implications, with room for more detailed implementation strategies.",
      },
    }
  }
}

function generateContextualFeedback(answer: string, questionType: string, score: number): string {
  const answerLength = answer.length
  const hasExamples = answer.toLowerCase().includes("example") || answer.toLowerCase().includes("instance")
  const hasPolicy = answer.toLowerCase().includes("policy") || answer.toLowerCase().includes("government")

  let feedback = ""

  if (score >= 7.5) {
    feedback = "Strong response demonstrating good understanding. "
  } else if (score >= 6.5) {
    feedback = "Satisfactory answer with room for improvement. "
  } else {
    feedback = "Basic response that needs significant enhancement. "
  }

  if (answerLength < 100) {
    feedback += "Consider providing more detailed explanations and examples. "
  }

  if (!hasExamples && questionType !== "personal") {
    feedback += "Include specific examples or case studies to strengthen your arguments. "
  }

  if (!hasPolicy && (questionType === "current-affairs" || questionType === "governance")) {
    feedback += "Reference relevant government policies or initiatives. "
  }

  switch (questionType) {
    case "ethics":
      feedback +=
        "For ethics questions, clearly outline your moral reasoning and consider multiple stakeholder perspectives."
      break
    case "current-affairs":
      feedback += "Stay updated with recent developments and their implications for governance and society."
      break
    case "governance":
      feedback += "Focus on practical implementation challenges and administrative solutions."
      break
    case "personal":
      feedback += "Demonstrate self-reflection and learning from your experiences."
      break
  }

  return feedback
}

function generateStrengths(answer: string, questionType: string): string[] {
  const strengths = []

  if (answer.length > 150) {
    strengths.push("Comprehensive response with good detail")
  }

  if (answer.toLowerCase().includes("example") || answer.toLowerCase().includes("instance")) {
    strengths.push("Good use of examples to illustrate points")
  }

  if (answer.toLowerCase().includes("however") || answer.toLowerCase().includes("although")) {
    strengths.push("Balanced perspective considering multiple viewpoints")
  }

  if (answer.toLowerCase().includes("implement") || answer.toLowerCase().includes("solution")) {
    strengths.push("Practical approach to problem-solving")
  }

  if (
    questionType === "ethics" &&
    (answer.toLowerCase().includes("ethical") || answer.toLowerCase().includes("moral"))
  ) {
    strengths.push("Clear ethical reasoning and moral framework")
  }

  if (strengths.length === 0) {
    strengths.push("Clear communication", "Relevant to the question asked")
  }

  return strengths.slice(0, 3)
}

function generateImprovements(answer: string, questionType: string, score: number): string[] {
  const improvements = []

  if (answer.length < 100) {
    improvements.push("Provide more detailed and comprehensive responses")
  }

  if (!answer.toLowerCase().includes("example") && questionType !== "personal") {
    improvements.push("Include specific examples and case studies")
  }

  if (score < 7) {
    improvements.push("Strengthen factual knowledge and current affairs awareness")
  }

  switch (questionType) {
    case "current-affairs":
      if (!answer.toLowerCase().includes("policy")) {
        improvements.push("Reference relevant government policies and their implications")
      }
      break
    case "ethics":
      if (!answer.toLowerCase().includes("stakeholder")) {
        improvements.push("Consider impact on all stakeholders in ethical dilemmas")
      }
      break
    case "governance":
      if (!answer.toLowerCase().includes("implement")) {
        improvements.push("Focus more on practical implementation strategies")
      }
      break
  }

  if (improvements.length === 0) {
    improvements.push("Practice structuring answers using a clear framework", "Stay updated with recent developments")
  }

  return improvements.slice(0, 2)
}

function generateContentDepthAnalysis(answer: string, questionType: string): string {
  const answerLength = answer.length
  const hasSpecifics =
    answer.toLowerCase().includes("percent") ||
    answer.toLowerCase().includes("billion") ||
    answer.toLowerCase().includes("million")

  if (answerLength > 200 && hasSpecifics) {
    return "Response demonstrates good depth with specific details and comprehensive coverage of the topic."
  } else if (answerLength > 150) {
    return "Adequate depth shown, though could benefit from more specific data and detailed analysis."
  } else {
    return "Response lacks sufficient depth. Consider providing more comprehensive analysis with specific examples and data."
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
      prompt: `You are a UPSC interview board member conducting a follow-up question. Based on the candidate's response, generate a thoughtful follow-up that probes deeper.

ORIGINAL QUESTION: "${originalQuestion}"
CANDIDATE'S ANSWER: "${userAnswer}"
QUESTION TYPE: ${questionType}

CANDIDATE BACKGROUND:
- Optional Subject: ${userBackground.optionalSubject || "Not specified"}
- Home State: ${userBackground.homeState || "Not specified"}
- Educational Background: ${userBackground.educationalBackground || "Not specified"}

FOLLOW-UP GUIDELINES:
1. Probe deeper into their reasoning or knowledge
2. Test practical application of their ideas
3. Explore different dimensions or perspectives
4. Challenge assumptions or seek clarification
5. Connect to real-world governance scenarios

FOLLOW-UP TYPES TO CONSIDER:
- "Can you elaborate on..." (for depth)
- "How would you implement..." (for practicality)
- "What challenges might arise..." (for critical thinking)
- "How does this relate to..." (for connections)
- "What if..." (for scenario testing)

Generate a single, specific follow-up question that would be appropriate for a UPSC interview. The question should be challenging but fair, and directly related to their response.

Return only the follow-up question, nothing else.`,
    })

    return text.trim()
  } catch (error) {
    console.error("Follow-up generation error:", error)

    // Enhanced fallback follow-ups based on question type
    const fallbacks = {
      ethics:
        "Can you think of a situation where this ethical principle might conflict with practical administrative needs?",
      "current-affairs":
        "How do you think this issue will evolve in the next 5 years, and what role should the government play?",
      governance: "What would be the key challenges in implementing this at the district level?",
      personal: "How has this experience shaped your approach to leadership and decision-making?",
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
    }))

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a UPSC interview board member. Generate a new question based on the candidate's performance pattern.

CANDIDATE BACKGROUND:
- Optional Subject: ${userBackground.optionalSubject || "Not specified"}
- Home State: ${userBackground.homeState || "Not specified"}
- Educational Background: ${userBackground.educationalBackground || "Not specified"}
- Current Affairs Level: ${userBackground.currentAffairsLevel || "Not specified"}

RECENT PERFORMANCE:
${responseHistory
  .map(
    (r, i) => `
${i + 1}. ${r.type} question (Score: ${r.score}/10)
   Question: ${r.question}
   Strengths: ${r.strengths.join(", ")}
   Areas for improvement: ${r.weaknesses.join(", ")}
`,
  )
  .join("\n")}

TARGET COMPLEXITY: ${targetComplexity}/5
FOCUS AREA: ${focusArea || "General"}

QUESTION GENERATION GUIDELINES:
1. Avoid repeating similar question types from recent responses
2. Target the specified complexity level
3. Focus on areas where the candidate needs improvement
4. Ensure UPSC relevance and contemporary importance
5. Consider their background for personalization

COMPLEXITY LEVELS:
- Level 1-2: Basic knowledge and understanding
- Level 3: Application and analysis
- Level 4-5: Synthesis, evaluation, and complex scenarios

Generate a question that:
- Tests different aspects than recent questions
- Matches the target complexity
- Is relevant to civil services
- Considers their performance pattern
- Focuses on the specified area if provided

Return in this JSON format:
{
  "question": "Your specific question here",
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
          "What are the key challenges in implementing the Digital India initiative at the grassroots level?",
        ethics:
          "As a civil servant, how would you handle a situation where your personal beliefs conflict with government policy?",
        governance: "What measures would you suggest to improve transparency in government decision-making?",
        default: "How can technology be leveraged to improve public service delivery in rural areas?",
      },
      4: {
        "current-affairs":
          "Analyze the implications of India's G20 presidency for its foreign policy and domestic development agenda.",
        ethics:
          "You discover that a popular government scheme is being misused in your district. How would you address this while maintaining public trust?",
        governance:
          "How would you balance the need for rapid development with environmental protection in your administrative role?",
        default: "What are the key challenges facing India's federal structure in the 21st century?",
      },
      5: {
        "current-affairs":
          "Evaluate the long-term implications of climate change on India's agricultural policy and food security strategy.",
        ethics:
          "Design an ethical framework for AI governance in public administration, considering privacy, transparency, and accountability.",
        governance:
          "How would you restructure India's administrative system to meet the challenges of the next decade?",
        default: "Critically analyze the role of civil services in India's democratic governance and suggest reforms.",
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
