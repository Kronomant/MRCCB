import { Pie } from 'react-chartjs-2'
import { Box, Skeleton, Center, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useDashboardData } from '../../../hooks/useDashboardData'
import { useColorModeValue } from '../../../components/ui/color-mode'

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF']

export const PieChart = () => {
  const { atendimentos, isLoading } = useDashboardData()
  const textColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('#fff', '#2D3748')

  const chartData = useMemo(() => {
    if (isLoading) return null

    const stats = {
      Ministério: 0,
      Emergência: 0,
      'Apenas Roupas': 0,
      Retorno: 0,
      Repetição: 0,
      Comum: 0
    }

    atendimentos.forEach((a: Atendimento) => {
      if (a.ministerio) {
        stats['Ministério']++
      } else if (a.emergency) {
        stats['Emergência']++
      } else if (a.onlyClothes) {
        stats['Apenas Roupas']++
      } else if (a.devolvido) {
        stats['Retorno']++
      } else if (a.repeat) {
        stats['Repetição']++
      } else {
        stats['Comum']++
      }
    })

    // Sort by value and group small ones if needed (limit to 6 is already satisfied by fixed categories)
    // But if we had more, we would group.

    const labels = Object.keys(stats)
    const data = Object.values(stats)

    // Filter out zero values to look cleaner
    const filteredIndices = data.map((v, i) => (v > 0 ? i : -1)).filter((i) => i !== -1)
    const finalLabels = filteredIndices.map((i) => labels[i])
    const finalData = filteredIndices.map((i) => data[i])

    return {
      labels: finalLabels,
      datasets: [
        {
          data: finalData,
          backgroundColor: COLORS,
          borderColor: borderColor,
          borderWidth: 2,
          hoverOffset: 4
        }
      ]
    }
  }, [atendimentos, isLoading])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: textColor }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            const value = context.raw
            const total = context.chart._metasets[context.datasetIndex].total
            const percentage = Math.round((value / total) * 100) + '%'
            return label + value + ' (' + percentage + ')'
          }
        }
      }
    }
  }

  if (isLoading) return <Skeleton height="300px" />

  if (!chartData || chartData.datasets[0].data.length === 0) {
    return (
      <Center height="300px">
        <Text fontSize="lg" color="gray.500">
          Sem dados para exibir.
        </Text>
      </Center>
    )
  }

  return (
    <Box height="300px">
      <Pie options={options} data={chartData} />
    </Box>
  )
}
