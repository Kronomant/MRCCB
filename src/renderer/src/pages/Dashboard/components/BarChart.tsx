import { Bar } from 'react-chartjs-2'
import { Box, Stack, Text, Skeleton, Flex, Center, Button, Group } from '@chakra-ui/react'
import { useState, useMemo, useRef } from 'react'
import { useDashboardData } from '../../../hooks/useDashboardData'
import { startOfDay, startOfWeek, startOfMonth, isAfter, parseISO } from 'date-fns'
import { useColorModeValue } from '../../../components/ui/color-mode'
import { Select } from '../../../components/Select'
import { FiDownload } from 'react-icons/fi'

export const BarChart = () => {
  const { atendimentos, prontuarios, unities, isLoading } = useDashboardData()
  const [filter, setFilter] = useState('month')
  const textColor = useColorModeValue('gray.800', 'white')
  const chartRef = useRef<any>(null)

  const chartData = useMemo(() => {
    if (isLoading) return null

    const now = new Date()
    let startDate = startOfMonth(now)

    if (filter === 'day') startDate = startOfDay(now)
    if (filter === 'week') startDate = startOfWeek(now)
    if (filter === 'month') startDate = startOfMonth(now)

    const filteredAtendimentos = atendimentos.filter((a: any) => {
      try {
        return isAfter(parseISO(a.date), startDate)
      } catch {
        return false
      }
    })

    const unityMap = new Map<number, string>()
    unities.forEach((u: any) => unityMap.set(u.id, u.name))

    const prontuarioUnityMap = new Map<number, number>()
    prontuarios.forEach((p: any) => prontuarioUnityMap.set(p.id, p.unityId))

    const counts = new Map<string, number>()
    // Initialize all unities with 0
    unities.forEach((u: any) => counts.set(u.name, 0))

    filteredAtendimentos.forEach((a: any) => {
      const unityId = prontuarioUnityMap.get(a.prontuarioId)
      if (unityId) {
        const unityName = unityMap.get(unityId)
        if (unityName) {
          counts.set(unityName, (counts.get(unityName) || 0) + 1)
        }
      }
    })

    // Sort alphabetically
    const sortedUnities = Array.from(counts.keys()).sort()
    const dataValues = sortedUnities.map((u) => counts.get(u) || 0)

    return {
      labels: sortedUnities,
      datasets: [
        {
          label: 'Atendimentos',
          data: dataValues,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    }
  }, [atendimentos, prontuarios, unities, filter, isLoading])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor }
      },
      title: {
        display: false,
        text: 'Atendimentos por Unidade'
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

  const selectOptions = [
    { label: 'Hoje', value: 'day' },
    { label: 'Esta Semana', value: 'week' },
    { label: 'Este Mês', value: 'month' }
  ]

  const downloadImage = () => {
    if (chartRef.current) {
      const link = document.createElement('a')
      link.download = 'atendimentos-por-unidade.png'
      link.href = chartRef.current.toBase64Image()
      link.click()
    }
  }

  const downloadCSV = () => {
    if (!chartData) return
    const headers = ['Unidade', 'Atendimentos']
    const rows = chartData.labels.map((label: string, i: number) => [
      label,
      chartData.datasets[0].data[i]
    ])
    const csvContent = [headers.join(','), ...rows.map((row: any[]) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'atendimentos-por-unidade.csv'
    link.click()
  }

  if (isLoading) return <Skeleton height="300px" />

  if (!chartData || chartData.datasets[0].data.every((v: number) => v === 0)) {
    return (
      <Stack gap={4}>
        <Flex justify="flex-end">
          <Select
            value={filter}
            onChange={(v) => setFilter(v)}
            options={selectOptions}
            placeholder="Período"
          />
        </Flex>
        <Center height="250px" flexDirection="column">
          <Text fontSize="lg" color="gray.500">
            Nenhum dado encontrado para o período selecionado.
          </Text>
        </Center>
      </Stack>
    )
  }

  return (
    <Stack gap={4}>
      <Flex justify="space-between" align="center">
        <Flex gap={2}>
          <Button size="xs" variant="outline" onClick={downloadImage}>
            <FiDownload /> PNG
          </Button>
          <Button size="xs" variant="outline" onClick={downloadCSV}>
            <FiDownload /> CSV
          </Button>
        </Flex>
        <Select
          value={filter}
          onChange={(v) => setFilter(v)}
          options={selectOptions}
          placeholder="Período"
        />
      </Flex>
      <Box height="300px">
        <Bar ref={chartRef} options={options} data={chartData} />
      </Box>
    </Stack>
  )
}
