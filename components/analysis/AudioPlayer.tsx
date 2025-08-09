"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { WaveFile } from "wavefile"

export function AudioPlayer({ file }: { file: File }) {
  const [srcUrl, setSrcUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLAudioElement>(null)

  const initialUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    setError(null)
    setSrcUrl(initialUrl)
    return () => {
      if (ref.current) ref.current.pause()
      URL.revokeObjectURL(initialUrl)
    }
  }, [initialUrl])

  const handleError = useCallback(async () => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const wav = new WaveFile()
      wav.fromBuffer(new Uint8Array(arrayBuffer))
      wav.toBitDepth("16")
      const fixedBuffer = wav.toBuffer()
      const blob = new Blob([fixedBuffer], { type: "audio/wav" })
      const newUrl = URL.createObjectURL(blob)
      if (srcUrl) URL.revokeObjectURL(srcUrl)
      setSrcUrl(newUrl)
      setError(null)
      if (ref.current) {
        ref.current.src = newUrl
        ref.current.load()
      }
    } catch (e) {
      setError("This audio file format is not supported by the browser.")
    }
  }, [file, srcUrl])

  return (
    <div className="flex flex-col gap-2">
      <audio ref={ref} src={srcUrl ?? undefined} controls className="w-full" preload="metadata" onError={handleError} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
} 