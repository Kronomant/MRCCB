import { Box, Text, Flex, Skeleton, Center } from '@chakra-ui/react'
import { Tooltip } from '../../../components/ui/tooltip'
import { useColorModeValue } from '../../../components/ui/color-mode'
import { useMemo } from 'react'
import { useDashboardData } from '../../../hooks/useDashboardData'
import { getDay, getHours, parseISO } from 'date-fns'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 6 to 22

export const HeatMap = () => {
  const { atendimentos, isLoading } = useDashboardData()

  const { data, maxCount } = useMemo(() => {
    const grid = Array.from({ length: 7 }, () => Array(23).fill(0)) // 0-6 days, 0-22 hours (we only care about 6-22)
    let max = 0

    atendimentos.forEach((a: Atendimento) => {
      try {
        const date = parseISO(a.date)
        const day = getDay(date)
        const hour = getHours(date)

        if (hour >= 6 && hour <= 22) {
          grid[day][hour]++
          if (grid[day][hour] > max) max = grid[day][hour]
        }
      } catch {}
    })

    return { data: grid, maxCount: max }
  }, [atendimentos])

  const getColor = (value: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (value === 0) return useColorModeValue('gray.100', 'gray.700')
    const alpha = value / (maxCount || 1)
    return `rgba(49, 130, 206, ${Math.max(0.1, alpha)})` // Blue base
  }

  if (isLoading) return <Skeleton height="300px" />

  if (maxCount === 0) {
    return (
      <Center height="300px">
        <Text fontSize="lg" color="gray.500">
          Sem dados suficientes para mapa de calor.
        </Text>
      </Center>
    )
  }

  return (
    <Box overflowX="auto">
      <Flex direction="column" minW="500px">
        <Flex>
          <Box w="40px" />
          {DAYS.map((d) => (
            <Box key={d} flex={1} textAlign="center">
              <Text fontSize="xs" fontWeight="bold">
                {d}
              </Text>
            </Box>
          ))}
        </Flex>
        {HOURS.map((hour) => (
          <Flex key={hour} align="center" my={1}>
            <Box w="40px" textAlign="right" pr={2}>
              <Text fontSize="xs">{hour}h</Text>
            </Box>
            {DAYS.map((_, dayIndex) => {
              const value = data[dayIndex][hour]
              return (
                <Tooltip key={`${dayIndex}-${hour}`} content={`${value} atendimentos`} showArrow>
                  <Box
                    flex={1}
                    height="30px"
                    bg={getColor(value)}
                    mx="1px"
                    borderRadius="sm"
                    transition="all 0.2s"
                    _hover={{ transform: 'scale(1.1)', zIndex: 1 }}
                  />
                </Tooltip>
              )
            })}
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}
