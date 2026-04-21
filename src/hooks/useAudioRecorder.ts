import { useState, useRef, useCallback } from 'react'

export function useAudioRecorder(onAudioReady: (file: File) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
          onAudioReady(file)
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Mic error:", err)
      }
    }
  }, [isRecording, onAudioReady])

  return { isRecording, handleToggleRecording }
}
