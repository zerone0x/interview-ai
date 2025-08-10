"use client"

import { useState } from "react"
import { extractKeyElements, generateTimeline, type KeyElementsData, type TimelineData } from "@/service/actions"
import type { TranscriptLog } from "@/types/interview"

export function useInterviewAnalysis() {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const [keyElements, setKeyElements] = useState<KeyElementsData | null>(null)
  const [timeline, setTimeline] = useState<TimelineData | null>(null)
  const [transcript, setTranscript] = useState<TranscriptLog | null>(null)

  const [isExtracting, setIsExtracting] = useState(false)
  const [isGeneratingTimeline, setIsGeneratingTimeline] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const PLACEHOLDER_JSON = JSON.stringify(
    {
      interview_log: [{ q: "Interviewer question", a: "Candidate answer" }],
    },
    null,
    2,
  )

  const parseAndSetTranscript = (input: string) => {
    let parsedLog: { interview_log: TranscriptLog }
    try {
      parsedLog = JSON.parse(input)
      if (!parsedLog.interview_log) throw new Error("Missing 'interview_log' key.")
    } catch (e) {
      setError("Invalid JSON format. Please check your input.")
      return false
    }
    setTranscript(parsedLog.interview_log)
    return true
  }

  const runAction = async (action: "extract" | "timeline") => {
    setError(null)
    const ok = parseAndSetTranscript(jsonInput)
    if (!ok) return

    if (action === "extract") {
      setIsExtracting(true)
      const result = await extractKeyElements(jsonInput)
      if (result.error) setError(result.error)
      if (result.data) setKeyElements(result.data)
      setIsExtracting(false)
    } else {
      setIsGeneratingTimeline(true)
      const result = await generateTimeline(jsonInput)
      if (result.error) setError(result.error)
      if (result.data) setTimeline(result.data)
      setIsGeneratingTimeline(false)
    }
  }

  const transcribe = async () => {
    setError(null)
    if (!audioFile) {
      setError("Please select an audio file.")
      return
    }
    setIsTranscribing(true)
    try {
      const form = new FormData()
      form.append("file", audioFile)
      const resp = await fetch("/api/transcribe", { method: "POST", body: form })
      const res = await resp.json()
      if (!resp.ok || res.error) {
        setError(res.error || "Transcription failed.")
      } else if (res.jsonText) {
        setJsonInput(res.jsonText)
        try {
          const parsed = JSON.parse(res.jsonText) as { interview_log: TranscriptLog }
          if (parsed.interview_log) setTranscript(parsed.interview_log)
        } catch {}
      }
    } catch (e) {
      setError("Transcription failed. Please try again.")
    } finally {
      setIsTranscribing(false)
    }
  }

  const reset = () => {
    setError(null)
    setAudioFile(null)
    setJsonInput(PLACEHOLDER_JSON)
    setKeyElements(null)
    setTimeline(null)
    setTranscript(null)
  }

  return {
    state: {
      jsonInput,
      error,
      keyElements,
      timeline,
      transcript,
      isExtracting,
      isGeneratingTimeline,
      isTranscribing,
      audioFile,
    },
    actions: {
      setJsonInput,
      setAudioFile,
      runAction,
      transcribe,
      reset,
    },
  }
} 