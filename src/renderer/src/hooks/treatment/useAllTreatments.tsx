// src/renderer/src/hooks/treatment/useAllTreatments.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment } from '../../services/treatmentService'
import { CreateTreatment, UpdateTreatment } from '../../schemas/treatmentSchema'

// Importar o tipo Treatment do global.d.ts
type Treatment = globalThis.Treatment

export const useAllTreatments = () => {
  const queryClient = useQueryClient()

  const treatments = useQuery<Treatment[]>({
    queryKey: ['treatments', 'all'],
    queryFn: () => getAllTreatments()
  })

  const getTreatment = (id: number) => {
    return useQuery<Treatment | undefined>({
      queryKey: ['treatment', id],
      queryFn: () => getTreatmentById(id),
      enabled: !!id
    })
  }

  const createTreatmentMutation = useMutation({
    mutationFn: (data: CreateTreatment) => createTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
    },
    onError: (error) => {
      console.error('Erro ao criar prontuário:', error)
    }
  })

  const updateTreatmentMutation = useMutation({
    mutationFn: (data: UpdateTreatment) => updateTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar prontuário:', error)
    }
  })

  const deleteTreatmentMutation = useMutation({
    mutationFn: (id: number) => deleteTreatment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] })
    },
    onError: (error) => {
      console.error('Erro ao deletar prontuário:', error)
    }
  })

  return {
    treatments,
    getTreatment,
    createTreatment: createTreatmentMutation,
    updateTreatment: updateTreatmentMutation,
    deleteTreatment: deleteTreatmentMutation
  }
}