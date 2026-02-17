// src/renderer/src/hooks/unity/useUnities.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllUnities, getUnityById, createUnity, createUnitiesBulk, updateUnity, deleteUnity } from '../../services/unityService'
import { CreateUnity, UpdateUnity } from '../../schemas/unitySchema'

export const useUnities = () => {
  const queryClient = useQueryClient()

  const unities = useQuery<Unity[]>({
    queryKey: ['unities', 'all'],
    queryFn: () => getAllUnities()
  })

  const getUnity = (id: number) => {
    return useQuery<Unity | undefined>({
      queryKey: ['unity', id],
      queryFn: () => getUnityById(id),
      enabled: !!id
    })
  }

  const createUnityMutation = useMutation({
    mutationFn: (data: CreateUnity) => createUnity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
    },
    onError: (error) => {
      console.error('Erro ao criar unidade:', error)
    }
  })

  const createUnitiesBulkMutation = useMutation({
    mutationFn: (names: string[]) => createUnitiesBulk(names),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
    },
    onError: (error) => {
      console.error('Erro ao criar unidades em massa:', error)
    }
  })

  const updateUnityMutation = useMutation({
    mutationFn: (data: UpdateUnity) => updateUnity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar unidade:', error)
    }
  })

  const deleteUnityMutation = useMutation({
    mutationFn: (id: number) => deleteUnity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
    },
    onError: (error) => {
      console.error('Erro ao deletar unidade:', error)
    }
  })

  return {
    unities: unities.data || [],
    getUnity,
    createUnity: createUnityMutation,
    createUnitiesBulk: createUnitiesBulkMutation,
    updateUnity: updateUnityMutation,
    deleteUnity: deleteUnityMutation
  }
}