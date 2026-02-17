import { Line } from 'react-chartjs-2'
import { Box, Skeleton, Center, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useDashboardData } from '../../../hooks/useDashboardData'
import {
  subDays,
  format,
  parseISO,
  isSameDay,
  eachDayOfInterval,
  startOfDay,
  endOfDay
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useColorModeValue } from '../../../components/ui/color-mode'

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#E7E9ED',
  '#71B37C',
  '#EC932F',
  '#52514E'
]

export const LineChart = () => {
  const { atendimentos, prontuarios, unities, isLoading } = useDashboardData()
  const textColor = useColorModeValue('gray.800', 'white')

  const chartData = useMemo(() => {
    if (isLoading) return null

    const end = endOfDay(new Date())
    const start = subDays(startOfDay(new Date()), 29) // Last 30 days
    const days = eachDayOfInterval({ start, end })

    const unityMap = new Map<number, string>()
    unities.forEach((u: Unity) => unityMap.set(u.id, u.name))

    const prontuarioUnityMap = new Map<number, number>()
    prontuarios.forEach((p: Prontuario) => prontuarioUnityMap.set(p.id, p.unityId))

    // Prepare datasets
    const datasets = unities.map((u: Unity, index: number) => {
      const data = days.map((day) => {
        // Count atendimentos for this unity on this day
        return atendimentos.filter((a: Atendimento) => {
          try {
            const aDate = parseISO(a.date)
            const uId = prontuarioUnityMap.get(a.prontuarioId)
            return uId === u.id && isSameDay(aDate, day)
          } catch {
            return false
          }
        }).length
      })

      return {
        label: u.name,
        data: data,
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    })

    return {
      labels: days.map((d) => format(d, 'dd/MM', { locale: ptBR })),
      datasets: datasets
    }
  }, [atendimentos, prontuarios, unities, isLoading])

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: textColor, usePointStyle: true }
      },
      title: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: textColor }
      },
      x: {
        ticks: { color: textColor }
      }
    }
  }

  if (isLoading) return <Skeleton height="300px" />

  if (!chartData || chartData.datasets.every((d) => d.data.every((v) => v === 0))) {
    return (
      <Center height="300px">
        <Text fontSize="lg" color="gray.500">
          Nenhum dado histórico encontrado nos últimos 30 dias.
        </Text>
      </Center>
    )
  }

  return (
    <Box height="300px">
      <Line options={options} data={chartData} />
    </Box>
  )
}
