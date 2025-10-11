// src/renderer/src/hooks/treatment/useTreatments.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTreatmentsByReunion, createTreatment, updateTreatment, deleteTreatment } from '../../services/treatmentService'
import { CreateTreatment, UpdateTreatment } from '../../schemas/treatmentSchema'

export const useTreatments = (reunionId: number) => {
  const queryClient = useQueryClient()

  const treatments = useQuery<Treatment[]>({
    queryKey: ['treatments', reunionId],
    queryFn: () => getTreatmentsByReunion(reunionId),
    enabled: !!reunionId
  })

  const createTreatmentMutation = useMutation({
    mutationFn: (data: CreateTreatment) => createTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments', reunionId] })
    },
    onError: (error) => {
      console.error('Erro ao criar tratamento:', error)
    }
  })

  const updateTreatmentMutation = useMutation({
    mutationFn: (data: UpdateTreatment) => updateTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments', reunionId] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar tratamento:', error)
    }
  })

  const deleteTreatmentMutation = useMutation({
    mutationFn: (id: number) => deleteTreatment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments', reunionId] })
    },
    onError: (error) => {
      console.error('Erro ao deletar tratamento:', error)
    }
  })

  return {
    treatments,
    createTreatment: createTreatmentMutation,
    updateTreatment: updateTreatmentMutation,
    deleteTreatment: deleteTreatmentMutation
  }
}