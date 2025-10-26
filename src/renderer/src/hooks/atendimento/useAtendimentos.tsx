// src/renderer/src/hooks/atendimento/useAtendimentos.tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult
} from '@tanstack/react-query'
import {
  getAtendimentosByReunion,
  createAtendimento,
  updateAtendimento,
  deleteAtendimento
} from '../../services/atendimentoService'
import { CreateAtendimento, UpdateAtendimento } from '../../schemas/atendimentoSchema'

export const useAtendimentos = (
  reunionId: number
): {
  atendimentos: UseQueryResult<Atendimento[], Error>
  createAtendimento: UseMutationResult<Atendimento, Error, CreateAtendimento>
  updateAtendimento: UseMutationResult<Atendimento, Error, UpdateAtendimento>
  deleteAtendimento: UseMutationResult<boolean, Error, number>
} => {
  const queryClient = useQueryClient()

  const atendimentos = useQuery<Atendimento[]>({
    queryKey: ['atendimentos', reunionId],
    queryFn: () => getAtendimentosByReunion(reunionId),
    enabled: !!reunionId
  })

  const createAtendimentoMutation = useMutation({
    mutationFn: (data: CreateAtendimento) => createAtendimento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos', reunionId] })
    },
    onError: (error) => {
      console.error('Erro ao criar atendimento:', error)
    }
  })

  const updateAtendimentoMutation = useMutation({
    mutationFn: (data: UpdateAtendimento) => updateAtendimento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos', reunionId] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar atendimento:', error)
    }
  })

  const deleteAtendimentoMutation = useMutation({
    mutationFn: (id: number) => deleteAtendimento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos', reunionId] })
    },
    onError: (error) => {
      console.error('Erro ao deletar atendimento:', error)
    }
  })

  return {
    atendimentos,
    createAtendimento: createAtendimentoMutation,
    updateAtendimento: updateAtendimentoMutation,
    deleteAtendimento: deleteAtendimentoMutation
  }
}
