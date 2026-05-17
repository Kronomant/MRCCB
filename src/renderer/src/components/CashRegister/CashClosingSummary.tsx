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
    <Box p={4} border="1px solid" borderColor="border" rounded="lg" bg="bg.subtle">
      <Heading size="sm" mb={3}>Resumo de Fechamento</Heading>

      <Stack gap={2}>
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb={1} textTransform="uppercase">Entradas</Text>
          <Flex justify="space-between">
            <Text fontSize="sm">Valor Disponibilizado</Text>
            <Text fontSize="sm" fontWeight="semibold">R$ {availableValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>
        </Box>

        <Separator />

        <Box>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb={1} textTransform="uppercase">Saídas</Text>
          <Stack gap={1}>
            <Flex justify="space-between">
              <Text fontSize="sm">Total de Atendimentos</Text>
              <Text fontSize="sm">R$ {totalAttendances.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            {totalBasketsValue > 0 && (
              <Flex justify="space-between">
                <Text fontSize="sm">Total de Cestas Básicas</Text>
                <Text fontSize="sm">R$ {totalBasketsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
              </Flex>
            )}
            <Flex justify="space-between">
              <Text fontSize="sm">Total de Passagens</Text>
              <Text fontSize="sm">R$ {totalTickets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm">Total de Notas de Gasto</Text>
              <Text fontSize="sm">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
            <Separator borderStyle="dashed" />
            <Flex justify="space-between" fontWeight="bold">
              <Text fontSize="sm">Total de Saídas</Text>
              <Text fontSize="sm">R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </Flex>
          </Stack>
        </Box>

        <Box pt={2} borderTop="2px solid" borderColor="border">
          <Flex justify="space-between" mb={1}>
            <Text fontSize="sm">Saldo Esperado</Text>
            <Text fontSize="sm" fontWeight="bold">R$ {expectedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm">Saldo Físico Contado</Text>
            <Text fontSize="sm" fontWeight="bold">R$ {physicalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </Flex>

          <Flex justify="space-between" align="center" px={3} py={2} rounded="md" bg={status.color} color="white">
            <Stack gap={0}>
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">Diferença</Text>
              <Flex align="center" gap={1}>
                {status.icon}
                <Text fontSize="md" fontWeight="bold">
                  R$ {difference.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </Flex>
            </Stack>
            <Text fontSize="sm" fontWeight="bold">{status.label}</Text>
          </Flex>
        </Box>
      </Stack>
    </Box>
  )
}
