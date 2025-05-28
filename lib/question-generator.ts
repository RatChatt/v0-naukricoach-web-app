export interface UPSCQuestion {
  id: string
  text: string
  type: string
  complexity: number
  category: string
  tags: string[]
  state_specific?: boolean
  subject_specific?: boolean
}

export class UPSCQuestionBank {
  private static questions: UPSCQuestion[] = [
    // Personal Background Questions
    {
      id: "personal_001",
      text: "Tell us about yourself and what motivated you to choose civil services.",
      type: "personal",
      complexity: 1,
      category: "personal",
      tags: ["motivation", "background", "career-choice"],
    },
    {
      id: "personal_002",
      text: "How has your educational background prepared you for a career in civil services?",
      type: "personal",
      complexity: 2,
      category: "personal",
      tags: ["education", "preparation", "skills"],
    },
    {
      id: "personal_003",
      text: "What are your hobbies and how do they contribute to your personality development?",
      type: "personal",
      complexity: 2,
      category: "personal",
      tags: ["hobbies", "personality", "development"],
    },

    // Current Affairs Questions
    {
      id: "current_001",
      text: "What is your opinion on the recent changes in India's foreign policy approach?",
      type: "current-affairs",
      complexity: 4,
      category: "international",
      tags: ["foreign-policy", "diplomacy", "international-relations"],
    },
    {
      id: "current_002",
      text: "How do you view the impact of digital transformation on governance in India?",
      type: "current-affairs",
      complexity: 3,
      category: "governance",
      tags: ["digitalization", "e-governance", "technology"],
    },
    {
      id: "current_003",
      text: "What are your thoughts on the recent agricultural reforms and their implications?",
      type: "current-affairs",
      complexity: 4,
      category: "economy",
      tags: ["agriculture", "reforms", "farmers", "policy"],
    },

    // Ethics & Integrity Questions
    {
      id: "ethics_001",
      text: "You are a District Collector and discover that a close friend is involved in corruption. What would you do?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["corruption", "personal-relationships", "duty", "integrity"],
    },
    {
      id: "ethics_002",
      text: "How would you balance development needs with environmental protection in your district?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["environment", "development", "sustainability", "balance"],
    },
    {
      id: "ethics_003",
      text: "What would you do if you received conflicting orders from your immediate superior and a higher authority?",
      type: "ethics",
      complexity: 3,
      category: "ethics",
      tags: ["hierarchy", "conflicting-orders", "decision-making"],
    },

    // Governance & Administration
    {
      id: "governance_001",
      text: "What are the key challenges in implementing government schemes at the grassroots level?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["implementation", "grassroots", "schemes", "challenges"],
    },
    {
      id: "governance_002",
      text: "How can technology be leveraged to improve service delivery in rural areas?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["technology", "rural", "service-delivery", "innovation"],
    },
    {
      id: "governance_003",
      text: "What role should civil servants play in policy formulation versus policy implementation?",
      type: "governance",
      complexity: 4,
      category: "governance",
      tags: ["policy", "formulation", "implementation", "role"],
    },

    // Social Issues
    {
      id: "social_001",
      text: "How would you address gender inequality in your administrative jurisdiction?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["gender", "equality", "women-empowerment", "social-justice"],
    },
    {
      id: "social_002",
      text: "What measures would you suggest to improve the quality of education in government schools?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["education", "quality", "government-schools", "improvement"],
    },
    {
      id: "social_003",
      text: "How can we ensure inclusive development that benefits all sections of society?",
      type: "social-issues",
      complexity: 4,
      category: "social-issues",
      tags: ["inclusive-development", "social-justice", "equality"],
    },

    // Economy & Development
    {
      id: "economy_001",
      text: "What are the key factors driving India's economic growth and what challenges lie ahead?",
      type: "economy",
      complexity: 4,
      category: "economy",
      tags: ["economic-growth", "challenges", "development", "policy"],
    },
    {
      id: "economy_002",
      text: "How can India leverage its demographic dividend for economic development?",
      type: "economy",
      complexity: 4,
      category: "economy",
      tags: ["demographic-dividend", "youth", "employment", "skills"],
    },
    {
      id: "economy_003",
      text: "What role should the government play in promoting entrepreneurship and innovation?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["entrepreneurship", "innovation", "government-role", "startups"],
    },

    // Environment & Ecology
    {
      id: "environment_001",
      text: "How can India balance its development goals with environmental sustainability?",
      type: "environment",
      complexity: 4,
      category: "environment",
      tags: ["sustainability", "development", "environment", "balance"],
    },
    {
      id: "environment_002",
      text: "What measures would you suggest to address air pollution in major cities?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["air-pollution", "cities", "health", "policy"],
    },
    {
      id: "environment_003",
      text: "How can renewable energy adoption be accelerated in India?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["renewable-energy", "climate-change", "policy", "implementation"],
    },

    // Science & Technology
    {
      id: "science_001",
      text: "How can emerging technologies like AI and blockchain be used for better governance?",
      type: "science-tech",
      complexity: 4,
      category: "science-tech",
      tags: ["AI", "blockchain", "governance", "technology"],
    },
    {
      id: "science_002",
      text: "What are the implications of India's space program for national development?",
      type: "science-tech",
      complexity: 3,
      category: "science-tech",
      tags: ["space-program", "ISRO", "development", "technology"],
    },
    {
      id: "science_003",
      text: "How can India become a global leader in research and innovation?",
      type: "science-tech",
      complexity: 4,
      category: "science-tech",
      tags: ["research", "innovation", "global-leadership", "policy"],
    },
  ]

  static getQuestionsByCategory(category: string): UPSCQuestion[] {
    return this.questions.filter((q) => q.category === category)
  }

  static getQuestionsByComplexity(complexity: number): UPSCQuestion[] {
    return this.questions.filter((q) => q.complexity === complexity)
  }

  static getQuestionsByType(type: string): UPSCQuestion[] {
    return this.questions.filter((q) => q.type === type)
  }

  static getRandomQuestion(filters?: {
    category?: string
    complexity?: number
    type?: string
    excludeIds?: string[]
  }): UPSCQuestion | null {
    let filteredQuestions = [...this.questions]

    if (filters?.category) {
      filteredQuestions = filteredQuestions.filter((q) => q.category === filters.category)
    }
    if (filters?.complexity) {
      filteredQuestions = filteredQuestions.filter((q) => q.complexity === filters.complexity)
    }
    if (filters?.type) {
      filteredQuestions = filteredQuestions.filter((q) => q.type === filters.type)
    }
    if (filters?.excludeIds) {
      filteredQuestions = filteredQuestions.filter((q) => !filters.excludeIds!.includes(q.id))
    }

    if (filteredQuestions.length === 0) return null

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
    return filteredQuestions[randomIndex]
  }

  static generateStateSpecificQuestion(state: string, complexity = 3): UPSCQuestion {
    const stateQuestions = {
      delhi: "What are the unique administrative challenges of governing the National Capital Territory of Delhi?",
      maharashtra: "How would you address the urban-rural development gap in Maharashtra?",
      "uttar-pradesh": "What strategies would you employ to improve governance in India's most populous state?",
      bihar: "How can Bihar leverage its human resources for economic development?",
      "west-bengal": "What are the key development priorities for West Bengal in the current scenario?",
      "tamil-nadu": "How can Tamil Nadu maintain its industrial leadership while ensuring sustainable development?",
      karnataka: "What role can Karnataka play in India's technology and innovation ecosystem?",
      gujarat: "How has Gujarat's development model influenced governance practices across India?",
      rajasthan: "What strategies would you suggest for water management and desert development in Rajasthan?",
      kerala: "How can Kerala's human development achievements be replicated in other states?",
    }

    const questionText =
      stateQuestions[state.toLowerCase()] ||
      `What are the major developmental challenges and opportunities in ${state}?`

    return {
      id: `state_${state.toLowerCase()}_001`,
      text: questionText,
      type: "personal",
      complexity,
      category: "personal",
      tags: ["state-specific", state.toLowerCase(), "development", "governance"],
      state_specific: true,
    }
  }

  static generateSubjectSpecificQuestion(subject: string, complexity = 3): UPSCQuestion {
    const subjectQuestions = {
      history: "How does understanding historical patterns help in contemporary governance?",
      geography: "How can geographical knowledge inform policy-making in India?",
      "political-science": "What insights from political science are most relevant for civil servants?",
      economics: "How do economic principles guide administrative decision-making?",
      sociology: "How can sociological understanding improve public service delivery?",
      philosophy: "What role does philosophical thinking play in ethical governance?",
      psychology: "How can psychological insights improve public administration?",
      "public-administration": "What are the emerging trends in public administration globally?",
      anthropology: "How does anthropological knowledge help in understanding diverse communities?",
      law: "How do legal principles guide administrative actions?",
      management: "What management principles are most applicable in government organizations?",
      "medical-science": "How can medical knowledge inform public health policy?",
      engineering: "How can engineering solutions address infrastructure challenges?",
      agriculture: "What role can agricultural science play in rural development?",
    }

    const questionText =
      subjectQuestions[subject.toLowerCase()] ||
      `How does your background in ${subject} contribute to your understanding of public administration?`

    return {
      id: `subject_${subject.toLowerCase()}_001`,
      text: questionText,
      type: "optional-subject",
      complexity,
      category: "optional-subject",
      tags: ["optional-subject", subject.toLowerCase(), "application", "governance"],
      subject_specific: true,
    }
  }

  static getAllQuestions(): UPSCQuestion[] {
    return [...this.questions]
  }

  static searchQuestions(query: string): UPSCQuestion[] {
    const lowercaseQuery = query.toLowerCase()
    return this.questions.filter(
      (q) =>
        q.text.toLowerCase().includes(lowercaseQuery) ||
        q.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
        q.category.toLowerCase().includes(lowercaseQuery),
    )
  }
}
