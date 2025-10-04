import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllReunions, createReunion, updateReunion, deleteReunion } from '../../services/reunionService'
import { CreateReunion, UpdateReunion } from '../../schemas/reunionSchema'

export const useReunions = () => {
  const queryClient = useQueryClient()

  const reunions = useQuery({
    queryKey: ['reunions'],
    queryFn: getAllReunions
  })

  const createReunionMutation = useMutation({
    mutationFn: (data: CreateReunion) => createReunion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reunions'] })
    },
    onError: (error) => {
      console.error('Erro ao criar reunião:', error)
    }
  })

  const updateReunionMutation = useMutation({
    mutationFn: (data: UpdateReunion) => updateReunion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reunions'] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar reunião:', error)
    }
  })

  const deleteReunionMutation = useMutation({
    mutationFn: (id: number) => deleteReunion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reunions'] })
    },
    onError: (error) => {
      console.error('Erro ao deletar reunião:', error)
    }
  })

  return { 
    reunions,
    createReunion: createReunionMutation,
    updateReunion: updateReunionMutation,
    deleteReunion: deleteReunionMutation
  }
}
