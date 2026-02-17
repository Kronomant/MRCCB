import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchInterval: 60000, // 60 seconds
      refetchOnWindowFocus: true,
      refetchOnReconnect: true
    }
  }
})
