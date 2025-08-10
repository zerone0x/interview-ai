"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for the AI's structured output
const analysisSchema = z.object({
  timeline: z
    .array(
      z.object({
        time: z.string().describe("A plausible timestamp for the event, e.g., '00:02:30'"),
        title: z.string().describe("A concise title for this part of the conversation."),
        description: z.string().describe("A short summary of what was discussed."),
      }),
    )
    .describe("Key moments in the interview, chronologically."),
  highlights: z
    .array(z.string())
    .describe("A list of the candidate's strengths and positive points observed during the interview."),
  lowlights: z.array(z.string()).describe("A list of the candidate's weaknesses or areas for improvement."),
  entities: z.array(z.string()).describe("A list of important technologies, skills, or concepts mentioned."),
  transcript: z
    .array(
      z.object({
        speaker: z.enum(["Interviewer", "Candidate"]),
        text: z.string(),
      }),
    )
    .describe("The full interview transcript, reformatted into a conversational flow."),
})

export type AnalysisData = z.infer<typeof analysisSchema>

interface ActionState {
  data?: AnalysisData
  error?: string
}

export async function analyzeInterview(previousState: ActionState, formData: FormData): Promise<ActionState> {
  const interviewLog = formData.get("interview_log") as string

  if (!interviewLog) {
    return { error: "Interview log cannot be empty." }
  }

  try {
    // Validate that the input is valid JSON
    JSON.parse(interviewLog)

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: analysisSchema,
      prompt: `You are an expert HR analyst and career coach. Analyze the following interview transcript, which is provided as a JSON object with 'q' (question) and 'a' (answer) pairs. Your task is to generate a structured analysis based on the provided schema.

      Here is the interview log:
      ${interviewLog}

      Please perform the following analysis:
      1.  **Timeline Summary**: Identify key moments and create a timeline. Invent plausible timestamps.
      2.  **Highlights**: Extract the candidate's key strengths and positive attributes.
      3.  **Lowlights**: Identify areas where the candidate could improve or seemed weak.
      4.  **Key Named Entities**: List all important technologies, methodologies, and proper nouns mentioned.
      5.  **Transcript**: Convert the Q&A log into a clean, readable transcript, assigning 'Interviewer' to questions and 'Candidate' to answers.

      Provide your response strictly in the specified JSON format.`,
    })

    return { data: object }
  } catch (e) {
    if (e instanceof SyntaxError) {
      return { error: "Invalid JSON format in the interview log." }
    }
    console.error(e)
    return { error: "Failed to analyze the interview. Please try again." }
  }
}
