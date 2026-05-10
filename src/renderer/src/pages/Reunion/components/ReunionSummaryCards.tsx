import { Box, Flex, SimpleGrid, Text, Progress } from '@chakra-ui/react'

type Summary = {
  totalGasto: number
  totalAtribuido: number
  entregues: number
  atendimentos: number
  cestas: number
  data: string
}

interface ReunionSummaryCardsProps {
  summary: Summary
  isClosed: boolean
  reunion: Reunion | undefined
}

const MoneyCard = ({ label, value }: { label: string; value: string }) => (
  <Box bg="green.subtle" p={5} rounded="md" minW="160px">
    <Text color="green.fg" fontSize="sm">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize="2xl" color="green.fg">
      {value}
    </Text>
  </Box>
)

const CountCard = ({ label, value }: { label: string; value: string }) => (
  <Box bg="blue.subtle" p={5} rounded="md" minW="160px">
    <Text color="blue.fg" fontSize="sm">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize="2xl" color="blue.fg">
      {value}
    </Text>
  </Box>
)

const NeutralCard = ({ label, value }: { label: string; value: string }) => (
  <Box bg="bg.subtle" p={5} rounded="md" minW="160px">
    <Text color="fg.muted" fontSize="sm">
      {label}
    </Text>
    <Text fontWeight="bold" fontSize="2xl">
      {value}
    </Text>
  </Box>
)

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const ReunionSummaryCards = ({ summary, isClosed, reunion }: ReunionSummaryCardsProps) => {
  const basketValue = reunion?.basketValue ?? 0
  const valorCestas = summary.cestas * basketValue
  const valorTotal = summary.totalGasto + valorCestas
  const deliveryProgress =
    summary.atendimentos > 0 ? (summary.entregues / summary.atendimentos) * 100 : 0

  return (
    <Flex direction="column" gap={3} w="100%">
      {/* Row 1 — Monetary values */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <MoneyCard label="Valor Atribuído" value={formatBRL(summary.totalAtribuido)} />
        <MoneyCard label="Total Atendimentos" value={formatBRL(summary.totalGasto)} />
        <MoneyCard label="Total Cestas" value={formatBRL(valorCestas)} />
        <MoneyCard label="Valor Total" value={formatBRL(valorTotal)} />
      </SimpleGrid>

      {/* Row 2 — Counts + delivery progress */}
      <SimpleGrid columns={{ base: 2, md: isClosed ? 3 : 2 }} gap={4}>
        <CountCard label="Atendimentos" value={String(summary.atendimentos)} />
        <CountCard label="Cestas" value={String(summary.cestas)} />
        {isClosed && (
          <Box bg="orange.subtle" p={5} rounded="md" minW="160px">
            <Text color="orange.fg" fontSize="sm">
              Prontuários Devolvidos
            </Text>
            <Text fontWeight="bold" fontSize="2xl" color="orange.fg">
              {summary.entregues}/{summary.atendimentos}
            </Text>
            <Progress.Root
              mt={2}
              value={deliveryProgress}
              size="sm"
              colorPalette="orange"
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>
        )}
      </SimpleGrid>
    </Flex>
  )
}
