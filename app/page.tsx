"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadAndControls } from "@/components/analysis/UploadAndControls"
import { TimelineSummary } from "@/components/analysis/TimelineSummary"
import { KeyElements } from "@/components/analysis/KeyElements"
import { TranscriptView } from "@/components/analysis/TranscriptView"
import { useInterviewAnalysis } from "@/hooks/useInterviewAnalysis"
import { AudioPlayer } from "@/components/analysis/AudioPlayer"
import { useOnborda } from "onborda"

export default function Component() {
  const { state, actions } = useInterviewAnalysis()
  const { startOnborda } = useOnborda()

  const { jsonInput, error, keyElements, timeline, transcript, isExtracting, isGeneratingTimeline, isTranscribing, audioFile } = state
  const { setJsonInput, setAudioFile, transcribe, runAction, reset } = actions

  useEffect(() => {
    reset()
  }, [])

  const startTour = () => {
    startOnborda("main")
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-40 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,theme(colors.primary/25),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,theme(colors.accent/25),transparent_60%)] blur-3xl" />
      </div>
      <main className="container mx-auto px-4 py-12 md:py-16">
        <section id="tour-hero" className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <span className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">AI-powered interview insights</span>
          <h1 className="mt-4 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">Interview Analysis</h1>
          <p className="mt-3 text-muted-foreground md:text-lg">Upload audio or paste logs. Extract key elements and generate a clear timeline.</p>
          {/* <div className="mt-5 flex justify-center">
            <Button onClick={startTour} variant="default">Start tour</Button>
          </div> */}
        </section>

        <div id="tour-upload-controls">
          <UploadAndControls
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            isTranscribing={isTranscribing}
            isExtracting={isExtracting}
            isGeneratingTimeline={isGeneratingTimeline}
            onTranscribe={transcribe}
            onAction={runAction}
            error={error}
            onReset={reset}
          />
        </div>

        {audioFile && (
          <div className="mx-auto mb-8 max-w-3xl">
            <Card className="p-4">
              <AudioPlayer file={audioFile} />
            </Card>
          </div>
        )}

        {(keyElements || timeline || transcript) && (
          <div id="tour-results" className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <aside className="lg:col-span-2 lg:sticky top-8">
              <div className="flex flex-col gap-6">
                {timeline && <TimelineSummary timeline={timeline} />}
                {keyElements && <KeyElements data={keyElements} />}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
