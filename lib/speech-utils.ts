// Speech recognition and synthesis utilities
export class SpeechManager {
  private recognition: any | null = null // Declare SpeechRecognition variable
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private currentUtterance: SpeechSynthesisUtterance | null = null

  constructor() {
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
  }

  private initializeSpeechRecognition() {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = "en-IN" // Indian English for UPSC context
        this.recognition.maxAlternatives = 1
      }
    }
  }

  private initializeSpeechSynthesis() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  // Speech Recognition Methods
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void,
  ): boolean {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser")
      return false
    }

    if (this.isListening) {
      return false
    }

    this.recognition.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      onResult(finalTranscript || interimTranscript, !!finalTranscript)
    }

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      onError(`Speech recognition error: ${event.error}`)
      this.isListening = false
    }

    this.recognition.onend = () => {
      this.isListening = false
      onEnd()
    }

    this.recognition.onstart = () => {
      this.isListening = true
    }

    try {
      this.recognition.start()
      return true
    } catch (error) {
      onError("Failed to start speech recognition")
      return false
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Speech Synthesis Methods
  speak(
    text: string,
    options: {
      voice?: "male-formal" | "female-professional" | "male-academic" | "female-expert" | "male-experienced"
      rate?: number
      pitch?: number
      volume?: number
    } = {},
    onEnd?: () => void,
    onError?: (error: string) => void,
  ): boolean {
    if (!this.synthesis) {
      onError?.("Speech synthesis not supported in this browser")
      return false
    }

    // Stop any current speech
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)

    // Configure voice based on board member type
    const voices = this.synthesis.getVoices()
    const voiceConfig = this.getVoiceConfig(options.voice || "male-formal")

    // Try to find a suitable voice
    const selectedVoice =
      voices.find(
        (voice) =>
          voice.lang.includes("en") &&
          (voiceConfig.gender === "male"
            ? voice.name.toLowerCase().includes("male")
            : voice.name.toLowerCase().includes("female")),
      ) ||
      voices.find((voice) => voice.lang.includes("en")) ||
      voices[0]

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.rate = options.rate || voiceConfig.rate
    utterance.pitch = options.pitch || voiceConfig.pitch
    utterance.volume = options.volume || 0.8

    utterance.onend = () => {
      this.currentUtterance = null
      onEnd?.()
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      onError?.(`Speech synthesis error: ${event.error}`)
      this.currentUtterance = null
    }

    this.currentUtterance = utterance
    this.synthesis.speak(utterance)
    return true
  }

  private getVoiceConfig(voiceType: string) {
    const configs = {
      "male-formal": { gender: "male", rate: 0.9, pitch: 0.8 },
      "female-professional": { gender: "female", rate: 0.95, pitch: 1.0 },
      "male-academic": { gender: "male", rate: 0.85, pitch: 0.9 },
      "female-expert": { gender: "female", rate: 0.9, pitch: 1.1 },
      "male-experienced": { gender: "male", rate: 0.8, pitch: 0.7 },
    }
    return configs[voiceType as keyof typeof configs] || configs["male-formal"]
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }

  // Utility methods
  isSupported(): { recognition: boolean; synthesis: boolean } {
    return {
      recognition: !!this.recognition,
      synthesis: !!this.synthesis,
    }
  }

  // Get available voices for debugging
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis ? this.synthesis.getVoices() : []
  }
}

// Singleton instance
let speechManager: SpeechManager | null = null

export function getSpeechManager(): SpeechManager {
  if (!speechManager) {
    speechManager = new SpeechManager()
  }
  return speechManager
}

// React hook for speech functionality
export function useSpeech() {
  const speechManager = getSpeechManager()

  return {
    startListening: speechManager.startListening.bind(speechManager),
    stopListening: speechManager.stopListening.bind(speechManager),
    isListening: speechManager.isCurrentlyListening.bind(speechManager),
    speak: speechManager.speak.bind(speechManager),
    stopSpeaking: speechManager.stopSpeaking.bind(speechManager),
    isSpeaking: speechManager.isSpeaking.bind(speechManager),
    isSupported: speechManager.isSupported.bind(speechManager),
    getAvailableVoices: speechManager.getAvailableVoices.bind(speechManager),
  }
}
