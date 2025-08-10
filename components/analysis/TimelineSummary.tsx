import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TimelineData } from "@/service/actions"

export function TimelineSummary({ timeline }: { timeline: TimelineData }) {
  return (
    <Card className="bg-background/60 backdrop-blur-xl border-white/20 shadow-md">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Timeline Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {timeline.timelineSummary.map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="font-mono text-sm text-muted-foreground pt-0.5">{item.segment}</span>
              <div className="flex-1">
                <p className="font-semibold">{item.topic}</p>
                <p className="text-sm text-muted-foreground">{item.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
} 