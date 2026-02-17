// src/renderer/src/hooks/prontuario/useProntuarios.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllProntuarios,
  getProntuarioById,
  getProntuarioByNumber,
  getProntuariosByIds,
  getProntuariosByUnity,
  getActiveProntuarios,
  createProntuario,
  updateProntuario,
  deleteProntuario
} from '../../services/prontuarioService'
import { CreateProntuario, UpdateProntuario } from '../../schemas/prontuarioSchema'

export const useProntuarios = (options?: {
  fetchAll?: boolean
  fetchActive?: boolean
}) => {
  const queryClient = useQueryClient()

  const prontuarios = useQuery<Prontuario[]>({
    queryKey: ['prontuarios', 'all'],
    queryFn: () => getAllProntuarios(),
    enabled: options?.fetchAll ?? true,
    staleTime: 1000 * 60 * 10 // 10 minutes
  })

  const activeProntuarios = useQuery<Prontuario[]>({
    queryKey: ['prontuarios', 'active'],
    queryFn: () => getActiveProntuarios(),
    enabled: options?.fetchActive ?? true,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const getProntuario = (id: number) => {
    return useQuery<Prontuario | undefined>({
      queryKey: ['prontuario', id],
      queryFn: () => getProntuarioById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 30 // 30 minutes
    })
  }

  // New query to fetch only prontuarios that are actually in the reunion records
  const getProntuariosForReunion = (reunionRecords: { prontuarioId: number }[]) => {
    const ids = Array.from(new Set(reunionRecords.map((r) => r.prontuarioId))).filter(Boolean)
    return useQuery<Prontuario[]>({
      queryKey: ['prontuarios', 'reunion', ids.join(',')],
      queryFn: () => getProntuariosByIds(ids),
      enabled: ids.length > 0,
       staleTime: 1000 * 60 * 10 // 10 minutes
    })
  }

  const getProntuarioByNumberQuery = (number: number) => {
    return useQuery<Prontuario | undefined>({
      queryKey: ['prontuario', 'number', number],
      queryFn: () => getProntuarioByNumber(number),
      enabled: !!number,
      staleTime: 1000 * 60 * 30
    })
  }

  const getProntuariosByUnityQuery = (unityId: number) => {
    return useQuery<Prontuario[]>({
      queryKey: ['prontuarios', 'unity', unityId],
      queryFn: () => getProntuariosByUnity(unityId),
      enabled: !!unityId,
      staleTime: 1000 * 60 * 10
    })
  }

  const createProntuarioMutation = useMutation({
    mutationFn: (data: CreateProntuario) => createProntuario(data),
    onSuccess: (created) => {
      queryClient.setQueryData<Prontuario[]>(['prontuarios', 'active'], (prev) => {
        const list = Array.isArray(prev) ? prev : []
        const exists = list.some((p) => p.id === created.id)
        const next = exists ? list.map((p) => (p.id === created.id ? created : p)) : [...list, created]
        return next.sort((a, b) => a.number - b.number)
      })
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] })
    },
    onError: (error) => {
      console.error('Erro ao criar prontuário:', error)
    }
  })

  const updateProntuarioMutation = useMutation({
    mutationFn: (data: UpdateProntuario) => updateProntuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar prontuário:', error)
    }
  })

  const deleteProntuarioMutation = useMutation({
    mutationFn: (id: number) => deleteProntuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios'] })
    },
    onError: (error) => {
      console.error('Erro ao deletar prontuário:', error)
    }
  })

  return {
    prontuarios: prontuarios.data || [],
    activeProntuarios: activeProntuarios.data || [],
    getProntuario,
    getProntuariosForReunion,
    getProntuarioByNumber: getProntuarioByNumberQuery,
    getProntuariosByUnity: getProntuariosByUnityQuery,
    createProntuario: createProntuarioMutation,
    updateProntuario: updateProntuarioMutation,
    deleteProntuario: deleteProntuarioMutation
  }
}
