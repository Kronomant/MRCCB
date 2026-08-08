import { Box, Flex, SimpleGrid, Text, Progress } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiTrendingUp,
  FiUsers,
  FiGift,
  FiClipboard,
} from 'react-icons/fi'

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

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

interface StatCardProps {
  label: string
  value: string
  accent: string
  icon: IconType
  sub?: React.ReactNode
}

const StatCard = ({ label, value, accent, icon: Icon, sub }: StatCardProps) => (
  <Box
    bg="bg.subtle"
    borderTopWidth="3px"
    borderTopStyle="solid"
    borderTopColor={accent}
    px={3}
    py={2.5}
    rounded="md"
    minW={0}
    transition="background 0.15s ease"
    _hover={{ bg: accent.replace('.500', '.subtle') }}
  >
    <Flex justify="space-between" align="center" mb={1}>
      <Text fontSize="xs" color="fg.muted" fontWeight="medium" truncate flex={1}>
        {label}
      </Text>
      <Box color={accent} flexShrink={0} ml={1}>
        <Icon size={14} />
      </Box>
    </Flex>
    <Text fontWeight="bold" fontSize="lg" lineHeight="tight" truncate>
      {value}
    </Text>
    {sub}
  </Box>
)

export const ReunionSummaryCards = ({ summary, isClosed, reunion }: ReunionSummaryCardsProps) => {
  const basketValue = reunion?.basketValue ?? 0
  const valorCestas = summary.cestas * basketValue
  const valorTotal = summary.totalGasto + valorCestas
  const deliveryProgress =
    summary.atendimentos > 0 ? (summary.entregues / summary.atendimentos) * 100 : 0

  return (
    <SimpleGrid columns={{ base: 2, sm: 3, lg: isClosed ? 7 : 6 }} gap={3} w="100%">
      <StatCard label="Valor Atribuído" value={formatBRL(summary.totalAtribuido)} accent="purple.500" icon={FiDollarSign} />
      <StatCard label="Total Atendimentos" value={formatBRL(summary.totalGasto)} accent="green.500" icon={FiShoppingBag} />
      <StatCard label="Total Cestas" value={formatBRL(valorCestas)} accent="teal.500" icon={FiPackage} />
      <StatCard label="Valor Total" value={formatBRL(valorTotal)} accent="blue.500" icon={FiTrendingUp} />
      <StatCard label="Atendimentos" value={String(summary.atendimentos)} accent="cyan.500" icon={FiUsers} />
      <StatCard label="Cestas" value={String(summary.cestas)} accent="orange.500" icon={FiGift} />
      {isClosed && (
        <StatCard
          label="Prontuários Devolvidos"
          value={`${summary.entregues} / ${summary.atendimentos}`}
          accent="red.500"
          icon={FiClipboard}
          sub={
            <Progress.Root mt={1.5} value={deliveryProgress} size="xs" colorPalette="red">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          }
        />
      )}
    </SimpleGrid>
  )
}
