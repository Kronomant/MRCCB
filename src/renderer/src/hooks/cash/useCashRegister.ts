import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCashRegister,
  getCashRegisterByReunion,
  updateCashRegisterOpening,
  closeCashRegister,
  reopenCashRegister
} from '../../services/cashRegisterService'
import { CreateCashRegisterSchema, UpdateOpeningSchema, CloseCashRegisterSchema } from '../../schemas/cashSchemas'

export const useCashRegister = (reunionId: number) => {
  const queryClient = useQueryClient()
  const queryKey = ['cashRegister', reunionId]

  const cashRegisterQuery = useQuery({
    queryKey,
    queryFn: () => getCashRegisterByReunion(reunionId),
    enabled: !!reunionId
  })

  // Mutation para criar registro (abertura de caixa)
  const createMutation = useMutation({
    mutationFn: (data: CreateCashRegisterSchema) => createCashRegister(data),
    onSuccess: (newItem) => {
      queryClient.setQueryData(queryKey, newItem)
      queryClient.invalidateQueries({ queryKey })
    }
  })

  // Mutation para atualizar valores de abertura
  const updateOpeningMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOpeningSchema }) =>
      updateCashRegisterOpening(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  // Mutation para fechar caixa
  const closeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CloseCashRegisterSchema }) =>
      closeCashRegister(id, data.closingValue, data.difference, data.closingCounts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  // Mutation para reabrir caixa
  const reopenMutation = useMutation({
    mutationFn: (id: number) => reopenCashRegister(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  return {
    cashRegister: cashRegisterQuery.data,
    isLoading: cashRegisterQuery.isLoading,
    error: cashRegisterQuery.error,
    createCashRegister: createMutation,
    updateOpening: updateOpeningMutation,
    closeCashRegister: closeMutation,
    reopenCashRegister: reopenMutation,
    refetch: cashRegisterQuery.refetch
  }
}
