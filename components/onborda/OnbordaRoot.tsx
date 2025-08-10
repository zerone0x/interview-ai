"use client"

import { Onborda, OnbordaProvider } from "onborda"
import type { Tour, Step } from "onborda/dist/types"
import TourCard from "./TourCard"
import { useEffect, useMemo, useState } from "react"

type BaseStep = Pick<Step, "selector" | "title" | "content">

const BASE_STEPS: BaseStep[] = [
  {
    selector: "#tour-hero",
    title: "Overview",
    content: "Analyze interviews: transcribe audio, extract key elements, and build timelines.",
  },
  {
    selector: "#tour-upload-controls",
    title: "Input",
    content: "Upload audio or paste JSON logs, then run actions to process data.",
  },
  {
    selector: "#tour-results",
    title: "Results",
    content: "View timeline, key elements, and transcript once processing completes.",
  },
]

export default function OnbordaRoot({ children }: { children: React.ReactNode }) {
  const [computed, setComputed] = useState<Tour[]>([])

  const computeSide = (el: Element | null): Step["side"] => {
    if (!el || typeof window === "undefined") return "top"
    const rect = el.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const cardWidth = Math.min(420, Math.floor(viewportWidth * 0.9))
    const margin = 25
    const half = Math.floor(cardWidth / 2)

    const centerX = rect.left + rect.width / 2

    if (centerX + half + margin > viewportWidth) return "top-right"
    if (centerX - half - margin < 0) return "top-left"
    return "top"
  }

  const buildTours = () => {
    const steps: Step[] = BASE_STEPS.map((s) => {
      const el = document.querySelector(s.selector)
      return {
        selector: s.selector,
        title: s.title,
        content: s.content,
        icon: null,
        side: computeSide(el),
        pointerPadding: 30,
        pointerRadius: 28,
      }
    })
    const tours: Tour[] = [
      {
        tour: "main",
        steps,
      },
    ]
    return tours
  }

  useEffect(() => {
    setComputed(buildTours())
    const onResize = () => setComputed(buildTours())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const tours = useMemo(() => computed, [computed])

  return (
    <OnbordaProvider>
      <Onborda steps={tours} showOnborda shadowRgb="55,48,163" shadowOpacity="0.5" cardComponent={TourCard}>
        {children}
      </Onborda>
    </OnbordaProvider>
  )
} 