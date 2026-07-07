import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useDeliveriesByReunion(reunionId: number) {
  return useQuery({
    queryKey: ['deliveries', 'reunion', reunionId],
    queryFn: () => api.deliveries.byReunion(reunionId),
    enabled: !!reunionId
  })
}

export function useDeliveriesByProntuario(prontuarioId: number) {
  return useQuery({
    queryKey: ['deliveries', 'prontuario', prontuarioId],
    queryFn: () => api.deliveries.byProntuario(prontuarioId),
    enabled: !!prontuarioId
  })
}
