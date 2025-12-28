// src/renderer/src/hooks/prontuarioDelivery/useProntuarioDelivery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Hook para buscar status de entrega de um prontuário específico em uma reunião
export function useProntuarioDelivery(prontuarioId: number, reunionId: number) {
  return useQuery({
    queryKey: ['prontuarioDelivery', prontuarioId, reunionId],
    queryFn: () => (window as any).api.prontuarioDelivery.getByIds(prontuarioId, reunionId),
    enabled: !!prontuarioId && !!reunionId
  })
}

// Hook para buscar todos os prontuários de uma reunião com seus status de entrega
export function useProntuarioDeliveriesByReunion(reunionId: number) {
  return useQuery({
    queryKey: ['prontuarioDeliveries', 'reunion', reunionId],
    queryFn: () => (window as any).api.prontuarioDelivery.getByReunion(reunionId),
    enabled: !!reunionId
  })
}

// Hook para buscar histórico de entregas de um prontuário
export function useProntuarioDeliveriesByProntuario(prontuarioId: number) {
  return useQuery({
    queryKey: ['prontuarioDeliveries', 'prontuario', prontuarioId],
    queryFn: () => (window as any).api.prontuarioDelivery.getByProntuario(prontuarioId),
    enabled: !!prontuarioId
  })
}

// Hook para marcar prontuário como entregue
export function useMarkProntuarioAsDelivered() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ prontuarioId, reunionId, deliveredBy }: { prontuarioId: number; reunionId: number; deliveredBy: string }) =>
      (window as any).api.prontuarioDelivery.markDelivered(prontuarioId, reunionId, deliveredBy),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarioDelivery', variables.prontuarioId, variables.reunionId] })
      queryClient.invalidateQueries({ queryKey: ['prontuarioDeliveries', 'reunion', variables.reunionId] })
      queryClient.invalidateQueries({ queryKey: ['prontuarioDeliveries', 'prontuario', variables.prontuarioId] })
      queryClient.invalidateQueries({ queryKey: ['atendimentos', variables.reunionId] })
      queryClient.invalidateQueries({ queryKey: ['records', variables.reunionId] })
    }
  })
}

// Hook para marcar prontuário como devolvido
export function useMarkProntuarioAsReturned() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ prontuarioId, reunionId, returnedBy }: { prontuarioId: number; reunionId: number; returnedBy: string }) =>
      (window as any).api.prontuarioDelivery.markReturned(prontuarioId, reunionId, returnedBy),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarioDelivery', variables.prontuarioId, variables.reunionId] })
      queryClient.invalidateQueries({ queryKey: ['prontuarioDeliveries', 'reunion', variables.reunionId] })
      queryClient.invalidateQueries({ queryKey: ['prontuarioDeliveries', 'prontuario', variables.prontuarioId] })
      queryClient.invalidateQueries({ queryKey: ['atendimentos', variables.reunionId] })
      queryClient.invalidateQueries({ queryKey: ['records', variables.reunionId] })
    }
  })
}

// Hook para buscar logs de transição de status
export function useStatusTransitionLogs(entityType: 'reunion' | 'prontuario_delivery', entityId: number) {
  return useQuery({
    queryKey: ['statusTransitionLogs', entityType, entityId],
    queryFn: () => (window as any).api.prontuarioDelivery.getStatusLogs(entityType, entityId),
    enabled: !!entityId
  })
}

// Hook para criar retornos automáticos
export function useCreateAutomaticReturns() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ reunionId, processedBy }: { reunionId: number; processedBy: string }) =>
      (window as any).api.prontuarioDelivery.createAutomaticReturns(reunionId, processedBy),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['prontuarioDeliveries', 'reunion', variables.reunionId] })
    }
  })
}

// Hook para buscar prontuários para retorno no próximo mês
export function useProntuariosForNextMonthReturn() {
  return useQuery({
    queryKey: ['prontuariosNextMonthReturn'],
    queryFn: () => (window as any).api.prontuarioDelivery.getForNextMonthReturn()
  })
}