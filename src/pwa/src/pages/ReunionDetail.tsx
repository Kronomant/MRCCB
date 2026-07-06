import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  Flex,
  SimpleGrid,
  Card,
  Tabs
} from '@chakra-ui/react'
import { useParams, Link } from 'react-router-dom'
import { useReunion } from '../hooks/useReunions'
import { useAtendimentosByReunion } from '../hooks/useAtendimentos'
import { useDeliveriesByReunion } from '../hooks/useDeliveries'
import { useCashRegister, useCashTickets, useCashExpenses } from '../hooks/useCashRegister'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_COLORS: Record<string, string> = {
  aberta: 'green',
  fechada: 'gray',
  encerrada: 'red'
}

function fmtCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)
}

function fmtDate(d: string) {
  try {
    return format(new Date(d + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
  } catch {
    return d
  }
}

function fmtDateTime(d: string) {
  try {
    return format(new Date(d), "dd/MM/yyyy HH:mm", { locale: ptBR })
  } catch {
    return d
  }
}

export function ReunionDetail() {
  const { id } = useParams<{ id: string }>()
  const reunionId = Number(id)

  const { data: reunion, isLoading } = useReunion(reunionId)
  const { data: atendimentos } = useAtendimentosByReunion(reunionId)
  const { data: deliveries } = useDeliveriesByReunion(reunionId)
  const { data: cashRegister } = useCashRegister(reunionId)
  const { data: tickets } = useCashTickets(reunionId)
  const { data: expenses } = useCashExpenses(reunionId)

  if (isLoading) {
    return (
      <Flex justify="center" py={12}>
        <Spinner color="blue.500" />
      </Flex>
    )
  }

  if (!reunion) {
    return (
      <Box p={4}>
        <Text>Reunião não encontrada.</Text>
        <Link to="/reunioes">
          <Text color="blue.500" mt={2}>← Voltar</Text>
        </Link>
      </Box>
    )
  }

  const totalTickets = (tickets ?? []).reduce((s, t) => s + t.value, 0)
  const totalExpenses = (expenses ?? []).reduce((s, e) => s + e.value, 0)
  const pendingDeliveries = (deliveries ?? []).filter((d) => d.status === 'pendente').length
  const deliveredCount = (deliveries ?? []).filter((d) => d.status === 'entregue').length

  return (
    <Box p={4}>
      <Link to="/reunioes">
        <Text fontSize="sm" color="blue.500" mb={3}>← Reuniões</Text>
      </Link>

      <Flex justify="space-between" align="start" mb={4}>
        <Box flex={1} pr={2}>
          <Heading size="md" color="blue.700">{reunion.name}</Heading>
          <Text fontSize="sm" color="gray.500">{fmtDate(reunion.date)}</Text>
        </Box>
        <Badge colorPalette={STATUS_COLORS[reunion.status] ?? 'gray'}>
          {reunion.status}
        </Badge>
      </Flex>

      <SimpleGrid columns={2} gap={3} mb={6}>
        <StatCard label="Atendimentos" value={String(reunion.treatmentQuantity)} />
        <StatCard label="Cestas" value={String(reunion.foodBasketQuantity)} />
        <StatCard label="Total Atend." value={fmtCurrency(reunion.totalAtendimentoValue ?? 0)} />
        <StatCard label="Total Cestas" value={fmtCurrency(reunion.totalBasketValue ?? 0)} />
      </SimpleGrid>

      <Tabs.Root defaultValue="atendimentos" size="sm">
        <Tabs.List mb={4} overflowX="auto">
          <Tabs.Trigger value="atendimentos">Atendimentos</Tabs.Trigger>
          <Tabs.Trigger value="entregas">
            Entregas {pendingDeliveries > 0 && `(${pendingDeliveries} pend.)`}
          </Tabs.Trigger>
          <Tabs.Trigger value="caixa">Caixa</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="atendimentos">
          {(atendimentos ?? []).length === 0 ? (
            <Text color="gray.400" textAlign="center" py={4}>Sem atendimentos</Text>
          ) : (
            <Box spaceY={2}>
              {(atendimentos ?? []).map((a) => (
                <Card.Root key={a.id} bg="white" shadow="xs" borderWidth="1px">
                  <Card.Body p={3}>
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontSize="sm" fontWeight="medium">Pront. #{a.prontuarioNumber}</Text>
                      <Text fontSize="sm" color="green.600">{fmtCurrency(a.value)}</Text>
                    </Flex>
                    <Flex gap={3} flexWrap="wrap">
                      {a.foodBasketQuantity > 0 && (
                        <Text fontSize="xs" color="gray.500">{a.foodBasketQuantity} cesta(s)</Text>
                      )}
                      {a.emergency === 1 && <Badge colorPalette="red" size="sm">Emergência</Badge>}
                      {a.repeat === 1 && <Badge colorPalette="orange" size="sm">Repetição</Badge>}
                      {a.devolvido === 1 && <Badge colorPalette="green" size="sm">Devolvido</Badge>}
                    </Flex>
                  </Card.Body>
                </Card.Root>
              ))}
            </Box>
          )}
        </Tabs.Content>

        <Tabs.Content value="entregas">
          <Flex gap={4} mb={4} flexWrap="wrap">
            <Text fontSize="sm" color="green.600">✓ {deliveredCount} entregue(s)</Text>
            <Text fontSize="sm" color="orange.500">⏳ {pendingDeliveries} pendente(s)</Text>
          </Flex>
          {(deliveries ?? []).length === 0 ? (
            <Text color="gray.400" textAlign="center" py={4}>Sem registros de entrega</Text>
          ) : (
            <Box spaceY={2}>
              {(deliveries ?? []).map((d) => (
                <Card.Root key={d.id} bg="white" shadow="xs" borderWidth="1px">
                  <Card.Body p={3}>
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm">Pront. #{d.prontuarioId}</Text>
                      <Badge
                        colorPalette={d.status === 'entregue' ? 'green' : d.status === 'devolvido' ? 'blue' : 'orange'}
                        size="sm"
                      >
                        {d.status}
                      </Badge>
                    </Flex>
                    {d.deliveredAt && (
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        Entregue: {fmtDateTime(d.deliveredAt)} por {d.deliveredBy}
                      </Text>
                    )}
                  </Card.Body>
                </Card.Root>
              ))}
            </Box>
          )}
        </Tabs.Content>

        <Tabs.Content value="caixa">
          {!cashRegister ? (
            <Text color="gray.400" textAlign="center" py={4}>Caixa não aberto</Text>
          ) : (
            <Box spaceY={4}>
              <SimpleGrid columns={2} gap={3}>
                <StatCard label="Abertura" value={fmtCurrency(cashRegister.openingValue)} />
                <StatCard label="Disponível" value={fmtCurrency(cashRegister.availableValue)} />
                <StatCard label="Passagens" value={fmtCurrency(totalTickets)} />
                <StatCard label="Despesas" value={fmtCurrency(totalExpenses)} />
              </SimpleGrid>

              {(tickets ?? []).length > 0 && (
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Passagens</Text>
                  {tickets!.map((t) => (
                    <Flex key={t.id} justify="space-between" py={1} borderBottomWidth="1px" borderColor="gray.100">
                      <Text fontSize="xs" color="gray.600">{t.volunteerName || 'Anônimo'}</Text>
                      <Text fontSize="xs" fontWeight="medium">{fmtCurrency(t.value)}</Text>
                    </Flex>
                  ))}
                </Box>
              )}

              {(expenses ?? []).length > 0 && (
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Despesas</Text>
                  {expenses!.map((e) => (
                    <Flex key={e.id} justify="space-between" py={1} borderBottomWidth="1px" borderColor="gray.100">
                      <Box>
                        <Text fontSize="xs" color="gray.600">{e.establishmentName}</Text>
                        <Text fontSize="xs" color="gray.400">{e.category}</Text>
                      </Box>
                      <Text fontSize="xs" fontWeight="medium" color="red.600">{fmtCurrency(e.value)}</Text>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card.Root bg="white" shadow="xs" borderWidth="1px">
      <Card.Body p={3}>
        <Text fontSize="xs" color="gray.500">{label}</Text>
        <Text fontSize="md" fontWeight="bold" color="blue.700">{value}</Text>
      </Card.Body>
    </Card.Root>
  )
}
