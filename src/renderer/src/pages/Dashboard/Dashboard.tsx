import { Box, Grid, Heading, SimpleGrid } from '@chakra-ui/react'
import { PageHeader } from '../../components/PageHeader/Header'
import { BarChart, LineChart, PieChart, HeatMap } from './components'
import './chartConfig' // Register Chart.js components
import { useColorModeValue } from '../../components/ui/color-mode'
import { PageContainer } from '../../components'
import { useTutorialContext } from '../../contexts/TutorialContext'
import { useEffect } from 'react'

export const Dashboard = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const { startFullTutorial, hasSeenTutorial } = useTutorialContext()

  useEffect(() => {
    // Se nunca viu o tutorial, inicia o completo (sidebar + dashboard)
    if (!hasSeenTutorial('sidebar')) {
      startFullTutorial('dashboard')
    } else if (!hasSeenTutorial('dashboard')) {
      // Se já viu a sidebar mas não o dashboard
      startFullTutorial('dashboard')
    }
  }, [])

  return (
    <PageContainer>
      <Box id="dashboard-header">
        <PageHeader title="Dashboard" />
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mt={6}>
        {/* Gráfico de Barras Verticais: Atendimentos por Unidade */}
        <Box id="dashboard-atendimentos-chart" bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Atendimentos por Unidade
          </Heading>
          <BarChart />
        </Box>

        {/* Gráfico de Linhas Temporal: Série Histórica */}
        <Box id="dashboard-historico-chart" bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Histórico de Atendimentos
          </Heading>
          <LineChart />
        </Box>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mt={6}>
        {/* Gráfico de Pizza: % por Tipo de Atendimento */}
        <Box id="dashboard-tipos-chart" bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Tipos de Atendimento
          </Heading>
          <PieChart />
        </Box>

        {/* Mapa de Calor: Dias/Horários */}
        <Box id="dashboard-heatmap" bg={bg} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>
            Mapa de Calor
          </Heading>
          <HeatMap />
        </Box>
      </Grid>
    </PageContainer>
  )
}


