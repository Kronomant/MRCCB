// src/renderer/src/hooks/prontuario/useProntuarios.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllProntuarios,
  getProntuarioById,
  getProntuarioByNumber,
  getProntuariosByUnity,
  getActiveProntuarios,
  createProntuario,
  updateProntuario,
  deleteProntuario
} from '../../services/prontuarioService'
import { CreateProntuario, UpdateProntuario } from '../../schemas/prontuarioSchema'

export const useProntuarios = () => {
  const queryClient = useQueryClient()

  const prontuarios = useQuery<Prontuario[]>({
    queryKey: ['prontuarios', 'all'],
    queryFn: () => getAllProntuarios()
  })

  const activeProntuarios = useQuery<Prontuario[]>({
    queryKey: ['prontuarios', 'active'],
    queryFn: () => getActiveProntuarios()
  })

  const getProntuario = (id: number) => {
    return useQuery<Prontuario | undefined>({
      queryKey: ['prontuario', id],
      queryFn: () => getProntuarioById(id),
      enabled: !!id
    })
  }

  const getProntuarioByNumberQuery = (number: number) => {
    return useQuery<Prontuario | undefined>({
      queryKey: ['prontuario', 'number', number],
      queryFn: () => getProntuarioByNumber(number),
      enabled: !!number
    })
  }

  const getProntuariosByUnityQuery = (unityId: number) => {
    return useQuery<Prontuario[]>({
      queryKey: ['prontuarios', 'unity', unityId],
      queryFn: () => getProntuariosByUnity(unityId),
      enabled: !!unityId
    })
  }

  const createProntuarioMutation = useMutation({
    mutationFn: (data: CreateProntuario) => createProntuario(data),
    onSuccess: () => {
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
    getProntuarioByNumber: getProntuarioByNumberQuery,
    getProntuariosByUnity: getProntuariosByUnityQuery,
    createProntuario: createProntuarioMutation,
    updateProntuario: updateProntuarioMutation,
    deleteProntuario: deleteProntuarioMutation
  }
}
