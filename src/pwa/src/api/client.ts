const BASE = ''

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  reunions: {
    list: (params?: { startDate?: string; endDate?: string; status?: string }) => {
      const qs = new URLSearchParams()
      if (params?.startDate) qs.set('startDate', params.startDate)
      if (params?.endDate) qs.set('endDate', params.endDate)
      if (params?.status) qs.set('status', params.status)
      const q = qs.toString()
      return get<Reunion[]>(`/api/reunions${q ? `?${q}` : ''}`)
    },
    get: (id: number) => get<Reunion>(`/api/reunions/${id}`)
  },
  atendimentos: {
    list: () => get<Atendimento[]>('/api/atendimentos'),
    byReunion: (reunionId: number) => get<Atendimento[]>(`/api/atendimentos/reunion/${reunionId}`),
    byProntuario: (prontuarioId: number) => get<Atendimento[]>(`/api/atendimentos/prontuario/${prontuarioId}`)
  },
  prontuarios: {
    list: () => get<Prontuario[]>('/api/prontuarios'),
    active: () => get<Prontuario[]>('/api/prontuarios/active'),
    get: (id: number) => get<Prontuario>(`/api/prontuarios/${id}`)
  },
  unities: {
    list: () => get<Unity[]>('/api/unities'),
    get: (id: number) => get<Unity>(`/api/unities/${id}`)
  },
  deliveries: {
    byReunion: (reunionId: number) => get<Delivery[]>(`/api/deliveries/reunion/${reunionId}`),
    byProntuario: (prontuarioId: number) => get<Delivery[]>(`/api/deliveries/prontuario/${prontuarioId}`)
  },
  cash: {
    register: (reunionId: number) => get<CashRegister | null>(`/api/cash/register/reunion/${reunionId}`),
    tickets: (reunionId: number) => get<CashTicket[]>(`/api/cash/tickets/reunion/${reunionId}`),
    expenses: (reunionId: number) => get<CashExpense[]>(`/api/cash/expenses/reunion/${reunionId}`)
  }
}

export interface Reunion {
  id: number
  name: string
  value: number
  basketValue: number
  treatmentQuantity: number
  foodBasketQuantity: number
  date: string
  status: string
  totalAtendimentoValue?: number
  totalBasketValue?: number
  deliveredQuantity?: number
}

export interface Atendimento {
  id: number
  prontuarioId: number
  reunionId: number
  date: string
  aprovedValue: number
  value: number
  foodBasketQuantity: number
  onlyClothes: number
  emergency: number
  representacao: number
  devolvido: number
  repeat: number
  ministerio: number
  roupas: number
  prontuarioNumber: number
  createdAt: string
  updatedAt: string
}

export interface Prontuario {
  id: number
  number: number
  unityId: number
  ministry: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface Unity {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Delivery {
  id: number
  prontuarioId: number
  reunionId: number
  status: string
  deliveredAt?: string
  deliveredBy?: string
  returnedAt?: string
  returnedBy?: string
  createdAt: string
  updatedAt: string
}

export interface CashRegister {
  id: number
  reunionId: number
  openingValue: number
  availableValue: number
  closingValue?: number
  closingDifference?: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface CashTicket {
  id: number
  cashRegisterId: number
  reunionId: number
  volunteerName?: string
  value: number
  notes?: string
  createdAt: string
}

export interface CashExpense {
  id: number
  cashRegisterId: number
  reunionId: number
  establishmentName: string
  nfeNumber?: string
  category: string
  value: number
  notes?: string
  createdAt: string
}
