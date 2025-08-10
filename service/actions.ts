"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import OpenAI from "openai"
import { toFile } from "openai/uploads"

// Schema for the "Extract Elements" action
const KeyElementsSchema = z.object({
  highlights: z.array(z.string()),
  lowlights: z.array(z.string()),
  keyEntities: z.array(z.string()),
})
export type KeyElementsData = z.infer<typeof KeyElementsSchema>

// Schema for the "Generate Timeline" action
const TimelineSchema = z.object({
  timelineSummary: z.array(
    z.object({
      segment: z.string(),
      topic: z.string(),
      summary: z.string(),
    }),
  ),
})
export type TimelineData = z.infer<typeof TimelineSchema>

/**
 * Action 1: Extracts highlights, lowlights, and key entities from the interview log.
 */
export async function extractKeyElements(interviewLog: string): Promise<{ data?: KeyElementsData; error?: string }> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: KeyElementsSchema,
      prompt: `# 角色
你是一名资深的HR招聘专家和技术面试分析师。
# 任务
你的任务是仔细分析下面提供的JSON格式的面试记录。根据对话内容，提取出三个关键信息：
1.  **亮点 (highlights)**: 候选人在回答中展现出的明确优势、核心能力或令人印象深刻的地方。
2.  **待改进点 (lowlights)**: 候选人回答中暴露出的知识盲区、经验欠缺或可以做得更好的地方。如果内容中没有明显的待改进点，则返回空列表。
3.  **关键实体 (keyEntities)**: 对话中提到的所有重要的技术术语、框架、工具、公司名或专业概念。
# 输入格式
输入将是一个JSON对象，结构如下：
{
  "interview_log": [
    { "q": "面试官提出的问题", "a": "候选人给出的回答" },
    ...
  ]
}
# 输出指令
你必须且只能返回一个格式严格的JSON对象，不包含任何额外的解释或文字。JSON对象必须包含 \`highlights\`, \`lowlights\`, 和 \`keyEntities\` 三个键，其值均为字符串数组。

# Interview Log to Analyze:
${interviewLog}`,
    })
    return { data: object }
  } catch (e) {
    console.error(e)
    return { error: "Failed to extract key elements from the interview." }
  }
}

/**
 * Action 2: Generates a timeline summary from the interview log.
 */
export async function generateTimeline(interviewLog: string): Promise<{ data?: TimelineData; error?: string }> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: TimelineSchema,
      prompt: `# 角色
你是一个高效的AI会议纪要助手。
# 任务
你的任务是将一份JSON格式的面试记录，转换成一个按对话顺序排列的流程摘要。每一对问答（Q&A）都应被视为一个独立的对话片段。
# 输入格式
输入将是一个JSON对象，结构如下：
{
  "interview_log": [
    { "q": "面试官提出的问题", "a": "候选人给出的回答" },
    ...
  ]
}
# 输出指令
你必须且只能返回一个格式严格的JSON对象，不包含任何额外的解释或文字。
- JSON的根键应为 \`timelineSummary\`。
- \`timelineSummary\` 的值是一个对象数组。
- 数组中的每个对象代表一轮对话，并必须包含以下三个键：
    - \`segment\`: (string) 对话片段的编号，格式为 "对话 X"，其中X是序号（从1开始）。
    - \`topic\`: (string) 对该轮问答核心内容的精准概括，通常为2-5个词。
    - \`summary\`: (string) 对该轮问答内容的一句话精炼总结。

# Interview Log to Analyze:
${interviewLog}`,
    })
    return { data: object }
  } catch (e) {
    console.error(e)
    return { error: "Failed to generate the timeline summary." }
  }
}

const InterviewLogSchema = z.object({
  interview_log: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    }),
  ),
})

export async function transcribeAudioAndBuildJson(formData: FormData): Promise<{ jsonText?: string; error?: string }> {
  try {
    const file = formData.get("file") as File | null
    if (!file) {
      return { error: "No file provided." }
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const bytes = await file.arrayBuffer()
    const blob = new Blob([bytes], { type: file.type || "audio/mpeg" })
    const uploadFile = await toFile(blob, file.name || "audio")

    const transcription = await client.audio.transcriptions.create({
      file: uploadFile,
      model: "whisper-1",
    })

    const transcriptText = (transcription as any).text?.trim()
    if (!transcriptText) {
      return { error: "Transcription failed." }
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: InterviewLogSchema,
      prompt: `You are given an interview transcript as plain text without explicit speaker labels. Segment it into ordered Q&A pairs where each pair contains one interviewer question (q) and one candidate answer (a). If boundaries are unclear, infer them conservatively and avoid hallucinating content. Respond with a strict JSON object that matches the schema exactly and include no extra commentary.\n\nTranscript:\n${transcriptText}`,
    })

    const jsonText = JSON.stringify(object, null, 2)
    return { jsonText }
  } catch (e) {
    console.error(e)
    return { error: "Failed to transcribe and structure audio." }
  }
}
