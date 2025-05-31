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
    // Personal Background Questions (Expanded)
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
    {
      id: "personal_004",
      text: "Describe a challenging situation you faced and how you overcame it.",
      type: "personal",
      complexity: 3,
      category: "personal",
      tags: ["challenges", "problem-solving", "resilience"],
    },
    {
      id: "personal_005",
      text: "What are your strengths and weaknesses? How do you plan to address your weaknesses?",
      type: "personal",
      complexity: 2,
      category: "personal",
      tags: ["self-awareness", "improvement", "strengths"],
    },
    {
      id: "personal_006",
      text: "Why do you want to serve the country? What does patriotism mean to you?",
      type: "personal",
      complexity: 3,
      category: "personal",
      tags: ["patriotism", "service", "values"],
    },
    {
      id: "personal_007",
      text: "How do you handle stress and pressure in your daily life?",
      type: "personal",
      complexity: 2,
      category: "personal",
      tags: ["stress-management", "pressure", "coping"],
    },
    {
      id: "personal_008",
      text: "What role has your family played in shaping your career choice?",
      type: "personal",
      complexity: 2,
      category: "personal",
      tags: ["family", "influence", "support"],
    },
    {
      id: "personal_009",
      text: "Describe your leadership experience and leadership style.",
      type: "personal",
      complexity: 3,
      category: "personal",
      tags: ["leadership", "experience", "style"],
    },
    {
      id: "personal_010",
      text: "What books have influenced you the most and why?",
      type: "personal",
      complexity: 2,
      category: "personal",
      tags: ["reading", "influence", "knowledge"],
    },

    // Current Affairs Questions (Significantly Expanded)
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
    {
      id: "current_004",
      text: "How has India's G20 presidency impacted its global standing?",
      type: "current-affairs",
      complexity: 4,
      category: "international",
      tags: ["G20", "global-leadership", "diplomacy"],
    },
    {
      id: "current_005",
      text: "What are the implications of the Russia-Ukraine conflict for India?",
      type: "current-affairs",
      complexity: 4,
      category: "international",
      tags: ["geopolitics", "conflict", "neutrality"],
    },
    {
      id: "current_006",
      text: "How can India achieve its net-zero emissions target by 2070?",
      type: "current-affairs",
      complexity: 4,
      category: "environment",
      tags: ["climate-change", "net-zero", "sustainability"],
    },
    {
      id: "current_007",
      text: "What is your assessment of the Ayushman Bharat scheme's implementation?",
      type: "current-affairs",
      complexity: 3,
      category: "social-issues",
      tags: ["healthcare", "insurance", "implementation"],
    },
    {
      id: "current_008",
      text: "How has the COVID-19 pandemic changed India's healthcare priorities?",
      type: "current-affairs",
      complexity: 3,
      category: "social-issues",
      tags: ["pandemic", "healthcare", "priorities"],
    },
    {
      id: "current_009",
      text: "What are the challenges and opportunities in India-China border management?",
      type: "current-affairs",
      complexity: 4,
      category: "international",
      tags: ["border-security", "china", "diplomacy"],
    },
    {
      id: "current_010",
      text: "How can India leverage its demographic dividend in the post-pandemic world?",
      type: "current-affairs",
      complexity: 4,
      category: "economy",
      tags: ["demographic-dividend", "youth", "employment"],
    },
    {
      id: "current_011",
      text: "What is your opinion on the new National Education Policy 2020?",
      type: "current-affairs",
      complexity: 3,
      category: "social-issues",
      tags: ["education", "policy", "reform"],
    },
    {
      id: "current_012",
      text: "How has the Quad partnership evolved and what are its implications for India?",
      type: "current-affairs",
      complexity: 4,
      category: "international",
      tags: ["quad", "alliance", "indo-pacific"],
    },
    {
      id: "current_013",
      text: "What are the challenges in implementing the Goods and Services Tax (GST)?",
      type: "current-affairs",
      complexity: 3,
      category: "economy",
      tags: ["taxation", "GST", "implementation"],
    },
    {
      id: "current_014",
      text: "How can India address the issue of air pollution in major cities?",
      type: "current-affairs",
      complexity: 3,
      category: "environment",
      tags: ["air-pollution", "cities", "health"],
    },
    {
      id: "current_015",
      text: "What is your view on the recent changes in the IT rules for social media platforms?",
      type: "current-affairs",
      complexity: 3,
      category: "governance",
      tags: ["social-media", "regulation", "IT-rules"],
    },

    // Ethics & Integrity Questions (Expanded)
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
    {
      id: "ethics_004",
      text: "A contractor offers you a bribe to overlook safety violations. How would you handle this situation?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["bribery", "safety", "integrity", "law-enforcement"],
    },
    {
      id: "ethics_005",
      text: "You discover that a government scheme is not reaching its intended beneficiaries due to local political interference. What steps would you take?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["scheme-implementation", "political-interference", "beneficiaries"],
    },
    {
      id: "ethics_006",
      text: "How would you handle a situation where your personal beliefs conflict with your official duties?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["personal-beliefs", "official-duty", "conflict"],
    },
    {
      id: "ethics_007",
      text: "A senior politician pressures you to transfer a honest officer. How would you respond?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["political-pressure", "transfers", "integrity"],
    },
    {
      id: "ethics_008",
      text: "You witness a colleague taking credit for your work. How would you address this?",
      type: "ethics",
      complexity: 3,
      category: "ethics",
      tags: ["workplace-ethics", "credit", "fairness"],
    },
    {
      id: "ethics_009",
      text: "How would you ensure transparency in government procurement processes?",
      type: "ethics",
      complexity: 3,
      category: "ethics",
      tags: ["transparency", "procurement", "accountability"],
    },
    {
      id: "ethics_010",
      text: "What would you do if you found out that relief materials meant for disaster victims are being sold in the market?",
      type: "ethics",
      complexity: 4,
      category: "ethics",
      tags: ["disaster-relief", "corruption", "accountability"],
    },

    // Governance & Administration (Expanded)
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
    {
      id: "governance_004",
      text: "How can citizen participation be enhanced in governance processes?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["citizen-participation", "democracy", "engagement"],
    },
    {
      id: "governance_005",
      text: "What measures would you suggest to improve inter-departmental coordination?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["coordination", "departments", "efficiency"],
    },
    {
      id: "governance_006",
      text: "How can the Right to Information Act be made more effective?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["RTI", "transparency", "information"],
    },
    {
      id: "governance_007",
      text: "What are the challenges in implementing the 73rd and 74th Constitutional Amendments?",
      type: "governance",
      complexity: 4,
      category: "governance",
      tags: ["panchayati-raj", "urban-governance", "decentralization"],
    },
    {
      id: "governance_008",
      text: "How can administrative reforms improve government efficiency?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["administrative-reforms", "efficiency", "modernization"],
    },
    {
      id: "governance_009",
      text: "What role does civil society play in good governance?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["civil-society", "governance", "participation"],
    },
    {
      id: "governance_010",
      text: "How can grievance redressal mechanisms be strengthened?",
      type: "governance",
      complexity: 3,
      category: "governance",
      tags: ["grievance-redressal", "citizen-services", "accountability"],
    },

    // Social Issues (Expanded)
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
    {
      id: "social_004",
      text: "What strategies would you employ to address the issue of child labor?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["child-labor", "children-rights", "enforcement"],
    },
    {
      id: "social_005",
      text: "How can we tackle the problem of malnutrition among children?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["malnutrition", "children", "health", "nutrition"],
    },
    {
      id: "social_006",
      text: "What measures would you take to address the issue of manual scavenging?",
      type: "social-issues",
      complexity: 4,
      category: "social-issues",
      tags: ["manual-scavenging", "dignity", "sanitation"],
    },
    {
      id: "social_007",
      text: "How can we improve healthcare access in rural areas?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["healthcare", "rural", "access", "telemedicine"],
    },
    {
      id: "social_008",
      text: "What role can technology play in bridging the digital divide?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["digital-divide", "technology", "inclusion"],
    },
    {
      id: "social_009",
      text: "How would you address the issue of drug abuse among youth?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["drug-abuse", "youth", "rehabilitation"],
    },
    {
      id: "social_010",
      text: "What measures can be taken to protect the rights of senior citizens?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["senior-citizens", "rights", "care"],
    },
    {
      id: "social_011",
      text: "How can we address the issue of human trafficking?",
      type: "social-issues",
      complexity: 4,
      category: "social-issues",
      tags: ["human-trafficking", "law-enforcement", "rehabilitation"],
    },
    {
      id: "social_012",
      text: "What strategies would you suggest for women's safety in public spaces?",
      type: "social-issues",
      complexity: 3,
      category: "social-issues",
      tags: ["women-safety", "public-spaces", "security"],
    },

    // Economy & Development (Expanded)
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
    {
      id: "economy_004",
      text: "How can India become a $5 trillion economy by 2025?",
      type: "economy",
      complexity: 4,
      category: "economy",
      tags: ["economic-target", "growth", "strategy"],
    },
    {
      id: "economy_005",
      text: "What are the challenges and opportunities in India's manufacturing sector?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["manufacturing", "make-in-india", "industry"],
    },
    {
      id: "economy_006",
      text: "How can financial inclusion be improved in rural areas?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["financial-inclusion", "rural", "banking"],
    },
    {
      id: "economy_007",
      text: "What is your assessment of the impact of demonetization on the Indian economy?",
      type: "economy",
      complexity: 4,
      category: "economy",
      tags: ["demonetization", "impact", "economy"],
    },
    {
      id: "economy_008",
      text: "How can India reduce its dependence on imports and boost exports?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["imports", "exports", "trade-balance"],
    },
    {
      id: "economy_009",
      text: "What measures can be taken to address unemployment in India?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["unemployment", "job-creation", "skills"],
    },
    {
      id: "economy_010",
      text: "How can public-private partnerships be made more effective?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["PPP", "infrastructure", "partnerships"],
    },
    {
      id: "economy_011",
      text: "What role can MSMEs play in India's economic recovery post-COVID?",
      type: "economy",
      complexity: 3,
      category: "economy",
      tags: ["MSME", "recovery", "small-business"],
    },
    {
      id: "economy_012",
      text: "How can India address the issue of income inequality?",
      type: "economy",
      complexity: 4,
      category: "economy",
      tags: ["income-inequality", "distribution", "social-justice"],
    },

    // Environment & Ecology (Expanded)
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
    {
      id: "environment_004",
      text: "What are the challenges in implementing the National Action Plan on Climate Change?",
      type: "environment",
      complexity: 4,
      category: "environment",
      tags: ["climate-change", "NAPCC", "implementation"],
    },
    {
      id: "environment_005",
      text: "How can water conservation be promoted at the community level?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["water-conservation", "community", "awareness"],
    },
    {
      id: "environment_006",
      text: "What measures can be taken to protect India's biodiversity?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["biodiversity", "conservation", "wildlife"],
    },
    {
      id: "environment_007",
      text: "How can solid waste management be improved in urban areas?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["waste-management", "urban", "recycling"],
    },
    {
      id: "environment_008",
      text: "What role can electric vehicles play in reducing pollution?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["electric-vehicles", "pollution", "transportation"],
    },
    {
      id: "environment_009",
      text: "How can deforestation be controlled while meeting development needs?",
      type: "environment",
      complexity: 4,
      category: "environment",
      tags: ["deforestation", "development", "forests"],
    },
    {
      id: "environment_010",
      text: "What strategies can be adopted to address the issue of plastic pollution?",
      type: "environment",
      complexity: 3,
      category: "environment",
      tags: ["plastic-pollution", "ban", "alternatives"],
    },

    // Science & Technology (Expanded)
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
    {
      id: "science_004",
      text: "What role can biotechnology play in addressing India's healthcare challenges?",
      type: "science-tech",
      complexity: 3,
      category: "science-tech",
      tags: ["biotechnology", "healthcare", "innovation"],
    },
    {
      id: "science_005",
      text: "How can cybersecurity be strengthened in the digital age?",
      type: "science-tech",
      complexity: 3,
      category: "science-tech",
      tags: ["cybersecurity", "digital", "protection"],
    },
    {
      id: "science_006",
      text: "What are the ethical implications of genetic engineering and gene editing?",
      type: "science-tech",
      complexity: 4,
      category: "science-tech",
      tags: ["genetic-engineering", "ethics", "CRISPR"],
    },
    {
      id: "science_007",
      text: "How can India leverage quantum computing for national advantage?",
      type: "science-tech",
      complexity: 4,
      category: "science-tech",
      tags: ["quantum-computing", "technology", "advantage"],
    },
    {
      id: "science_008",
      text: "What role can nanotechnology play in solving environmental problems?",
      type: "science-tech",
      complexity: 3,
      category: "science-tech",
      tags: ["nanotechnology", "environment", "solutions"],
    },
    {
      id: "science_009",
      text: "How can 5G technology transform governance and service delivery?",
      type: "science-tech",
      complexity: 3,
      category: "science-tech",
      tags: ["5G", "governance", "connectivity"],
    },
    {
      id: "science_010",
      text: "What are the challenges and opportunities in India's nuclear energy program?",
      type: "science-tech",
      complexity: 4,
      category: "science-tech",
      tags: ["nuclear-energy", "challenges", "opportunities"],
    },

    // International Relations (Expanded)
    {
      id: "international_001",
      text: "How should India navigate its relationship with major powers like the US, China, and Russia?",
      type: "international",
      complexity: 4,
      category: "international",
      tags: ["major-powers", "diplomacy", "balance"],
    },
    {
      id: "international_002",
      text: "What is India's role in the changing global order?",
      type: "international",
      complexity: 4,
      category: "international",
      tags: ["global-order", "role", "leadership"],
    },
    {
      id: "international_003",
      text: "How can India strengthen its ties with African countries?",
      type: "international",
      complexity: 3,
      category: "international",
      tags: ["africa", "cooperation", "development"],
    },
    {
      id: "international_004",
      text: "What are the challenges and opportunities in India's neighborhood policy?",
      type: "international",
      complexity: 4,
      category: "international",
      tags: ["neighborhood", "south-asia", "policy"],
    },
    {
      id: "international_005",
      text: "How can India contribute to global climate action?",
      type: "international",
      complexity: 3,
      category: "international",
      tags: ["climate-action", "global", "leadership"],
    },
    {
      id: "international_006",
      text: "What is India's approach to multilateralism and international organizations?",
      type: "international",
      complexity: 4,
      category: "international",
      tags: ["multilateralism", "UN", "organizations"],
    },
    {
      id: "international_007",
      text: "How can India address cross-border terrorism and security challenges?",
      type: "international",
      complexity: 4,
      category: "international",
      tags: ["terrorism", "security", "cross-border"],
    },
    {
      id: "international_008",
      text: "What role can cultural diplomacy play in India's foreign policy?",
      type: "international",
      complexity: 3,
      category: "international",
      tags: ["cultural-diplomacy", "soft-power", "culture"],
    },
    {
      id: "international_009",
      text: "How can India strengthen its maritime security in the Indian Ocean?",
      type: "international",
      complexity: 4,
      category: "international",
      tags: ["maritime-security", "indian-ocean", "strategy"],
    },
    {
      id: "international_010",
      text: "What are the implications of Brexit for India-UK relations?",
      type: "international",
      complexity: 3,
      category: "international",
      tags: ["brexit", "UK", "trade"],
    },

    // Constitutional & Legal Questions
    {
      id: "constitutional_001",
      text: "What is the significance of the Preamble to the Indian Constitution?",
      type: "constitutional",
      complexity: 3,
      category: "constitutional",
      tags: ["preamble", "constitution", "values"],
    },
    {
      id: "constitutional_002",
      text: "How do you view the balance between individual rights and collective good?",
      type: "constitutional",
      complexity: 4,
      category: "constitutional",
      tags: ["rights", "collective-good", "balance"],
    },
    {
      id: "constitutional_003",
      text: "What role does the judiciary play in protecting constitutional values?",
      type: "constitutional",
      complexity: 3,
      category: "constitutional",
      tags: ["judiciary", "constitution", "protection"],
    },
    {
      id: "constitutional_004",
      text: "How can the federal structure of India be strengthened?",
      type: "constitutional",
      complexity: 4,
      category: "constitutional",
      tags: ["federalism", "center-state", "relations"],
    },
    {
      id: "constitutional_005",
      text: "What is your opinion on the need for electoral reforms in India?",
      type: "constitutional",
      complexity: 3,
      category: "constitutional",
      tags: ["electoral-reforms", "democracy", "elections"],
    },

    // Historical & Cultural Questions
    {
      id: "historical_001",
      text: "How has India's freedom struggle influenced its governance philosophy?",
      type: "historical",
      complexity: 3,
      category: "historical",
      tags: ["freedom-struggle", "governance", "philosophy"],
    },
    {
      id: "historical_002",
      text: "What lessons can modern administrators learn from ancient Indian governance systems?",
      type: "historical",
      complexity: 4,
      category: "historical",
      tags: ["ancient-governance", "lessons", "administration"],
    },
    {
      id: "historical_003",
      text: "How can India's cultural diversity be preserved while promoting national unity?",
      type: "historical",
      complexity: 4,
      category: "historical",
      tags: ["cultural-diversity", "unity", "preservation"],
    },
    {
      id: "historical_004",
      text: "What role do historical monuments play in India's cultural identity?",
      type: "historical",
      complexity: 3,
      category: "historical",
      tags: ["monuments", "cultural-identity", "heritage"],
    },
    {
      id: "historical_005",
      text: "How can traditional knowledge systems contribute to modern development?",
      type: "historical",
      complexity: 3,
      category: "historical",
      tags: ["traditional-knowledge", "development", "integration"],
    },

    // Disaster Management & Security
    {
      id: "disaster_001",
      text: "How can India improve its disaster preparedness and response mechanisms?",
      type: "disaster-management",
      complexity: 3,
      category: "disaster-management",
      tags: ["disaster-preparedness", "response", "mechanisms"],
    },
    {
      id: "disaster_002",
      text: "What role can technology play in early warning systems for natural disasters?",
      type: "disaster-management",
      complexity: 3,
      category: "disaster-management",
      tags: ["technology", "early-warning", "disasters"],
    },
    {
      id: "disaster_003",
      text: "How can community participation be enhanced in disaster management?",
      type: "disaster-management",
      complexity: 3,
      category: "disaster-management",
      tags: ["community-participation", "disaster-management", "awareness"],
    },
    {
      id: "security_001",
      text: "What are the emerging security challenges facing India in the 21st century?",
      type: "security",
      complexity: 4,
      category: "security",
      tags: ["security-challenges", "21st-century", "threats"],
    },
    {
      id: "security_002",
      text: "How can internal security be strengthened without compromising civil liberties?",
      type: "security",
      complexity: 4,
      category: "security",
      tags: ["internal-security", "civil-liberties", "balance"],
    },

    // Agriculture & Rural Development
    {
      id: "agriculture_001",
      text: "How can farmer incomes be doubled while ensuring food security?",
      type: "agriculture",
      complexity: 3,
      category: "agriculture",
      tags: ["farmer-income", "food-security", "agriculture"],
    },
    {
      id: "agriculture_002",
      text: "What role can precision agriculture play in increasing productivity?",
      type: "agriculture",
      complexity: 3,
      category: "agriculture",
      tags: ["precision-agriculture", "productivity", "technology"],
    },
    {
      id: "agriculture_003",
      text: "How can crop insurance schemes be made more effective?",
      type: "agriculture",
      complexity: 3,
      category: "agriculture",
      tags: ["crop-insurance", "effectiveness", "farmers"],
    },
    {
      id: "rural_001",
      text: "What strategies can be adopted to prevent rural-urban migration?",
      type: "rural-development",
      complexity: 3,
      category: "rural-development",
      tags: ["rural-urban-migration", "strategies", "development"],
    },
    {
      id: "rural_002",
      text: "How can rural infrastructure be improved to support economic growth?",
      type: "rural-development",
      complexity: 3,
      category: "rural-development",
      tags: ["rural-infrastructure", "economic-growth", "development"],
    },

    // Urban Development & Smart Cities
    {
      id: "urban_001",
      text: "What are the key challenges in implementing the Smart Cities Mission?",
      type: "urban-development",
      complexity: 3,
      category: "urban-development",
      tags: ["smart-cities", "challenges", "implementation"],
    },
    {
      id: "urban_002",
      text: "How can urban planning be made more sustainable and inclusive?",
      type: "urban-development",
      complexity: 3,
      category: "urban-development",
      tags: ["urban-planning", "sustainable", "inclusive"],
    },
    {
      id: "urban_003",
      text: "What measures can be taken to address the housing shortage in cities?",
      type: "urban-development",
      complexity: 3,
      category: "urban-development",
      tags: ["housing-shortage", "cities", "affordable-housing"],
    },
    {
      id: "urban_004",
      text: "How can public transportation systems be improved in Indian cities?",
      type: "urban-development",
      complexity: 3,
      category: "urban-development",
      tags: ["public-transportation", "cities", "mobility"],
    },

    // Health & Nutrition
    {
      id: "health_001",
      text: "How can India achieve universal health coverage?",
      type: "health",
      complexity: 3,
      category: "health",
      tags: ["universal-health-coverage", "healthcare", "access"],
    },
    {
      id: "health_002",
      text: "What strategies can be adopted to address the burden of non-communicable diseases?",
      type: "health",
      complexity: 3,
      category: "health",
      tags: ["non-communicable-diseases", "prevention", "healthcare"],
    },
    {
      id: "health_003",
      text: "How can mental health awareness be improved in India?",
      type: "health",
      complexity: 3,
      category: "health",
      tags: ["mental-health", "awareness", "stigma"],
    },
    {
      id: "health_004",
      text: "What role can AYUSH systems play in India's healthcare delivery?",
      type: "health",
      complexity: 3,
      category: "health",
      tags: ["AYUSH", "traditional-medicine", "integration"],
    },

    // Media & Communication
    {
      id: "media_001",
      text: "What is the role of media in a democracy and how can media ethics be ensured?",
      type: "media",
      complexity: 3,
      category: "media",
      tags: ["media", "democracy", "ethics"],
    },
    {
      id: "media_002",
      text: "How can fake news and misinformation be combated effectively?",
      type: "media",
      complexity: 3,
      category: "media",
      tags: ["fake-news", "misinformation", "fact-checking"],
    },
    {
      id: "media_003",
      text: "What is the impact of social media on public discourse and democracy?",
      type: "media",
      complexity: 4,
      category: "media",
      tags: ["social-media", "public-discourse", "democracy"],
    },

    // Sports & Youth Development
    {
      id: "sports_001",
      text: "How can India improve its performance in international sports competitions?",
      type: "sports",
      complexity: 3,
      category: "sports",
      tags: ["sports", "international", "performance"],
    },
    {
      id: "sports_002",
      text: "What role can sports play in youth development and nation building?",
      type: "sports",
      complexity: 3,
      category: "sports",
      tags: ["sports", "youth-development", "nation-building"],
    },
    {
      id: "youth_001",
      text: "How can youth be engaged more effectively in governance and policy-making?",
      type: "youth",
      complexity: 3,
      category: "youth",
      tags: ["youth-engagement", "governance", "participation"],
    },
    {
      id: "youth_002",
      text: "What strategies can address the issue of youth unemployment in India?",
      type: "youth",
      complexity: 3,
      category: "youth",
      tags: ["youth-unemployment", "skills", "employment"],
    },
    // Add these questions to the existing questions array

    // BASIC LEVEL QUESTIONS (Complexity 1)
    {
      id: "basic_001",
      text: "What is the role of a civil servant in a democracy?",
      type: "basic-concepts",
      complexity: 1,
      category: "governance",
      tags: ["civil-service", "democracy", "role", "basic"],
    },
    {
      id: "basic_002",
      text: "Name three fundamental rights guaranteed by the Indian Constitution.",
      type: "basic-concepts",
      complexity: 1,
      category: "constitutional",
      tags: ["fundamental-rights", "constitution", "basic"],
    },
    {
      id: "basic_003",
      text: "What is the difference between a state and a union territory?",
      type: "basic-concepts",
      complexity: 1,
      category: "constitutional",
      tags: ["state", "union-territory", "basic", "polity"],
    },
    {
      id: "basic_004",
      text: "Who is the head of the Indian government?",
      type: "basic-concepts",
      complexity: 1,
      category: "governance",
      tags: ["prime-minister", "government", "basic"],
    },
    {
      id: "basic_005",
      text: "What does GDP stand for and why is it important?",
      type: "basic-concepts",
      complexity: 1,
      category: "economy",
      tags: ["GDP", "economy", "basic", "measurement"],
    },
    {
      id: "basic_006",
      text: "Name the three pillars of sustainable development.",
      type: "basic-concepts",
      complexity: 1,
      category: "environment",
      tags: ["sustainable-development", "environment", "basic"],
    },
    {
      id: "basic_007",
      text: "What is the full form of RTI and what is its purpose?",
      type: "basic-concepts",
      complexity: 1,
      category: "governance",
      tags: ["RTI", "transparency", "basic"],
    },
    {
      id: "basic_008",
      text: "Who appoints the Chief Justice of India?",
      type: "basic-concepts",
      complexity: 1,
      category: "constitutional",
      tags: ["chief-justice", "appointment", "basic"],
    },
    {
      id: "basic_009",
      text: "What is the minimum age to become a member of Lok Sabha?",
      type: "basic-concepts",
      complexity: 1,
      category: "constitutional",
      tags: ["lok-sabha", "age-limit", "basic"],
    },
    {
      id: "basic_010",
      text: "Name any two UN Sustainable Development Goals.",
      type: "basic-concepts",
      complexity: 1,
      category: "international",
      tags: ["SDG", "UN", "basic", "development"],
    },

    // EASY LEVEL QUESTIONS (Complexity 2)
    {
      id: "easy_001",
      text: "Explain the concept of separation of powers in the Indian context.",
      type: "conceptual",
      complexity: 2,
      category: "constitutional",
      tags: ["separation-of-powers", "constitution", "easy"],
    },
    {
      id: "easy_002",
      text: "What are the main sources of revenue for the Indian government?",
      type: "conceptual",
      complexity: 2,
      category: "economy",
      tags: ["revenue", "taxation", "government", "easy"],
    },
    {
      id: "easy_003",
      text: "Describe the structure of the Indian Parliament.",
      type: "conceptual",
      complexity: 2,
      category: "constitutional",
      tags: ["parliament", "structure", "easy"],
    },
    {
      id: "easy_004",
      text: "What is the difference between direct and indirect taxes? Give examples.",
      type: "conceptual",
      complexity: 2,
      category: "economy",
      tags: ["taxation", "direct-tax", "indirect-tax", "easy"],
    },
    {
      id: "easy_005",
      text: "Explain the concept of federalism as adopted in India.",
      type: "conceptual",
      complexity: 2,
      category: "constitutional",
      tags: ["federalism", "constitution", "easy"],
    },
    {
      id: "easy_006",
      text: "What are the main functions of the Election Commission of India?",
      type: "conceptual",
      complexity: 2,
      category: "governance",
      tags: ["election-commission", "functions", "easy"],
    },
    {
      id: "easy_007",
      text: "Describe the process of how a bill becomes a law in India.",
      type: "conceptual",
      complexity: 2,
      category: "constitutional",
      tags: ["bill", "law", "process", "easy"],
    },
    {
      id: "easy_008",
      text: "What is the role of the Comptroller and Auditor General (CAG)?",
      type: "conceptual",
      complexity: 2,
      category: "governance",
      tags: ["CAG", "audit", "accountability", "easy"],
    },
    {
      id: "easy_009",
      text: "Explain the concept of judicial review in the Indian Constitution.",
      type: "conceptual",
      complexity: 2,
      category: "constitutional",
      tags: ["judicial-review", "constitution", "easy"],
    },
    {
      id: "easy_010",
      text: "What are the main objectives of the Panchayati Raj system?",
      type: "conceptual",
      complexity: 2,
      category: "governance",
      tags: ["panchayati-raj", "objectives", "easy"],
    },

    // MODERATE LEVEL QUESTIONS (Complexity 3) - Additional ones
    {
      id: "moderate_001",
      text: "Analyze the impact of coalition politics on governance in India.",
      type: "analytical",
      complexity: 3,
      category: "governance",
      tags: ["coalition-politics", "governance", "moderate", "analysis"],
    },
    {
      id: "moderate_002",
      text: "Discuss the challenges and opportunities of India's demographic transition.",
      type: "analytical",
      complexity: 3,
      category: "social-issues",
      tags: ["demographic-transition", "challenges", "moderate"],
    },
    {
      id: "moderate_003",
      text: "Evaluate the effectiveness of India's poverty alleviation programs.",
      type: "analytical",
      complexity: 3,
      category: "social-issues",
      tags: ["poverty-alleviation", "effectiveness", "moderate"],
    },
    {
      id: "moderate_004",
      text: "How can India balance economic growth with environmental sustainability?",
      type: "analytical",
      complexity: 3,
      category: "environment",
      tags: ["economic-growth", "sustainability", "balance", "moderate"],
    },
    {
      id: "moderate_005",
      text: "Assess the role of civil society in strengthening democracy in India.",
      type: "analytical",
      complexity: 3,
      category: "governance",
      tags: ["civil-society", "democracy", "moderate"],
    },
    {
      id: "moderate_006",
      text: "What are the implications of artificial intelligence for employment in India?",
      type: "analytical",
      complexity: 3,
      category: "science-tech",
      tags: ["artificial-intelligence", "employment", "moderate"],
    },
    {
      id: "moderate_007",
      text: "Analyze the impact of globalization on Indian agriculture.",
      type: "analytical",
      complexity: 3,
      category: "agriculture",
      tags: ["globalization", "agriculture", "impact", "moderate"],
    },
    {
      id: "moderate_008",
      text: "Discuss the challenges in implementing the Right to Education Act.",
      type: "analytical",
      complexity: 3,
      category: "social-issues",
      tags: ["right-to-education", "implementation", "moderate"],
    },
    {
      id: "moderate_009",
      text: "How can India improve its ranking in the Ease of Doing Business index?",
      type: "analytical",
      complexity: 3,
      category: "economy",
      tags: ["ease-of-doing-business", "ranking", "moderate"],
    },
    {
      id: "moderate_010",
      text: "Evaluate the impact of social media on political discourse in India.",
      type: "analytical",
      complexity: 3,
      category: "media",
      tags: ["social-media", "political-discourse", "moderate"],
    },

    // CHALLENGING LEVEL QUESTIONS (Complexity 4) - Additional ones
    {
      id: "challenging_001",
      text: "You are a District Magistrate during a communal riot. The local police seem biased, political leaders are pressuring you, and media is sensationalizing the issue. How would you handle this complex situation while maintaining law and order?",
      type: "scenario-based",
      complexity: 4,
      category: "ethics",
      tags: ["communal-riot", "law-and-order", "pressure", "challenging"],
    },
    {
      id: "challenging_002",
      text: "Critically analyze India's approach to climate change mitigation and adaptation in the context of its development needs and international commitments.",
      type: "critical-analysis",
      complexity: 4,
      category: "environment",
      tags: ["climate-change", "development", "international-commitments", "challenging"],
    },
    {
      id: "challenging_003",
      text: "As a civil servant, how would you design and implement a policy to address the issue of stubble burning while ensuring farmer welfare and air quality improvement?",
      type: "policy-design",
      complexity: 4,
      category: "environment",
      tags: ["stubble-burning", "policy-design", "farmer-welfare", "challenging"],
    },
    {
      id: "challenging_004",
      text: "Examine the paradox of India being a major IT exporter while having low digital literacy. How can this digital divide be bridged?",
      type: "critical-analysis",
      complexity: 4,
      category: "science-tech",
      tags: ["digital-divide", "IT-export", "digital-literacy", "challenging"],
    },
    {
      id: "challenging_005",
      text: "You discover that a major infrastructure project in your district, which has already consumed 70% of its budget, has serious environmental violations. The project provides employment to thousands. What would be your course of action?",
      type: "scenario-based",
      complexity: 4,
      category: "ethics",
      tags: ["infrastructure", "environmental-violations", "employment", "challenging"],
    },
    {
      id: "challenging_006",
      text: "Analyze the implications of India's changing demographic profile on its economic growth, social security systems, and political representation.",
      type: "critical-analysis",
      complexity: 4,
      category: "social-issues",
      tags: ["demographic-change", "economic-growth", "social-security", "challenging"],
    },
    {
      id: "challenging_007",
      text: "How should India navigate the competing demands of data localization, digital sovereignty, and international trade in the digital economy?",
      type: "policy-analysis",
      complexity: 4,
      category: "science-tech",
      tags: ["data-localization", "digital-sovereignty", "trade", "challenging"],
    },
    {
      id: "challenging_008",
      text: "As a senior bureaucrat, you are asked to design a comprehensive strategy to make India a $5 trillion economy while ensuring inclusive growth. What would be your approach?",
      type: "strategic-planning",
      complexity: 4,
      category: "economy",
      tags: ["economic-strategy", "inclusive-growth", "5-trillion-economy", "challenging"],
    },
    {
      id: "challenging_009",
      text: "Critically evaluate India's foreign policy approach in the context of rising US-China tensions and its implications for India's strategic autonomy.",
      type: "critical-analysis",
      complexity: 4,
      category: "international",
      tags: ["foreign-policy", "US-China-tensions", "strategic-autonomy", "challenging"],
    },
    {
      id: "challenging_010",
      text: "You are heading a task force to reform the criminal justice system. What comprehensive reforms would you suggest to ensure speedy justice while maintaining due process?",
      type: "reform-design",
      complexity: 4,
      category: "governance",
      tags: ["criminal-justice", "reform", "speedy-justice", "challenging"],
    },

    // ADVANCED LEVEL QUESTIONS (Complexity 5)
    {
      id: "advanced_001",
      text: "Design a comprehensive framework for India to become a global leader in sustainable development while maintaining its growth trajectory, considering geopolitical constraints, technological disruptions, and social equity imperatives.",
      type: "strategic-framework",
      complexity: 5,
      category: "governance",
      tags: ["sustainable-development", "global-leadership", "framework", "advanced"],
    },
    {
      id: "advanced_002",
      text: "You are the Cabinet Secretary during a major national crisis involving simultaneous natural disasters, cyber attacks on critical infrastructure, and social unrest. Develop a comprehensive crisis management strategy.",
      type: "crisis-management",
      complexity: 5,
      category: "security",
      tags: ["crisis-management", "national-security", "multi-crisis", "advanced"],
    },
    {
      id: "advanced_003",
      text: "Conceptualize and design a new governance model for India that leverages emerging technologies (AI, blockchain, IoT) while ensuring democratic values, privacy rights, and inclusive participation.",
      type: "governance-innovation",
      complexity: 5,
      category: "governance",
      tags: ["governance-model", "emerging-technologies", "democracy", "advanced"],
    },
    {
      id: "advanced_004",
      text: "As India's chief negotiator, develop a comprehensive strategy for climate negotiations that balances India's development needs, global climate goals, and emerging geopolitical realities.",
      type: "negotiation-strategy",
      complexity: 5,
      category: "international",
      tags: ["climate-negotiations", "development-needs", "geopolitics", "advanced"],
    },
    {
      id: "advanced_005",
      text: "Design a transformative education policy that prepares India for the Fourth Industrial Revolution while preserving cultural values and ensuring equitable access across diverse socio-economic backgrounds.",
      type: "policy-transformation",
      complexity: 5,
      category: "social-issues",
      tags: ["education-policy", "fourth-industrial-revolution", "cultural-values", "advanced"],
    },
    {
      id: "advanced_006",
      text: "You are tasked with creating a new economic model for India that reduces inequality, promotes innovation, ensures environmental sustainability, and maintains competitiveness in the global economy. Outline your comprehensive approach.",
      type: "economic-modeling",
      complexity: 5,
      category: "economy",
      tags: ["economic-model", "inequality", "innovation", "sustainability", "advanced"],
    },
    {
      id: "advanced_007",
      text: "Develop a comprehensive strategy for India to become a global manufacturing hub while addressing concerns about labor rights, environmental impact, and technological disruption.",
      type: "strategic-development",
      complexity: 5,
      category: "economy",
      tags: ["manufacturing-hub", "labor-rights", "environment", "technology", "advanced"],
    },
    {
      id: "advanced_008",
      text: "As the head of a constitutional reform commission, what fundamental changes would you recommend to strengthen Indian democracy for the 21st century while preserving its core values?",
      type: "constitutional-reform",
      complexity: 5,
      category: "constitutional",
      tags: ["constitutional-reform", "democracy", "21st-century", "advanced"],
    },
    {
      id: "advanced_009",
      text: "Design a comprehensive national security doctrine that addresses traditional threats, cyber warfare, climate security, and economic security in an interconnected world.",
      type: "doctrine-development",
      complexity: 5,
      category: "security",
      tags: ["national-security", "doctrine", "cyber-warfare", "climate-security", "advanced"],
    },
    {
      id: "advanced_010",
      text: "You are leading India's preparation for the next pandemic. Develop a comprehensive framework that integrates health systems, economic resilience, social protection, and international cooperation.",
      type: "preparedness-framework",
      complexity: 5,
      category: "health",
      tags: ["pandemic-preparedness", "health-systems", "economic-resilience", "advanced"],
    },

    // SCENARIO-BASED QUESTIONS (Mixed Complexity)
    {
      id: "scenario_001",
      text: "You are a Sub-Collector in a drought-affected district. The central government has allocated emergency funds, but the local MLA wants to divert some funds for a festival celebration. How do you handle this situation?",
      type: "scenario-based",
      complexity: 3,
      category: "ethics",
      tags: ["drought", "emergency-funds", "political-pressure", "scenario"],
    },
    {
      id: "scenario_002",
      text: "As a District Collector, you receive reports of child marriages in remote villages. The local community leaders resist intervention citing cultural traditions. What steps would you take?",
      type: "scenario-based",
      complexity: 4,
      category: "social-issues",
      tags: ["child-marriage", "cultural-traditions", "intervention", "scenario"],
    },
    {
      id: "scenario_003",
      text: "You are posted as a Collector in a mining district where illegal mining is rampant. The mining mafia has political connections and threatens violence. How would you address this issue?",
      type: "scenario-based",
      complexity: 4,
      category: "ethics",
      tags: ["illegal-mining", "political-connections", "threats", "scenario"],
    },
    {
      id: "scenario_004",
      text: "During your tenure as a Municipal Commissioner, you discover that the city's waste management contractor is dumping waste in a nearby river. The contractor has close ties with local politicians. What action would you take?",
      type: "scenario-based",
      complexity: 3,
      category: "environment",
      tags: ["waste-management", "pollution", "political-ties", "scenario"],
    },
    {
      id: "scenario_005",
      text: "You are a District Magistrate when a major industrial accident occurs, causing environmental damage and casualties. The company offers a large compensation to suppress the matter. How do you proceed?",
      type: "scenario-based",
      complexity: 4,
      category: "ethics",
      tags: ["industrial-accident", "compensation", "cover-up", "scenario"],
    },

    // CURRENT AFFAIRS QUESTIONS (Mixed Complexity)
    {
      id: "current_016",
      text: "What is your assessment of India's Unified Payments Interface (UPI) and its global expansion?",
      type: "current-affairs",
      complexity: 3,
      category: "science-tech",
      tags: ["UPI", "digital-payments", "global-expansion"],
    },
    {
      id: "current_017",
      text: "How has the Production Linked Incentive (PLI) scheme impacted India's manufacturing sector?",
      type: "current-affairs",
      complexity: 3,
      category: "economy",
      tags: ["PLI-scheme", "manufacturing", "incentives"],
    },
    {
      id: "current_018",
      text: "Analyze the implications of the new National Education Policy 2020 on higher education in India.",
      type: "current-affairs",
      complexity: 4,
      category: "social-issues",
      tags: ["NEP-2020", "higher-education", "reform"],
    },
    {
      id: "current_019",
      text: "What are the challenges and opportunities in implementing the Ayushman Bharat Digital Mission?",
      type: "current-affairs",
      complexity: 3,
      category: "health",
      tags: ["ayushman-bharat", "digital-health", "implementation"],
    },
    {
      id: "current_020",
      text: "How can India's semiconductor mission contribute to technological self-reliance?",
      type: "current-affairs",
      complexity: 4,
      category: "science-tech",
      tags: ["semiconductor", "self-reliance", "technology"],
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
      "andhra-pradesh": "How would you address the challenges of bifurcation and development in Andhra Pradesh?",
      "arunachal-pradesh": "What strategies would you employ for border security and development in Arunachal Pradesh?",
      assam: "How can Assam address the challenges of illegal immigration and ethnic conflicts?",
      bihar: "How can Bihar leverage its human resources for economic development?",
      chhattisgarh: "What measures would you take to address Naxalism while ensuring development in Chhattisgarh?",
      delhi: "What are the unique administrative challenges of governing the National Capital Territory of Delhi?",
      goa: "How can Goa balance tourism development with environmental conservation?",
      gujarat: "How has Gujarat's development model influenced governance practices across India?",
      haryana: "What strategies would you suggest for agricultural diversification in Haryana?",
      "himachal-pradesh": "How can Himachal Pradesh leverage its natural resources for sustainable development?",
      jharkhand: "What measures would you take to address tribal welfare and mineral resource management in Jharkhand?",
      karnataka: "What role can Karnataka play in India's technology and innovation ecosystem?",
      kerala: "How can Kerala's human development achievements be replicated in other states?",
      "madhya-pradesh": "How would you address the challenges of tribal development in Madhya Pradesh?",
      maharashtra: "How would you address the urban-rural development gap in Maharashtra?",
      manipur: "What strategies would you employ to address insurgency and development challenges in Manipur?",
      meghalaya: "How can Meghalaya address the challenges of coal mining and environmental protection?",
      mizoram: "What measures would you take for border management and development in Mizoram?",
      nagaland: "How would you address the unique cultural and political challenges in Nagaland?",
      odisha: "What strategies would you suggest for disaster management and industrial development in Odisha?",
      punjab: "How can Punjab address the challenges of drug abuse and agricultural sustainability?",
      rajasthan: "What strategies would you suggest for water management and desert development in Rajasthan?",
      sikkim: "How can Sikkim maintain its organic farming status while ensuring food security?",
      "tamil-nadu": "How can Tamil Nadu maintain its industrial leadership while ensuring sustainable development?",
      telangana: "What are the key development priorities for the newly formed state of Telangana?",
      tripura: "How would you address the challenges of connectivity and development in Tripura?",
      "uttar-pradesh": "What strategies would you employ to improve governance in India's most populous state?",
      uttarakhand: "How can Uttarakhand balance environmental conservation with development needs?",
      "west-bengal": "What are the key development priorities for West Bengal in the current scenario?",
      "jammu-kashmir": "How would you address the unique challenges of governance in Jammu and Kashmir?",
      ladakh: "What strategies would you employ for development and border security in Ladakh?",
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
      history: "How does understanding historical patterns help in contemporary governance and policy-making?",
      geography: "How can geographical knowledge inform climate change adaptation and disaster management policies?",
      "political-science":
        "What insights from political science are most relevant for effective public administration?",
      economics: "How do economic principles guide administrative decision-making in resource allocation?",
      sociology: "How can sociological understanding improve public service delivery and social cohesion?",
      philosophy: "What role does philosophical thinking play in ethical governance and moral leadership?",
      psychology: "How can psychological insights improve public administration and citizen engagement?",
      "public-administration":
        "What are the emerging trends in public administration globally and their relevance to India?",
      anthropology:
        "How does anthropological knowledge help in understanding diverse communities and cultural sensitivity?",
      law: "How do legal principles guide administrative actions and ensure constitutional compliance?",
      management: "What management principles are most applicable in government organizations and public sector?",
      "medical-science": "How can medical knowledge inform public health policy and healthcare administration?",
      engineering: "How can engineering solutions address infrastructure challenges and smart city development?",
      agriculture: "What role can agricultural science play in rural development and food security?",
      mathematics: "How can mathematical and statistical knowledge improve data-driven governance?",
      physics: "How can physics principles contribute to energy policy and technological advancement?",
      chemistry: "How can chemistry knowledge inform environmental policy and industrial regulation?",
      botany: "How can botanical knowledge contribute to biodiversity conservation and sustainable development?",
      zoology: "How can zoological understanding inform wildlife conservation and ecosystem management?",
      geology: "How can geological knowledge inform disaster management and natural resource policy?",
      literature: "How does literature contribute to cultural understanding and soft power diplomacy?",
      "international-relations": "How can international relations theory guide India's foreign policy decisions?",
      commerce: "How can commercial knowledge improve government financial management and trade policy?",
      statistics: "How can statistical analysis improve evidence-based policy making and program evaluation?",
    }

    const questionText =
      subjectQuestions[subject.toLowerCase()] ||
      `How does your background in ${subject} contribute to your understanding of public administration and governance?`

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

  static getQuestionsByTag(tag: string): UPSCQuestion[] {
    return this.questions.filter((q) => q.tags.includes(tag.toLowerCase()))
  }

  static getRandomQuestionSet(
    count: number,
    filters?: {
      category?: string
      complexity?: number
      type?: string
    },
  ): UPSCQuestion[] {
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

    // Shuffle and return requested count
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  static getQuestionStats() {
    const stats = {
      total: this.questions.length,
      byCategory: {} as Record<string, number>,
      byComplexity: {} as Record<number, number>,
      byType: {} as Record<string, number>,
    }

    this.questions.forEach((q) => {
      // Count by category
      stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1

      // Count by complexity
      stats.byComplexity[q.complexity] = (stats.byComplexity[q.complexity] || 0) + 1

      // Count by type
      stats.byType[q.type] = (stats.byType[q.type] || 0) + 1
    })

    return stats
  }
}
