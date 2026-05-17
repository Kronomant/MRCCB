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
  SimpleGrid,
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
import { ClosingModal } from '../../../components/ClosingPDF'
import {
  FiSave,
  FiLock,
  FiFileText,
  FiCheck,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiUnlock,
  FiHelpCircle,
} from 'react-icons/fi'
import { useTutorialContext } from '../../../contexts/TutorialContext'

interface CashRegisterTabProps {
  reunionId: number
  reunionStatus?: string
  summary: {
    totalGasto: number
    cestas: number
    atendimentos: number
  }
  reunionDate?: string
}

type TabView = 'opening' | 'transactions' | 'closing' | 'summary'
type StepState = 'active' | 'completed' | 'locked'

const STEPS: { key: TabView; label: string }[] = [
  { key: 'opening',      label: 'Abertura'    },
  { key: 'transactions', label: 'Lançamentos' },
  { key: 'closing',      label: 'Fechamento'  },
  { key: 'summary',      label: 'Resumo'      },
]

function resolveStepState(
  stepKey: TabView,
  currentView: TabView,
  cashRegister?: { status: string }
): StepState {
  if (stepKey === currentView) return 'active'
  switch (stepKey) {
    case 'opening':
      return cashRegister ? 'completed' : 'locked'
    case 'transactions':
    case 'closing':
      return cashRegister ? 'completed' : 'locked'
    case 'summary':
      return cashRegister?.status === 'closed' ? 'completed' : 'locked'
  }
}

const CashStatCard: React.FC<{
  label: string
  value: string
  accent: string
  icon: React.ElementType
}> = ({ label, value, accent, icon: Icon }) => (
  <Box
    bg="bg.subtle"
    borderTopWidth="3px"
    borderTopColor={accent}
    px={4}
    py={3}
    rounded="md"
    border="1px solid"
    borderColor="border"
  >
    <Flex justify="space-between" align="center" mb={1}>
      <Text fontSize="xs" color="fg.muted" fontWeight="medium">{label}</Text>
      <Box color={accent}><Icon size={14} /></Box>
    </Flex>
    <Text fontWeight="bold" fontSize="lg" lineHeight="tight">{value}</Text>
  </Box>
)

const CashStepper: React.FC<{
  currentView: TabView
  cashRegister?: { status: string }
  onNavigate: (v: TabView) => void
  onHelpClick: () => void
}> = ({ currentView, cashRegister, onNavigate, onHelpClick }) => (
  <Flex id="cash-stepper" align="center" mb={6} p={4} bg="bg.subtle" rounded="lg" border="1px solid" borderColor="border">
    {STEPS.map((step, index) => {
      const state = resolveStepState(step.key, currentView, cashRegister)
      const isClickable = state === 'completed'
      const isLast = index === STEPS.length - 1
      return (
        <React.Fragment key={step.key}>
          <Flex
            id={`cash-step-${step.key}`}
            direction="column"
            align="center"
            flex="0 0 auto"
            gap={1}
            px={2}
            cursor={isClickable ? 'pointer' : 'default'}
            onClick={() => isClickable && onNavigate(step.key)}
          >
            <Box
              w="32px"
              h="32px"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="sm"
              transition="all 0.2s"
              bg={state === 'active' ? 'blue.500' : state === 'completed' ? 'green.500' : undefined}
              color={state === 'locked' ? 'fg.subtle' : 'white'}
              border={state === 'locked' ? '2px solid' : 'none'}
              borderColor="border"
            >
              {state === 'completed' ? <FiCheck size={14} /> : index + 1}
            </Box>
            <Text
              fontSize="xs"
              fontWeight={state === 'active' ? 'bold' : 'medium'}
              whiteSpace="nowrap"
              color={state === 'active' ? 'blue.500' : state === 'completed' ? 'green.500' : 'fg.subtle'}
            >
              {step.label}
            </Text>
          </Flex>
          {!isLast && (
            <Box
              flex="1"
              h="2px"
              mx={1}
              mb={4}
              bg={state === 'completed' ? 'green.500' : 'border'}
              transition="background 0.3s"
            />
          )}
        </React.Fragment>
      )
    })}
    <Box ml="auto" pl={4}>
      <Box
        id="cash-register-help-btn"
        as="button"
        color="fg.muted"
        _hover={{ color: 'blue.500' }}
        transition="color 0.2s"
        title="Ajuda e Tutorial"
        onClick={onHelpClick}
        display="flex"
        alignItems="center"
      >
        <FiHelpCircle size={18} />
      </Box>
    </Box>
  </Flex>
)

export const CashRegisterTab: React.FC<CashRegisterTabProps> = ({
  reunionId,
  summary,
  reunionDate,
}) => {
  const {
    cashRegister,
    isLoading: isRegLoading,
    createCashRegister,
    updateOpening,
    closeCashRegister,
    reopenCashRegister
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

  const { startTutorial, hasSeenTutorial } = useTutorialContext()

  const [view, setView] = useState<TabView>('opening')
  const [openingValues, setOpeningValues] = useState({
    openingValue: 0,
    availableValue: 0
  })
  const [closingPhysicalValue, setClosingPhysicalValue] = useState(0)
  const [openingCounts, setOpeningCounts] = useState<Record<number, number>>({})
  const [closingCounts, setClosingCounts] = useState<Record<number, number>>({})
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  const handleHelpClick = () => startTutorial('cashRegister')

  useEffect(() => {
    if (!hasSeenTutorial('cashRegister')) {
      startTutorial('cashRegister')
    }
  }, [])

  useEffect(() => {
    if (cashRegister) {
      if (cashRegister.status === 'closed') {
        setView('summary')
      } else {
        setView('transactions')
      }
      setOpeningValues({
        openingValue: cashRegister.openingValue,
        availableValue: cashRegister.availableValue
      })
      if (cashRegister.openingCounts) setOpeningCounts(cashRegister.openingCounts)
      if (cashRegister.closingCounts) setClosingCounts(cashRegister.closingCounts)
      if (cashRegister.closingValue != null) setClosingPhysicalValue(cashRegister.closingValue)
    } else {
      setView('opening')
    }
  }, [cashRegister])

  const saldoDisponivel = cashRegister?.availableValue || 0
  const totalSaidas = summary.totalGasto + totalTickets + totalExpenses
  const saldoEstimado = saldoDisponivel - totalSaidas
  const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const handleCreateOpening = async () => {
    await createCashRegister.mutateAsync({
      reunionId,
      openingValue: openingValues.openingValue,
      availableValue: openingValues.availableValue,
      openingCounts
    })
  }

  const handleUpdateOpening = async () => {
    await updateOpening.mutateAsync({
      id: cashRegister!.id!,
      data: {
        openingValue: openingValues.openingValue,
        availableValue: openingValues.availableValue,
        openingCounts
      }
    })
    setView('transactions')
  }

  const handleReopen = async () => {
    await reopenCashRegister.mutateAsync(cashRegister!.id)
    setView('closing')
  }

  const handleClose = async () => {
    const totalOut = summary.totalGasto + totalTickets + totalExpenses
    const expectedValue = (cashRegister?.availableValue || 0) - totalOut
    const difference = closingPhysicalValue - expectedValue

    await closeCashRegister.mutateAsync({
      id: cashRegister!.id,
      data: {
        closingValue: closingPhysicalValue,
        difference,
        closingCounts
      }
    })
    setView('summary')
  }

  if (isRegLoading) return <Text>Carregando caixa...</Text>

  // --- VIEW: ABERTURA ---
  if (view === 'opening') {
    return (
      <Stack gap={0} h="100%">
        <CashStepper currentView={view} cashRegister={cashRegister} onNavigate={setView} onHelpClick={handleHelpClick} />
        <Box flex="1" overflowY="auto" minH="0" pb={4}>
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            <GridItem colSpan={7}>
              <CashCountGrid
                onTotalChange={(total: number) => setOpeningValues(prev => ({ ...prev, openingValue: total }))}
                onCountsChange={setOpeningCounts}
                initialCounts={cashRegister?.openingCounts}
              />
            </GridItem>
            <GridItem colSpan={5}>
              <Stack gap={6} p={6} border="1px solid" borderColor="border" rounded="lg" bg="bg.subtle">
                <Heading size="md">{cashRegister ? 'Editar Abertura' : 'Abertura de Caixa'}</Heading>
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
                  {cashRegister ? (
                    <Button
                      colorPalette="blue"
                      size="lg"
                      onClick={handleUpdateOpening}
                      loading={updateOpening.isPending}
                      disabled={openingValues.availableValue <= 0}
                    >
                      <FiSave style={{ marginRight: '8px' }} /> Salvar Alterações
                    </Button>
                  ) : (
                    <Button
                      colorPalette="blue"
                      size="lg"
                      onClick={handleCreateOpening}
                      loading={createCashRegister.isPending}
                      disabled={openingValues.availableValue <= 0}
                    >
                      <FiSave style={{ marginRight: '8px' }} /> Abrir Caixa
                    </Button>
                  )}
                </Stack>
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </Stack>
    )
  }

  // --- VIEW: LANÇAMENTOS (TRANSACTIONS) ---
  if (view === 'transactions') {
    return (
      <Stack gap={0} h="100%">
        <CashStepper currentView={view} cashRegister={cashRegister} onNavigate={setView} onHelpClick={handleHelpClick} />
        <Box flex="1" overflowY="auto" minH="0" pb={4}>

          <SimpleGrid columns={4} gap={3} mb={6}>
            <CashStatCard
              label="Saldo Disponível"
              value={formatBRL(saldoDisponivel)}
              accent="blue.500"
              icon={FiDollarSign}
            />
            <CashStatCard
              label="Total Passagens"
              value={formatBRL(totalTickets)}
              accent="purple.500"
              icon={FiTrendingUp}
            />
            <CashStatCard
              label="Total Despesas"
              value={formatBRL(totalExpenses)}
              accent="orange.500"
              icon={FiTrendingDown}
            />
            <CashStatCard
              label="Saldo Estimado"
              value={formatBRL(saldoEstimado)}
              accent={saldoEstimado >= 0 ? 'green.500' : 'red.500'}
              icon={FiActivity}
            />
          </SimpleGrid>

          <Flex
            justify="space-between"
            align="center"
            mb={5}
            p={4}
            bg="bg.subtle"
            border="1px solid"
            borderColor="border"
            borderLeft="4px solid"
            borderLeftColor="blue.500"
            rounded="md"
          >
            <Box>
              <Heading size="sm">Controle de Fluxo</Heading>
              <Text color="fg.muted" fontSize="sm">Registre as passagens e notas de gasto da reunião.</Text>
            </Box>
            <Button colorPalette="orange" variant="outline" size="sm" onClick={() => setView('closing')}>
              <FiLock style={{ marginRight: '8px' }} /> Fechar Caixa
            </Button>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Box
                h="100%"
                border="1px solid"
                borderColor="border"
                borderTop="3px solid"
                borderTopColor="blue.500"
                rounded="lg"
                p={4}
              >
                <Box mb={4}>
                  <Heading size="sm" color="blue.500">Passagens de Voluntários</Heading>
                  <Text fontSize="xs" color="fg.muted">Transporte de voluntários em trânsito</Text>
                </Box>
                <CashTicketForm
                  tickets={tickets}
                  onAdd={(data: any) => createTicket.mutate({
                    ...data,
                    reunionId,
                    cashRegisterId: cashRegister!.id
                  })}
                  onDelete={(id: number) => deleteTicket.mutate(id)}
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box
                h="100%"
                border="1px solid"
                borderColor="border"
                borderTop="3px solid"
                borderTopColor="orange.500"
                rounded="lg"
                p={4}
              >
                <Box mb={4}>
                  <Heading size="sm" color="orange.500">Notas de Gasto</Heading>
                  <Text fontSize="xs" color="fg.muted">Despesas avulsas com nota fiscal</Text>
                </Box>
                <CashExpenseForm
                  expenses={expenses}
                  onAdd={(data: any) => createExpense.mutate({
                    ...data,
                    reunionId,
                    cashRegisterId: cashRegister!.id
                  })}
                  onDelete={(id: number) => deleteExpense.mutate(id)}
                />
              </Box>
            </GridItem>
          </Grid>

        </Box>
      </Stack>
    )
  }

  // --- VIEW: FECHAMENTO (CLOSING) ---
  if (view === 'closing') {
    return (
      <Stack gap={0} h="100%">
        <CashStepper currentView={view} cashRegister={cashRegister} onNavigate={setView} onHelpClick={handleHelpClick} />
        <Box flex="1" overflowY="auto" minH="0" pb={4}>
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            <GridItem colSpan={7}>
              <CashCountGrid
                onTotalChange={(total: number) => setClosingPhysicalValue(total)}
                onCountsChange={setClosingCounts}
                initialCounts={cashRegister?.closingCounts}
              />
            </GridItem>
            <GridItem colSpan={5}>
              <Stack gap={6}>
                <CashClosingSummary
                  availableValue={cashRegister!.availableValue}
                  totalAttendances={summary.totalGasto}
                  totalBasketsValue={0}
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
        </Box>
      </Stack>
    )
  }

  // --- VIEW: RESUMO FINAL (SUMMARY) ---
  if (view === 'summary') {
    return (
      <Stack gap={0} h="100%">
        <CashStepper currentView={view} cashRegister={cashRegister} onNavigate={setView} onHelpClick={handleHelpClick} />
        <Box flex="1" overflowY="auto" minH="0" pb={4}>
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md">Caixa Encerrado</Heading>
              <Text color="fg.muted">O relatório financeiro desta reunião está pronto.</Text>
            </Box>
            <Flex gap={2}>
              <Button colorPalette="orange" variant="outline" onClick={handleReopen} loading={reopenCashRegister.isPending}>
                <FiUnlock style={{ marginRight: '8px' }} /> Reabrir Caixa
              </Button>
              <Button colorPalette="green" onClick={() => setIsPDFModalOpen(true)}>
                <FiFileText style={{ marginRight: '8px' }} /> Exportar Fechamento (PDF)
              </Button>
            </Flex>
          </Flex>

          <Separator mb={6} />

          <Box maxW="600px" mx="auto" w="100%">
            <CashClosingSummary
              availableValue={cashRegister!.availableValue}
              totalAttendances={summary.totalGasto}
              totalBasketsValue={0}
              totalTickets={totalTickets}
              totalExpenses={totalExpenses}
              physicalValue={cashRegister!.closingValue || 0}
            />
          </Box>
        </Box>

        {cashRegister && (
          <ClosingModal
            isOpen={isPDFModalOpen}
            onClose={() => setIsPDFModalOpen(false)}
            cashRegister={cashRegister}
            tickets={tickets}
            expenses={expenses}
            summary={summary}
            reunionDate={reunionDate}
          />
        )}
      </Stack>
    )
  }

  return null
}
