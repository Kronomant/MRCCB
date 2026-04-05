import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Heading,
  Separator,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import {
  CashCountGrid,
  CashTicketForm,
  CashExpenseForm,
  CashClosingSummary
} from '../../../components/CashRegister'
import { useCashRegister } from '../../../hooks/cash/useCashRegister'
import { useCashTickets } from '../../../hooks/cash/useCashTickets'
import { useCashExpenses } from '../../../hooks/cash/useCashExpenses'
import { CurrencyInput } from '../../../components'
import { FiSave, FiLock, FiFileText, FiArrowLeft } from 'react-icons/fi'

interface CashRegisterTabProps {
  reunionId: number
  reunionStatus?: string
  summary: {
    totalGasto: number
    cestas: number
  }
  basketValue: number
}

type TabView = 'opening' | 'transactions' | 'closing' | 'summary'

export const CashRegisterTab: React.FC<CashRegisterTabProps> = ({
  reunionId,
  reunionStatus,
  summary,
  basketValue
}) => {
  const {
    cashRegister,
    isLoading: isRegLoading,
    createCashRegister,
    updateOpening,
    closeCashRegister
  } = useCashRegister(reunionId)
  
  const {
    tickets,
    totalTickets,
    createTicket,
    deleteTicket
  } = useCashTickets(reunionId)
  
  const {
    expenses,
    totalExpenses,
    createExpense,
    deleteExpense
  } = useCashExpenses(reunionId)

  const [view, setView] = useState<TabView>('opening')
  const [openingValues, setOpeningValues] = useState({
    openingValue: 0,
    availableValue: 0
  })
  const [closingPhysicalValue, setClosingPhysicalValue] = useState(0)

  // Sincronizar view inicial com status do caixa
  useEffect(() => {
    if (cashRegister) {
      if (cashRegister.status === 'closed') {
        setView('summary')
      } else {
        setView('transactions')
      }
    } else {
      setView('opening')
    }
  }, [cashRegister])

  const handleCreateOpening = async () => {
    await createCashRegister.mutateAsync({
      reunionId,
      openingValue: openingValues.openingValue,
      availableValue: openingValues.availableValue
    })
  }

  const handleClose = async () => {
    const totalOut = summary.totalGasto + (summary.cestas * basketValue) + totalTickets + totalExpenses
    const expectedValue = (cashRegister?.availableValue || 0) - totalOut
    const difference = closingPhysicalValue - expectedValue

    await closeCashRegister.mutateAsync({
      id: cashRegister!.id,
      data: {
        closingValue: closingPhysicalValue,
        difference
      }
    })
    setView('summary')
  }

  if (isRegLoading) return <Text>Carregando caixa...</Text>

  // --- VIEW: ABERTURA ---
  if (view === 'opening') {
    return (
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={7}>
          <CashCountGrid
            onTotalChange={(total: number) => setOpeningValues(prev => ({ ...prev, openingValue: total }))}
          />
        </GridItem>
        <GridItem colSpan={5}>
          <Stack gap={6} p={6} border="1px solid" borderColor="border" rounded="lg" bg="bg.subtle">
            <Heading size="md">Abertura de Caixa</Heading>
            <Stack gap={4}>
              <CurrencyInput
                label="Valor Total em Caixa"
                value={openingValues.openingValue}
                onChange={(val: number) => setOpeningValues(prev => ({ ...prev, openingValue: val }))}
              />
              <CurrencyInput
                label="Valor Disponibilizado para Reunião"
                value={openingValues.availableValue}
                onChange={(val: number) => setOpeningValues(prev => ({ ...prev, availableValue: val }))}
              />
              <Text fontSize="sm" color="fg.muted">
                O valor disponibilizado será a base para o cálculo de saldo final (Entradas).
              </Text>
              <Button
                colorPalette="blue"
                size="lg"
                onClick={handleCreateOpening}
                loading={createCashRegister.isPending}
                disabled={openingValues.availableValue <= 0}
              >
                <FiSave style={{ marginRight: '8px' }} /> Abrir Caixa
              </Button>
            </Stack>
          </Stack>
        </GridItem>
      </Grid>
    )
  }

  // --- VIEW: LANÇAMENTOS (TRANSACTIONS) ---
  if (view === 'transactions') {
    return (
      <Stack gap={8}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md">Controle de Fluxo</Heading>
            <Text color="fg.muted">Registre as passagens e notas de gasto da reunião.</Text>
          </Box>
          <Button colorPalette="orange" variant="outline" onClick={() => setView('closing')}>
            <FiLock style={{ marginRight: '8px' }} /> Fechar Caixa
          </Button>
        </Flex>

        <Separator />

        <Grid templateColumns="repeat(2, 1fr)" gap={8}>
          <GridItem>
            <Heading size="sm" mb={4} color="blue.500">Passagens de Voluntários</Heading>
            <CashTicketForm
              tickets={tickets}
              onAdd={(data: any) => createTicket.mutate({
                ...data,
                reunionId,
                cashRegisterId: cashRegister!.id
              })}
              onDelete={(id: number) => deleteTicket.mutate(id)}
            />
          </GridItem>
          <GridItem>
            <Heading size="sm" mb={4} color="orange.500">Notas de Gasto</Heading>
            <CashExpenseForm
              expenses={expenses}
              onAdd={(data: any) => createExpense.mutate({
                ...data,
                reunionId,
                cashRegisterId: cashRegister!.id
              })}
              onDelete={(id: number) => deleteExpense.mutate(id)}
            />
          </GridItem>
        </Grid>
      </Stack>
    )
  }

  // --- VIEW: FECHAMENTO (CLOSING) ---
  if (view === 'closing') {
    return (
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Button variant="ghost" mb={4} onClick={() => setView('transactions')}>
            <FiArrowLeft style={{ marginRight: '8px' }} /> Voltar para Lançamentos
          </Button>
        </GridItem>
        <GridItem colSpan={7}>
          <CashCountGrid
            onTotalChange={(total: number) => setClosingPhysicalValue(total)}
          />
        </GridItem>
        <GridItem colSpan={5}>
          <Stack gap={6}>
            <CashClosingSummary
              availableValue={cashRegister!.availableValue}
              totalAttendances={summary.totalGasto}
              totalBasketsValue={summary.cestas * basketValue}
              totalTickets={totalTickets}
              totalExpenses={totalExpenses}
              physicalValue={closingPhysicalValue}
            />
            <Button
              colorPalette="red"
              size="lg"
              onClick={handleClose}
              loading={closeCashRegister.isPending}
            >
              <FiLock style={{ marginRight: '8px' }} /> Confirmar Fechamento
            </Button>
          </Stack>
        </GridItem>
      </Grid>
    )
  }

  // --- VIEW: RESUMO FINAL (SUMMARY) ---
  if (view === 'summary') {
    return (
      <Stack gap={8}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="md">Caixa Encerrado</Heading>
            <Text color="fg.muted">O relatório financeiro desta reunião está pronto.</Text>
          </Box>
          <Button colorPalette="green">
            <FiFileText style={{ marginRight: '8px' }} /> Exportar Fechamento (PDF)
          </Button>
        </Flex>

        <Separator />

        <Box maxW="600px" mx="auto" w="100%">
          <CashClosingSummary
            availableValue={cashRegister!.availableValue}
            totalAttendances={summary.totalGasto}
            totalBasketsValue={summary.cestas * basketValue}
            totalTickets={totalTickets}
            totalExpenses={totalExpenses}
            physicalValue={cashRegister!.closingValue || 0}
          />
        </Box>
      </Stack>
    )
  }

  return null
}
