"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoaderCircle, Upload, RefreshCw, Bot, Milestone } from "lucide-react"
import { useState } from "react"

type Props = {
  jsonInput: string
  setJsonInput: (v: string) => void
  audioFile: File | null
  setAudioFile: (f: File | null) => void
  isTranscribing: boolean
  isExtracting: boolean
  isGeneratingTimeline: boolean
  onTranscribe: () => void
  onAction: (action: "extract" | "timeline") => void
  error: string | null
  onReset: () => void
}

export function UploadAndControls({
  jsonInput,
  setJsonInput,
  audioFile,
  setAudioFile,
  isTranscribing,
  isExtracting,
  isGeneratingTimeline,
  onTranscribe,
  onAction,
  error,
  onReset,
}: Props) {
  const [fileInputKey, setFileInputKey] = useState(0)

  const handleReset = () => {
    onReset()
    setFileInputKey((k) => k + 1)
  }

  return (
    <Card className="mb-10 border-white/20 bg-background/60 backdrop-blur-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Upload & Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <input
            key={fileInputKey}
            id="audio-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <label
            htmlFor="audio-input"
            className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-4 transition hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Upload audio</p>
                <p className="text-muted-foreground">Transcribe to JSON</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {audioFile ? audioFile.name : "Click to select file"}
            </div>
          </label>
          <div className="mt-3 flex gap-3 items-center">
            <Button onClick={onTranscribe} disabled={isTranscribing || !audioFile} className="w-52">
              {isTranscribing ? <LoaderCircle className="animate-spin" /> : "Transcribe to JSON"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={isTranscribing || isExtracting || isGeneratingTimeline}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="json-input" className="block text-sm font-medium text-muted-foreground">
            Paste Interview Log JSON
          </label>
          <Textarea
            id="json-input"
            name="interview_log"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={10}
            className="font-mono bg-muted/30"
            placeholder="Enter JSON data..."
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button onClick={() => onAction("extract")} disabled={isExtracting || isGeneratingTimeline} className="w-52">
            {isExtracting ? <LoaderCircle className="animate-spin" /> : <><Bot className="mr-2 h-4 w-4" />Extract Key Elements</>}
          </Button>
          <Button onClick={() => onAction("timeline")} disabled={isExtracting || isGeneratingTimeline} variant="outline" className="w-52">
            {isGeneratingTimeline ? <LoaderCircle className="animate-spin" /> : <><Milestone className="mr-2 h-4 w-4" />Generate Timeline</>}
          </Button>
        </div>

        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
} 