"use client"

import type { CardComponentProps } from "onborda"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TourCard({ step, currentStep, totalSteps, nextStep, prevStep, arrow }: CardComponentProps) {
  return (
    <Card className="relative w-[min(420px,90vw)] max-w-[min(420px,90vw)] rounded-xl border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 shadow-xl">
      <div className="absolute -top-3 left-6 text-muted-foreground">
        <span className="text-xs">{currentStep + 1} / {totalSteps}</span>
      </div>
      <div className="p-5 max-h-[min(60vh,520px)] overflow-auto">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{step.icon}</span>
          <h3 className="text-foreground">{step.title}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.content}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-white">{arrow}</div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevStep}>Previous</Button>
            )}
            {currentStep + 1 < totalSteps && (
              <Button size="sm" onClick={nextStep}>Next</Button>
            )}
            {currentStep + 1 === totalSteps && (
              <Button size="sm" onClick={nextStep}>Finish</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 