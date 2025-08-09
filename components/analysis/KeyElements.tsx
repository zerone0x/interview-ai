import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle } from "lucide-react"
import type { KeyElementsData } from "@/app/actions"

export function KeyElements({ data }: { data: KeyElementsData }) {
  return (
    <>
      <Card className="bg-background/60 backdrop-blur-xl border-white/20 shadow-md">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.highlights.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="bg-background/60 backdrop-blur-xl border-white/20 shadow-md">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Lowlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.lowlights.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="flex-1 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="bg-background/60 backdrop-blur-xl border-white/20 shadow-md">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Key Named Entities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.keyEntities.map((entity, index) => (
              <Badge key={index} variant="secondary">
                {entity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 