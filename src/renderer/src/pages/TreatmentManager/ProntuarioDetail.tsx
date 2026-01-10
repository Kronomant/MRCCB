import {
  Box,
  Flex,
  Stack,
  Text,
  Tag,
  Button,
  Heading,
  Card,
  Badge,
  Separator,
  Table
} from '@chakra-ui/react'
import {
  FiCalendar,
  FiPackage,
  FiAlertTriangle,
  FiCheck,
  FiRepeat,
  FiUser,
  FiMapPin,
  FiClock,
  FiArchive,
  FiActivity
} from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useProntuario } from '../../hooks/prontuario'
import { useUnities } from '../../hooks/unity'

interface ProntuarioDetailProps {
  prontuarioId: number
  onClose: () => void
  onEdit: (prontuario: Prontuario) => void
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'ativo':
      return { label: 'Ativo', color: 'green', icon: <FiCheck /> }
    case 'inativo':
      return { label: 'Inativo', color: 'gray', icon: <FiClock /> }
    case 'arquivado':
      return { label: 'Arquivado', color: 'orange', icon: <FiArchive /> }
    default:
      return { label: 'Desconhecido', color: 'gray', icon: <FiActivity /> }
  }
}

const InfoItem: React.FC<{
  icon: React.ReactNode
  label: string
  value: string | number
  highlight?: boolean
}> = ({ icon, label, value, highlight = false }) => (
  <Flex align="center" gap={3} p={3} bg={highlight ? 'blue.50' : 'gray.50'} borderRadius="md">
    <Box color={highlight ? 'blue.500' : 'gray.500'}>{icon}</Box>
    <Box flex={1}>
      <Text fontSize="sm" color="gray.600">
        {label}
      </Text>
      <Text fontWeight="medium" color={highlight ? 'blue.700' : 'gray.900'}>
        {value}
      </Text>
    </Box>
  </Flex>
)

export const ProntuarioDetail: React.FC<ProntuarioDetailProps> = ({
  prontuarioId,
  onClose,
  onEdit
}) => {
  const {
    prontuario: { data: prontuario },
    isLoading
  } = useProntuario(prontuarioId)
  const { unities } = useUnities()
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [deliveries, setDeliveries] = useState<ProntuarioDeliveryData[]>([])
  const [loadingAtendimentos, setLoadingAtendimentos] = useState(true)

  useEffect(() => {
    const fetchAtendimentos = async () => {
      try {
        setLoadingAtendimentos(true)
        // Buscar atendimentos relacionados ao prontuário
        const atendimentosData = await window.electron.ipcRenderer.invoke(
          'atendimento:getByProntuarioId',
          prontuarioId
        ) as Atendimento[]
        setAtendimentos(atendimentosData ?? [])

        // Buscar status de entrega
        const deliveryData = await window.electron.ipcRenderer.invoke(
            'prontuarioDelivery:getByProntuario',
            prontuarioId
        ) as ProntuarioDeliveryData[]
        setDeliveries(deliveryData ?? [])

      } catch (error) {
        console.error('Erro ao buscar dados do prontuário:', error)
        setAtendimentos([])
        setDeliveries([])
      } finally {
        setLoadingAtendimentos(false)
      }
    }

    if (prontuarioId) {
      fetchAtendimentos()
    }
  }, [prontuarioId])

  if (isLoading) {
    return (
      <Box p={6}>
        <Text>Carregando prontuário...</Text>
      </Box>
    )
  }

  if (!prontuario) {
    return (
      <Box p={6}>
        <Text>Prontuário não encontrado</Text>
        <Button mt={4} onClick={onClose}>
          Voltar
        </Button>
      </Box>
    )
  }

  const getDeliveryStatus = (reunionId: number) => {
      const delivery = deliveries.find(d => d.reunionId === reunionId)
      return delivery?.status || 'pendente'
  }

  const statusInfo = getStatusInfo(prontuario.status)
  const totalAtendimentos = atendimentos.length
  // Count as pending if not explicitly delivered or returned
  const atendimentosPendentes = atendimentos.filter((a) => {
      const status = getDeliveryStatus(a.reunionId)
      return status !== 'entregue' && status !== 'devolvido'
  }).length
  
  const valorTotalRecebido = atendimentos.reduce((total, a) => total + (a.value || 0), 0)

  return (
    <Flex direction="column" p={6} mx="auto" overflowY="scroll" maxH="90vh">
      <Card.Root mb={6}>
        <Card.Body>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="xl" color="blue.600">
                Prontuário #{prontuario.number}
              </Heading>
              <Text color="gray.600" fontSize="lg">
                ID: {prontuario.id}
              </Text>
            </Box>
            <Flex gap={3}>
              <Button variant="outline" colorPalette="blue" onClick={() => onEdit(prontuario)}>
                Editar
              </Button>
              <Button variant="solid" onClick={onClose}>
                Fechar
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>
      <Flex>
        {/* Status e Informações Básicas */}
        <Card.Root mb={6}>
          <Card.Body>
            <Stack gap={4}>
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="medium">
                  Status do Prontuário
                </Text>
                <Tag.Root colorPalette={statusInfo.color}>
                  <Flex align="center" gap={2}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </Flex>
                </Tag.Root>
              </Flex>

              <Separator />

              <Stack gap={3}>
                <Text fontWeight="medium">Informações Básicas</Text>
                <Stack gap={3}>
                  <InfoItem
                    icon={<FiUser />}
                    label="Número do Prontuário"
                    value={prontuario.number}
                    highlight
                  />
                  <InfoItem
                    icon={<FiMapPin />}
                    label="Unidade"
                    value={
                      unities.find((u) => u.id === prontuario.unityId)?.name ||
                      `Unidade ${prontuario.unityId}`
                    }
                  />
                  <InfoItem
                    icon={prontuario.ministry ? <FiCheck /> : <FiClock />}
                    label="Ministério"
                    value={prontuario.ministry ? 'Sim' : 'Não'}
                  />
                  <InfoItem
                    icon={<FiCalendar />}
                    label="Criado em"
                    value={formatDateTime(prontuario.createdAt)}
                  />
                  {prontuario.updatedAt && (
                    <InfoItem
                      icon={<FiClock />}
                      label="Última atualização"
                      value={formatDateTime(prontuario.updatedAt)}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Resumo de Atendimentos */}
        <Card.Root mb={6}>
          <Card.Body>
            <Stack gap={4}>
              <Text fontSize="lg" fontWeight="medium">
                Resumo de Atendimentos
              </Text>

              <Flex gap={4} wrap="wrap">
                <Box p={4} bg="blue.50" borderRadius="md" flex="1" minW="200px">
                  <Text fontSize="sm" color="blue.600">
                    Total de Atendimentos
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                    {totalAtendimentos}
                  </Text>
                </Box>

                <Box p={4} bg="orange.50" borderRadius="md" flex="1" minW="200px">
                  <Text fontSize="sm" color="orange.600">
                    Pendentes
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.700">
                    {atendimentosPendentes}
                  </Text>
                </Box>

                <Box p={4} bg="green.50" borderRadius="md" flex="1" minW="200px">
                  <Text fontSize="sm" color="green.600">
                    Valor Total Recebido
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.700">
                    {formatCurrency(valorTotalRecebido)}
                  </Text>
                </Box>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Histórico de Atendimentos */}
        <Card.Root mb={6}>
          <Card.Body>
            <Stack gap={4}>
              <Text fontSize="lg" fontWeight="medium">
                Histórico de Atendimentos
              </Text>

              {loadingAtendimentos ? (
                <Text>Carregando histórico...</Text>
              ) : atendimentos.length === 0 ? (
                <Text color="gray.500" fontStyle="italic">
                  Nenhum atendimento registrado para este prontuário
                </Text>
              ) : (
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Data</Table.ColumnHeader>
                      <Table.ColumnHeader>Reunião</Table.ColumnHeader>
                      <Table.ColumnHeader>Valor</Table.ColumnHeader>
                      <Table.ColumnHeader>Cestas</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Características</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {atendimentos.map((atendimento) => {
                        const status = getDeliveryStatus(atendimento.reunionId)
                        const statusColor = 
                            status === 'entregue' ? 'green' : 
                            status === 'devolvido' ? 'blue' : 'orange'
                        const statusLabel = 
                            status === 'entregue' ? 'Entregue' : 
                            status === 'devolvido' ? 'Devolvido' : 'Pendente'

                        return (
                      <Table.Row key={atendimento.id}>
                        <Table.Cell>{formatDate(atendimento.date)}</Table.Cell>
                        <Table.Cell>#{atendimento.reunionId}</Table.Cell>
                        <Table.Cell>
                          {atendimento.value ? formatCurrency(atendimento.value) : '-'}
                        </Table.Cell>
                        <Table.Cell>{atendimento.foodBasketQuantity || '-'}</Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorPalette={statusColor}
                            variant="solid"
                          >
                            {statusLabel}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap={1} wrap="wrap">
                            {atendimento.emergency && (
                              <Badge colorPalette="red" size="sm">
                                <FiAlertTriangle size={10} />
                              </Badge>
                            )}
                            {atendimento.aprovedValue && (
                              <Badge colorPalette="green" size="sm">
                                <FiCheck size={10} />
                              </Badge>
                            )}
                            {atendimento.repeat && (
                              <Badge colorPalette="orange" size="sm">
                                <FiRepeat size={10} />
                              </Badge>
                            )}
                            {atendimento.onlyClothes && (
                              <Badge colorPalette="purple" size="sm">
                                <FiPackage size={10} />
                              </Badge>
                            )}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    )})}
                  </Table.Body>
                </Table.Root>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Flex>
  )
}
