import React from 'react'
import {
  Box,
  Flex,
  Stack,
  Text,
  Heading,
  Separator,
} from '@chakra-ui/react'
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi'

interface CashClosingSummaryProps {
  availableValue: number
  totalAttendances: number
  totalBasketsValue: number
  totalTickets: number
  totalExpenses: number
  physicalValue: number
}

export const CashClosingSummary: React.FC<CashClosingSummaryProps> = ({
  availableValue,
  totalAttendances,
  totalBasketsValue,
  totalTickets,
  totalExpenses,
  physicalValue
}) => {
  const totalOut = totalAttendances + totalBasketsValue + totalTickets + totalExpenses
  const expectedValue = availableValue - totalOut
  const difference = physicalValue - expectedValue

  const getDifferenceStatus = () => {
    if (Math.abs(difference) < 0.01) return { color: 'green.500', icon: <FiCheckCircle />, label: 'Exato' }
    if (Math.abs(difference) < 10) return { color: 'orange.500', icon: <FiAlertTriangle />, label: 'Pequena Diferença' }
    return { color: 'red.500', icon: <FiAlertCircle />, label: 'Diferença Relevante' }
  }

  const status = getDifferenceStatus()

  return (
    <Box p={6} border="1px solid" borderColor="border" rounded="lg" bg="bg.subtle">
      <Heading size="md" mb={6}>Resumo de Fechamento</Heading>
      
      <Stack gap={4}>
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb={2} textTransform="uppercase">Entradas</Text>
          <Flex justify="space-between">
            <Text>Valor Disponibilizado</Text>
            <Text fontWeight="semibold">R$ {availableValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>
        </Box>

        <Separator />

        <Box>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb={2} textTransform="uppercase">Saídas</Text>
          <Stack gap={2}>
            <Flex justify="space-between">
              <Text>Total de Atendimentos</Text>
              <Text>R$ {totalAttendances.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Total de Cestas Básicas</Text>
              <Text>R$ {totalBasketsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Total de Passagens</Text>
              <Text>R$ {totalTickets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Total de Notas de Gasto</Text>
              <Text>R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            <Separator borderStyle="dashed" my={1} />
            <Flex justify="space-between" fontWeight="bold">
              <Text>Total de Saídas</Text>
              <Text>R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
          </Stack>
        </Box>

        <Box pt={4} borderTop="2px solid" borderColor="border">
          <Flex justify="space-between" mb={2}>
            <Text fontSize="lg">Saldo Esperado</Text>
            <Text fontSize="lg" fontWeight="bold">R$ {expectedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>
          <Flex justify="space-between" mb={4}>
            <Text fontSize="lg">Saldo Físico Contado</Text>
            <Text fontSize="lg" fontWeight="bold">R$ {physicalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>
          
          <Separator mb={4} />

          <Flex justify="space-between" align="center" p={4} rounded="md" bg={status.color} color="white">
            <Stack gap={0}>
              <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">Diferença</Text>
              <Flex align="center" gap={2}>
                {status.icon}
                <Text fontSize="xl" fontWeight="bold">
                  R$ {difference.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </Flex>
            </Stack>
            <Text fontWeight="bold">{status.label}</Text>
          </Flex>
        </Box>
      </Stack>
    </Box>
  )
}
