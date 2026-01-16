import { Box, Grid, Heading, SimpleGrid } from '@chakra-ui/react'
import { PageHeader } from '../../components/PageHeader/Header'
import { BarChart, LineChart, PieChart, HeatMap } from './components'
import './chartConfig' // Register Chart.js components
import { useColorModeValue } from '../../components/ui/color-mode'
import { PageContainer } from '../../components'

export const Dashboard = () => {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mt={6}>
        {/* Gráfico de Barras Verticais: Atendimentos por Unidade */}
        <Box bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Atendimentos por Unidade
          </Heading>
          <BarChart />
        </Box>

        {/* Gráfico de Linhas Temporal: Série Histórica */}
        <Box bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Histórico de Atendimentos
          </Heading>
          <LineChart />
        </Box>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mt={6}>
        {/* Gráfico de Pizza: % por Tipo de Atendimento */}
        <Box bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Tipos de Atendimento
          </Heading>
          <PieChart />
        </Box>

        {/* Mapa de Calor: Dias/Horários */}
        <Box bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Mapa de Calor
          </Heading>
          <HeatMap />
        </Box>
      </Grid>
    </PageContainer>
  )
}
