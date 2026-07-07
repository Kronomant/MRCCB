import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Reunioes } from './pages/Reunioes'
import { ReunionDetail } from './pages/ReunionDetail'
import { Prontuarios } from './pages/Prontuarios'
import { Unidades } from './pages/Unidades'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 }
  }
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="reunioes" element={<Reunioes />} />
              <Route path="reunioes/:id" element={<ReunionDetail />} />
              <Route path="prontuarios" element={<Prontuarios />} />
              <Route path="unidades" element={<Unidades />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
