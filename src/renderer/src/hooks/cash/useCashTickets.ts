import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCashTicket,
  getTicketsByReunion,
  updateCashTicket,
  deleteCashTicket,
  getTotalTicketsByReunion
} from '../../services/cashRegisterService'
import { CreateCashTicketSchema } from '../../schemas/cashSchemas'

export const useCashTickets = (reunionId: number) => {
  const queryClient = useQueryClient()
  const queryKey = ['cashTickets', reunionId]
  const totalQueryKey = ['cashTicketsTotal', reunionId]

  const ticketsQuery = useQuery({
    queryKey,
    queryFn: () => getTicketsByReunion(reunionId),
    enabled: !!reunionId
  })

  const totalQuery = useQuery({
    queryKey: totalQueryKey,
    queryFn: () => getTotalTicketsByReunion(reunionId),
    enabled: !!reunionId
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateCashTicketSchema) => createCashTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: totalQueryKey })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCashTicketSchema> }) => updateCashTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: totalQueryKey })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCashTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: totalQueryKey })
    }
  })

  return {
    tickets: ticketsQuery.data || [],
    totalTickets: totalQuery.data || 0,
    isLoading: ticketsQuery.isLoading,
    createTicket: createMutation,
    updateTicket: updateMutation,
    deleteTicket: deleteMutation
  }
}
