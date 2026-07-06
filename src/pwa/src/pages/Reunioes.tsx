import { Box, Heading, Text, Badge, Spinner, Input, VStack, Card, Flex, Select, createListCollection } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useReunions } from '../hooks/useReunions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusCollection = createListCollection({
  items: [
    { value: '', label: 'Todos' },
    { value: 'aberta', label: 'Abertas' },
    { value: 'fechada', label: 'Fechadas' }
  ]
})

const STATUS_COLORS: Record<string, string> = {
  aberta: 'green',
  fechada: 'gray',
  encerrada: 'red'
}

const STATUS_LABELS: Record<string, string> = {
  aberta: 'Aberta',
  fechada: 'Fechada',
  encerrada: 'Encerrada'
}

function fmtDate(d: string) {
  try {
    return format(new Date(d + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return d
  }
}

function fmtCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export function Reunioes() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data: reunions, isLoading } = useReunions(status ? { status } : undefined)

  const filtered = (reunions ?? []).filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.date.includes(search)
  )

  return (
    <Box p={4}>
      <Heading size="md" mb={4} color="blue.700">
        Reuniões
      </Heading>

      <Flex gap={2} mb={4}>
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="white"
          size="sm"
          flex={1}
        />
        <Select.Root
          collection={statusCollection}
          value={[status]}
          onValueChange={(e) => setStatus(e.value[0] ?? '')}
          size="sm"
          width="140px"
        >
          <Select.HiddenSelect />
          <Select.Control bg="white">
            <Select.Trigger>
              <Select.ValueText placeholder="Status" />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {statusCollection.items.map(opt => (
                <Select.Item key={opt.value} item={opt}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>

      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner color="blue.500" />
        </Flex>
      )}

      <VStack gap={3} align="stretch">
        {filtered.map((r) => (
          <Link key={r.id} to={`/reunioes/${r.id}`}>
            <Card.Root bg="white" shadow="sm" borderWidth="1px" _active={{ bg: 'gray.50' }}>
              <Card.Body p={4}>
                <Flex justify="space-between" align="start" mb={1}>
                  <Text fontWeight="semibold" fontSize="sm" flex={1} pr={2}>
                    {r.name}
                  </Text>
                  <Badge colorPalette={STATUS_COLORS[r.status] ?? 'gray'} size="sm">
                    {STATUS_LABELS[r.status] ?? r.status}
                  </Badge>
                </Flex>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  {fmtDate(r.date)}
                </Text>
                <Flex gap={4} flexWrap="wrap">
                  <Text fontSize="xs" color="gray.600">
                    {r.treatmentQuantity} atend.
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {r.foodBasketQuantity} cestas
                  </Text>
                  <Text fontSize="xs" color="green.600" fontWeight="medium">
                    {fmtCurrency(r.totalAtendimentoValue ?? 0)}
                  </Text>
                </Flex>
              </Card.Body>
            </Card.Root>
          </Link>
        ))}

        {!isLoading && filtered.length === 0 && (
          <Text color="gray.400" textAlign="center" py={8}>
            Nenhuma reunião encontrada
          </Text>
        )}
      </VStack>
    </Box>
  )
}
