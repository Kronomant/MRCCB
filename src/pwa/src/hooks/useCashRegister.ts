import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useCashRegister(reunionId: number) {
  return useQuery({
    queryKey: ['cash', 'register', reunionId],
    queryFn: () => api.cash.register(reunionId),
    enabled: !!reunionId
  })
}

export function useCashTickets(reunionId: number) {
  return useQuery({
    queryKey: ['cash', 'tickets', reunionId],
    queryFn: () => api.cash.tickets(reunionId),
    enabled: !!reunionId
  })
}

export function useCashExpenses(reunionId: number) {
  return useQuery({
    queryKey: ['cash', 'expenses', reunionId],
    queryFn: () => api.cash.expenses(reunionId),
    enabled: !!reunionId
  })
}
