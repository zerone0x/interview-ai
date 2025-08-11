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

  const convertWithWebAudio = useCallback(async (arrayBuffer: ArrayBuffer) => {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
    const audioContext = new AudioCtx()
    const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0))
    const numChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const channelData: Float32Array[] = []
    for (let i = 0; i < numChannels; i++) channelData.push(audioBuffer.getChannelData(i))
    const length = audioBuffer.length * numChannels * 2
    const buffer = new ArrayBuffer(44 + length)
    const view = new DataView(buffer)
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
    }
    writeString(0, "RIFF")
    view.setUint32(4, 36 + length, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * 2, true)
    view.setUint16(32, numChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, length, true)
    let offset = 44
    const interleaved = new Int16Array(length / 2)
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channelData[ch][i]))
        interleaved[(i * numChannels) + ch] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
      }
    }
    for (let i = 0; i < interleaved.length; i++, offset += 2) view.setInt16(offset, interleaved[i], true)
    return new Blob([buffer], { type: "audio/wav" })
  }, [])

  const handleError = useCallback(async () => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const wav = new WaveFile()
      try {
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
        return
      } catch {}
      try {
        const wavBlob = await convertWithWebAudio(arrayBuffer)
        const newUrl = URL.createObjectURL(wavBlob)
        if (srcUrl) URL.revokeObjectURL(srcUrl)
        setSrcUrl(newUrl)
        setError(null)
        if (ref.current) {
          ref.current.src = newUrl
          ref.current.load()
        }
        return
      } catch {}
      setError("This audio file format is not supported by the browser.")
    } catch (e) {
      setError("This audio file format is not supported by the browser.")
    }
  }, [file, srcUrl, convertWithWebAudio])

  return (
    <div className="flex flex-col gap-2">
      <audio ref={ref} src={srcUrl ?? undefined} controls className="w-full" preload="metadata" onError={handleError} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
} 