// src/renderer/src/hooks/unity/useUnity.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUnityById, updateUnity, deleteUnity } from '../../services/unityService'
import { UpdateUnity } from '../../schemas/unitySchema'

export const useUnity = (id: number) => {
  const queryClient = useQueryClient()

  const unity = useQuery<Unity | undefined>({
    queryKey: ['unity', id],
    queryFn: () => getUnityById(id),
    enabled: !!id
  })

  const updateUnityMutation = useMutation({
    mutationFn: (data: UpdateUnity) => updateUnity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
      queryClient.invalidateQueries({ queryKey: ['unity', id] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar unidade:', error)
    }
  })

  const deleteUnityMutation = useMutation({
    mutationFn: () => deleteUnity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
      queryClient.removeQueries({ queryKey: ['unity', id] })
    },
    onError: (error) => {
      console.error('Erro ao deletar unidade:', error)
    }
  })

  return {
    unity,
    updateUnity: updateUnityMutation,
    deleteUnity: deleteUnityMutation,
    isLoading: unity.isLoading,
    isError: unity.isError,
    error: unity.error
  }
}