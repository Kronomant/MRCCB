import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { Input, CurrencyInput } from '../../components'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

interface Ticket {
  id?: number
  volunteerName?: string | null
  value: number
  notes?: string | null
}

interface CashTicketFormProps {
  tickets: Ticket[]
  onAdd: (ticket: Omit<Ticket, 'id'>) => void
  onDelete: (id: number) => void
  isReadOnly?: boolean
}

export const CashTicketForm: React.FC<CashTicketFormProps> = ({
  tickets,
  onAdd,
  onDelete,
  isReadOnly = false
}) => {
  const [formData, setFormData] = useState({
    volunteerName: '',
    value: 0,
    notes: ''
  })

  const total = tickets.reduce((acc, t) => acc + t.value, 0)

  const handleAdd = () => {
    if (formData.value <= 0) return
    onAdd(formData as Omit<Ticket, 'id'>)
    setFormData({ volunteerName: '', value: 0, notes: '' })
  }

  return (
    <Stack gap={6}>
      <Box p={5} border="1px solid" borderColor="border" rounded="md" bg="bg.subtle">
        <Heading size="sm" mb={4}>Lançar Passagem</Heading>
        <Stack gap={4}>
          <Input
            label="Nome do Voluntário"
            value={formData.volunteerName ?? ''}
            onChange={(e) => setFormData({ ...formData, volunteerName: e.target.value })}
            disabled={isReadOnly}
          />
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
            disabled={formData.value <= 0 || isReadOnly}
          >
            <FiPlus style={{ marginRight: '8px' }} /> Adicionar Passagem
          </Button>
        </Stack>
      </Box>

      <Box>
        <Flex justify="space-between" align="baseline" mb={3}>
          <Heading size="sm">Registros</Heading>
          <Text fontWeight="bold">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
        </Flex>
        
        {tickets.length === 0 ? (
          <Text color="fg.muted" textAlign="center" py={4}>Nenhum registro encontrado</Text>
        ) : (
          <VStack gap={2} align="stretch">
            {tickets.map((t, index) => (
              <Flex
                key={t.id || index}
                p={3}
                rounded="md"
                bg="bg.muted"
                justify="space-between"
                align="center"
              >
                <Box>
                  <Text fontWeight="medium">{t.volunteerName || 'Voluntário não identificado'}</Text>
                  {t.notes && <Text fontSize="xs" color="fg.muted">{t.notes}</Text>}
                </Box>
                <Flex align="center" gap={4}>
                  <Text fontWeight="bold">R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
                  {!isReadOnly && t.id && (
                    <Button
                      size="xs"
                      colorPalette="red"
                      variant="ghost"
                      onClick={() => onDelete(t.id!)}
                    >
                      <FiTrash2 />
                    </Button>
                  )}
                </Flex>
              </Flex>
            ))}
          </VStack>
        )}
      </Box>
    </Stack>
  )
}
