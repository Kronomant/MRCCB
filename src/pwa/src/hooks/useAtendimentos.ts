import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useAtendimentosByReunion(reunionId: number) {
  return useQuery({
    queryKey: ['atendimentos', 'reunion', reunionId],
    queryFn: () => api.atendimentos.byReunion(reunionId),
    enabled: !!reunionId
  })
}

export function useAtendimentosByProntuario(prontuarioId: number) {
  return useQuery({
    queryKey: ['atendimentos', 'prontuario', prontuarioId],
    queryFn: () => api.atendimentos.byProntuario(prontuarioId),
    enabled: !!prontuarioId
  })
}
