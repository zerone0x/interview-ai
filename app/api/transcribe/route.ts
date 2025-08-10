import { NextResponse } from "next/server"
import { transcribeAudioAndBuildJson } from "@/service/actions"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const { jsonText, error } = await transcribeAudioAndBuildJson(formData)
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    return NextResponse.json({ jsonText })
  } catch (e) {
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 })
  }
} 