import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCashExpense,
  getExpensesByReunion,
  updateCashExpense,
  deleteCashExpense,
  getTotalExpensesByReunion,
  getTotalExpensesByCategory
} from '../../services/cashRegisterService'
import { CreateCashExpenseSchema } from '../../schemas/cashSchemas'

export const useCashExpenses = (reunionId: number) => {
  const queryClient = useQueryClient()
  const queryKey = ['cashExpenses', reunionId]
  const totalQueryKey = ['cashExpensesTotal', reunionId]
  const categoryTotalsQueryKey = ['cashExpensesCategoryTotals', reunionId]

  const expensesQuery = useQuery({
    queryKey,
    queryFn: () => getExpensesByReunion(reunionId),
    enabled: !!reunionId
  })

  const totalQuery = useQuery({
    queryKey: totalQueryKey,
    queryFn: () => getTotalExpensesByReunion(reunionId),
    enabled: !!reunionId
  })

  const categoryTotalsQuery = useQuery({
    queryKey: categoryTotalsQueryKey,
    queryFn: () => getTotalExpensesByCategory(reunionId),
    enabled: !!reunionId
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateCashExpenseSchema) => createCashExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: totalQueryKey })
      queryClient.invalidateQueries({ queryKey: categoryTotalsQueryKey })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCashExpenseSchema> }) => updateCashExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: totalQueryKey })
      queryClient.invalidateQueries({ queryKey: categoryTotalsQueryKey })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCashExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: totalQueryKey })
      queryClient.invalidateQueries({ queryKey: categoryTotalsQueryKey })
    }
  })

  return {
    expenses: expensesQuery.data || [],
    totalExpenses: totalQuery.data || 0,
    categoryTotals: categoryTotalsQuery.data || {},
    isLoading: expensesQuery.isLoading,
    createExpense: createMutation,
    updateExpense: updateMutation,
    deleteExpense: deleteMutation
  }
}
