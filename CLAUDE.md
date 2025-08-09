# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js application with the following key commands:

- `npm run dev` - Start development server (Next.js dev mode)
- `npm run build` - Build production version  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

The project uses pnpm as the package manager (evidenced by `pnpm-lock.yaml`). However, npm commands will also work as both package-lock.json and pnpm-lock.yaml are present.

## Architecture Overview

This is an **AI-powered interview analysis application** built with Next.js 15 and React 19. The app allows users to:

1. Upload audio files for automatic transcription using Groq's Whisper API
2. Manually input interview JSON logs
3. Extract key elements (highlights, lowlights, entities) from interviews
4. Generate timeline summaries of interview conversations

### Core Structure

**Frontend (Client Components):**
- `app/page.tsx` - Main interview analysis UI, now modularized with custom hook and components
- `components/ui/` - shadcn/ui component library (complete UI kit)
- `components/analysis/` - Feature-specific components (UploadAndControls, TimelineSummary, etc.)
- `hooks/useInterviewAnalysis.ts` - Custom hook for interview analysis state management  
- `lib/utils.ts` - Utility functions (mainly `cn` for className merging)

**Backend (Server Actions & API Routes):**
- `app/actions.ts` - Server actions for AI-powered analysis using OpenAI GPT-4o and Whisper transcription
- `app/api/transcribe/route.ts` - API route wrapper for audio transcription (delegates to actions.ts)
- `app/action.ts` - Legacy server action (appears unused in current implementation)

**Key Dependencies:**
- **AI SDK**: `ai` and `@ai-sdk/openai` for structured AI responses with Zod schemas
- **UI**: shadcn/ui components built on Radix UI and Tailwind CSS
- **Styling**: Tailwind CSS v4 with PostCSS configuration
- **Audio**: OpenAI Whisper API (via OpenAI SDK) for transcription - NOT Groq
- **Validation**: Zod for schema validation and type inference
- **Additional**: `@xenova/transformers` for client-side ML capabilities

### Data Flow

1. **Audio Upload → Transcription**: Files sent to `/api/transcribe` → OpenAI Whisper API → raw transcript
2. **Transcript → Structured JSON**: Raw transcript processed by `transcribeAudioAndBuildJson` action → Q&A format
3. **Analysis**: Structured interview log processed by either:
   - `extractKeyElements` - highlights/lowlights/entities extraction
   - `generateTimeline` - chronological conversation summary

### Environment Variables Required

- `OPENAI_API_KEY` - For both audio transcription (Whisper) and AI analysis (GPT-4o)

### Technical Notes

- Uses Next.js App Router with React Server Components
- Build configuration ignores TypeScript and ESLint errors (`next.config.mjs`)
- Tailwind CSS v4 with PostCSS configuration
- No custom TypeScript configuration beyond Next.js defaults
- Components follow shadcn/ui patterns with proper `cn()` className merging
- Server actions use structured outputs with Zod schemas for type safety

### Component Patterns

The codebase follows these patterns:
- shadcn/ui component composition with consistent prop interfaces
- Server actions returning `{ data?, error? }` result objects
- Zod schemas for AI model outputs ensuring type safety
- Tailwind CSS for styling with CSS variables for theming
- Loading states with Lucide React icons (`LoaderCircle`)
- Custom hooks for complex state management (e.g., `useInterviewAnalysis`)
- Modular component architecture for maintainability