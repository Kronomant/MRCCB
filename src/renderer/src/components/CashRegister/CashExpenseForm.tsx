import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Heading,
  VStack,
  Badge,
} from '@chakra-ui/react'
import { Input, CurrencyInput, Select } from '../../components'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

export type ExpenseCategory = 'fuel' | 'food' | 'small_goods' | 'maintenance'

interface Expense {
  id?: number
  establishmentName: string
  nfeNumber?: string | null
  category: ExpenseCategory
  value: number
  notes?: string | null
}

interface CashExpenseFormProps {
  expenses: Expense[]
  onAdd: (expense: Omit<Expense, 'id'>) => void
  onDelete: (id: number) => void
  isReadOnly?: boolean
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  fuel: 'Combustível',
  food: 'Alimentação',
  small_goods: 'Bens de Pequeno Valor',
  maintenance: 'Manutenção'
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  fuel: 'orange',
  food: 'green',
  small_goods: 'purple',
  maintenance: 'blue'
}

export const CashExpenseForm: React.FC<CashExpenseFormProps> = ({
  expenses,
  onAdd,
  onDelete,
  isReadOnly = false
}) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    establishmentName: '',
    nfeNumber: '',
    category: 'food',
    value: 0,
    notes: ''
  })

  const total = expenses.reduce((acc, e) => acc + e.value, 0)

  // Subtotais por categoria
  const subtotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.value
    return acc
  }, {} as Record<string, number>)

  const handleAdd = () => {
    if (formData.establishmentName === '' || formData.value <= 0) return
    onAdd(formData as Omit<Expense, 'id'>)
    setFormData({
      establishmentName: '',
      nfeNumber: '',
      category: 'food',
      value: 0,
      notes: ''
    })
  }

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value
  }))

  return (
    <Stack gap={6}>
      <Box p={5} border="1px solid" borderColor="border" rounded="md" bg="bg.subtle">
        <Heading size="sm" mb={4}>Lançar Nota de Gasto</Heading>
        <Stack gap={4}>
          <Input
            label="Estabelecimento"
            value={formData.establishmentName}
            onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
            disabled={isReadOnly}
          />
          <Flex gap={4}>
            <Box flex={1}>
              <Select
                label="Categoria"
                placeholder="Selecione a categoria"
                options={categoryOptions}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val as ExpenseCategory })}
              />
            </Box>
            <Box flex={1}>
              <Input
                label="Número NF-e"
                value={formData.nfeNumber ?? ''}
                onChange={(e) => setFormData({ ...formData, nfeNumber: e.target.value })}
                disabled={isReadOnly}
              />
            </Box>
          </Flex>
          <CurrencyInput
            label="Valor"
            value={formData.value}
            onChange={(val) => setFormData({ ...formData, value: val })}
            disabled={isReadOnly}
          />
          <Input
            label="Observação"
            value={formData.notes ?? ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={isReadOnly}
          />
          <Button
            colorScheme="blue"
            onClick={handleAdd}
            disabled={formData.establishmentName === '' || formData.value <= 0 || isReadOnly}
          >
            <FiPlus style={{ marginRight: '8px' }} /> Adicionar Nota
          </Button>
        </Stack>
      </Box>

      {expenses.length > 0 && (
        <Box>
          <Heading size="sm" mb={3}>Resumo por Categoria</Heading>
          <Flex gap={4} wrap="wrap" mb={6}>
            {Object.entries(subtotals).map(([cat, val]) => (
              <Box key={cat} p={3} rounded="md" bg="bg.muted" border="1px solid" borderColor="border" minW="150px">
                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="bold">
                  {CATEGORY_LABELS[cat as ExpenseCategory]}
                </Text>
                <Text fontWeight="bold">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
              </Box>
            ))}
          </Flex>

          <Flex justify="space-between" align="baseline" mb={3}>
            <Heading size="sm">Registros</Heading>
            <Text fontWeight="bold">Total Geral: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>
          
          <VStack gap={2} align="stretch">
            {expenses.map((e, index) => (
              <Flex
                key={e.id || index}
                p={3}
                rounded="md"
                bg="bg.muted"
                justify="space-between"
                align="center"
              >
                <Box>
                  <Flex align="center" gap={2}>
                    <Text fontWeight="medium">{e.establishmentName}</Text>
                    <Badge colorPalette={CATEGORY_COLORS[e.category]}>
                      {CATEGORY_LABELS[e.category]}
                    </Badge>
                  </Flex>
                  <Text fontSize="xs" color="fg.muted">
                    {e.nfeNumber ? `NF-e: ${e.nfeNumber}` : 'Sem NF-e'} 
                    {e.notes && ` • ${e.notes}`}
                  </Text>
                </Box>
                <Flex align="center" gap={4}>
                  <Text fontWeight="bold">R$ {e.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
                  {!isReadOnly && e.id && (
                    <Button
                      size="xs"
                      colorPalette="red"
                      variant="ghost"
                      onClick={() => onDelete(e.id!)}
                    >
                      <FiTrash2 />
                    </Button>
                  )}
                </Flex>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}
    </Stack>
  )
}
