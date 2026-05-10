import type { ReunionStatus } from './reunion-status'

declare global {
  interface Reunion {
    id: number
    name: string
    value: number
    basketValue: number
    treatmentQuantity: number
    foodBasketQuantity: number
    returnedQuantity?: number
    date: string
    status: ReunionStatus
    totalAtendimentoValue?: number
    totalBasketValue?: number
    deliveredQuantity?: number
  }

  interface Unity {
    id: number
    name: string
    createdAt: string
    updatedAt: string
  }

  interface Prontuario {
    id: number
    number: number
    unityId: number
    ministry: boolean
    createdAt: string
    updatedAt: string
    status: 'active' | 'inactive'
  }

  interface Atendimento {
    id: number
    prontuarioId: number
    prontuarioNumber: number
    reunionId: number
    date: string
    aprovedValue: boolean
    value: number
    foodBasketQuantity: number
    onlyClothes: boolean
    emergency: boolean
    representacao: boolean
    devolvido: boolean
    repeat: boolean
    ministerio: boolean
    createdAt: string
    updatedAt: string
  }

  interface Enchiridion {
    id: number
    number: number
    unityId: number
    ministry: boolean
  }

  interface Treatment {
    id: number
    enchiridionId: number
    reunionId: number
    unityId: number
    date: string
    aprovedValue: boolean
    value: number
    foodBasketQuantity: number
    onlyClothes: boolean
    emergency: boolean
    returned: boolean
    repeat: boolean
  }

  interface FoodBasket {
    id: number
    date: string
    exit: boolean
  }

  interface DropboxBackup {
    id: number
    dropboxAccount: string
    backupPath: string
  }

  type ProntuarioDeliveryStatus = 'pendente' | 'entregue' | 'devolvido'

  interface ProntuarioDeliveryData {
    id?: number
    prontuarioId: number
    reunionId: number
    status: ProntuarioDeliveryStatus
    deliveredAt?: string
    deliveredBy?: string
    returnedAt?: string
    returnedBy?: string
    createdAt?: string
    updatedAt?: string
  }

  type Column<T> = {
    header: string
    accessor?: keyof T
    customRender?: (row: T) => React.ReactNode
  }

  // Tipos auxiliares para Prontuario
  type CreateProntuario = Omit<Prontuario, 'id' | 'createdAt' | 'updatedAt'>
  type UpdateProntuario = Partial<CreateProntuario>

  // Tipos auxiliares para Atendimento
  type CreateAtendimento = Omit<Atendimento, 'id' | 'createdAt' | 'updatedAt'>
  type UpdateAtendimento = Partial<CreateAtendimento>

  // Tipos auxiliares para Unity
  type CreateUnity = Omit<Unity, 'id' | 'createdAt' | 'updatedAt'>
  type UpdateUnity = Partial<CreateUnity>

  // --- CASH REGISTER TYPES ---

  interface CashRegister {
    id: number
    reunionId: number
    openingValue: number
    availableValue: number
    closingValue: number | null
    closingDifference: number | null
    status: 'open' | 'closed'
    createdAt: string
    updatedAt: string
  }

  interface CashTicket {
    id: number
    cashRegisterId: number
    reunionId: number
    volunteerName?: string | null
    value: number
    notes?: string | null
    createdAt: string
  }

  interface CashExpense {
    id: number
    cashRegisterId: number
    reunionId: number
    establishmentName: string
    nfeNumber?: string | null
    category: 'fuel' | 'food' | 'small_goods' | 'maintenance'
    value: number
    notes?: string | null
    createdAt: string
  }

  type CreateCashRegister = Omit<CashRegister, 'id' | 'createdAt' | 'updatedAt' | 'closingValue' | 'closingDifference' | 'status'>
  type CreateCashTicket = Omit<CashTicket, 'id' | 'createdAt'>
  type CreateCashExpense = Omit<CashExpense, 'id' | 'createdAt'>
}

export enum ReunionStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished'
}

export {}
