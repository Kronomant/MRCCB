import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const ENTITY_QUERY_KEYS: Record<string, string[][]> = {
  reunion: [['reunions'], ['reunion']],
  atendimento: [['atendimentos']],
  prontuario: [['prontuarios']],
  unity: [['unities']],
  delivery: [['deliveries']],
  cashRegister: [['cash']]
}

export function useRealtimeSync() {
  const queryClient = useQueryClient()
  const wsRef = useRef<WebSocket | null>(null)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let destroyed = false

    function connect() {
      if (destroyed) return
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws`)
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { entity: string }
          const keys = ENTITY_QUERY_KEYS[data.entity] ?? []
          keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (!destroyed) {
          retryRef.current = setTimeout(connect, 3000)
        }
      }
    }

    connect()

    return () => {
      destroyed = true
      if (retryRef.current) clearTimeout(retryRef.current)
      wsRef.current?.close()
    }
  }, [queryClient])
}
