import { useState, useEffect } from 'react'
import { AIModel } from '@/features/dashboard/models/types/model.types'
import { modelService } from '@/features/dashboard/models/services/model.service'

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string>("")

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await modelService.getModels(true)
        setModels(data)
        if (data.length > 0 && !selectedModelId) {
          const defaultModel = data.find(m => m.model_id === "3fa85f64-5717-4562-b3fc-2c963f66afa6") || data[0]
          setSelectedModelId(defaultModel.model_id)
        }
      } catch (err) {
        console.error("Error fetching models:", err)
      }
    }
    fetchModels()
  }, [])

  return { models, selectedModelId, setSelectedModelId }
}
