import { Box, Heading, Text, SimpleGrid, Card } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useReunions } from '../hooks/useReunions'
import { useProntuarios } from '../hooks/useProntuarios'

export function Home() {
  const { data: reunions } = useReunions()
  const { data: prontuarios } = useProntuarios()

  const stats = [
    { label: 'Reuniões', value: reunions?.length ?? '—', to: '/reunioes', icon: '📋' },
    { label: 'Prontuários', value: prontuarios?.length ?? '—', to: '/prontuarios', icon: '📁' },
    {
      label: 'Reuniões Abertas',
      value: reunions?.filter((r) => r.status === 'aberta').length ?? '—',
      to: '/reunioes',
      icon: '🔓'
    },
    {
      label: 'Prontuários Ativos',
      value: prontuarios?.filter((p) => p.status === 'active').length ?? '—',
      to: '/prontuarios',
      icon: '✅'
    }
  ]

  return (
    <Box p={4}>
      <Box mb={6}>
        <Heading size="lg" color="blue.700">
          Obra da Piedade
        </Heading>
        <Text color="gray.500" mt={1}>
          Visualização em tempo real
        </Text>
      </Box>

      <SimpleGrid columns={2} gap={4}>
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card.Root
              bg="white"
              shadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
              _active={{ bg: 'gray.50' }}
            >
              <Card.Body p={4}>
                <Text fontSize="2xl">{s.icon}</Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.700" mt={1}>
                  {s.value}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {s.label}
                </Text>
              </Card.Body>
            </Card.Root>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  )
}
