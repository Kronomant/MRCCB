// src/renderer/src/hooks/prontuario/useProntuario.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getProntuarioById, 
  updateProntuario, 
  deleteProntuario 
} from '../../services/prontuarioService'
import { UpdateProntuario } from '../../schemas/prontuarioSchema'

export const useProntuario = (id: number) => {
  const queryClient = useQueryClient()

  const prontuario = useQuery<Prontuario | undefined>({
    queryKey: ['prontuario', id],
    queryFn: () => getProntuarioById(id),
    enabled: !!id
  })

  const updateProntuarioMutation = useMutation({
    mutationFn: (data: UpdateProntuario) => updateProntuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] })
      queryClient.invalidateQueries({ queryKey: ['prontuario', id] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar prontuário:', error)
    }
  })

  const deleteProntuarioMutation = useMutation({
    mutationFn: () => deleteProntuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] })
      queryClient.removeQueries({ queryKey: ['prontuario', id] })
    },
    onError: (error) => {
      console.error('Erro ao deletar prontuário:', error)
    }
  })

  return {
    prontuario,
    updateProntuario: updateProntuarioMutation,
    deleteProntuario: deleteProntuarioMutation,
    isLoading: prontuario.isLoading,
    isError: prontuario.isError,
    error: prontuario.error
  }
}