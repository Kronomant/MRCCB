import { Scatter } from 'react-chartjs-2'
import { Box, Skeleton, Center, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useColorModeValue } from '../../../components/ui/color-mode'

export const ScatterChart = () => {
  const textColor = useColorModeValue('gray.800', 'white')

  // Mock data simulation as these fields don't exist in current schema
  const chartData = useMemo(() => {
    const data = Array.from({ length: 50 }, () => ({
      x: Math.floor(Math.random() * 60) + 5, // 5 to 65 minutes
      y: Math.floor(Math.random() * 5) + 1 // 1 to 5 stars
    }))

    return {
      datasets: [
        {
          label: 'Satisfação x Tempo',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    }
  }, [])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
        text: 'Satisfação vs Tempo'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Tempo: ${context.raw.x}min, Nota: ${context.raw.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Nota (1-5)',
          color: textColor
        },
        ticks: { color: textColor }
      },
      x: {
        title: {
          display: true,
          text: 'Tempo (min)',
          color: textColor
        },
        ticks: { color: textColor }
      }
    }
  }

  return (
    <Box height="300px">
      <Scatter options={options} data={chartData} />
      <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
        * Dados simulados para demonstração (Campos não presentes no banco)
      </Text>
    </Box>
  )
}
