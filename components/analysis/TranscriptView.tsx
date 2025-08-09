import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play } from "lucide-react"
import type { TranscriptLog } from "@/types/interview"

export function TranscriptView({ transcript }: { transcript: TranscriptLog }) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-6">
      <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Play className="h-6 w-6" />
          <span className="sr-only">Play</span>
        </Button>
        <Slider defaultValue={[0]} max={100} step={1} className="flex-1" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {transcript.map((item, index) => (
                <div key={index}>
                  <p className="font-semibold mb-1 text-primary">Interviewer</p>
                  <p className="p-4 rounded-lg text-sm leading-relaxed text-muted-foreground">{item.q}</p>
                  <p className="font-semibold mb-1 mt-4">Candidate</p>
                  <p className="p-4 rounded-lg bg-muted/30 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 