import {
  Box,
  Flex,
  Stack,
  Text,
  Tag,
  Button,
  Card,
  Badge,
  Separator,
  Table,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
  Portal,
  SimpleGrid
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
import { invoke } from '@tauri-apps/api/core'

interface ProntuarioDetailProps {
  prontuarioId: number | null
  open: boolean
  onClose: () => void
  onEdit: (prontuario: Prontuario) => void
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
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
    case 'active':
    case 'ativo':
      return { label: 'Ativo', color: 'green', icon: <FiCheck /> }
    case 'inactive':
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
  <Flex
    align="center"
    gap={3}
    p={2.5}
    bg={highlight ? { base: 'blue.50', _dark: 'blue.950' } : 'bg.subtle'}
    borderRadius="md"
  >
    <Box color={highlight ? { base: 'blue.600', _dark: 'blue.300' } : { base: 'gray.500', _dark: 'gray.400' }}>
      {icon}
    </Box>
    <Box flex={1}>
      <Text fontSize="xs" color="fg.muted">
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color={highlight ? { base: 'blue.800', _dark: 'blue.200' } : 'fg'}
      >
        {value}
      </Text>
    </Box>
  </Flex>
)

export const ProntuarioDetail: React.FC<ProntuarioDetailProps> = ({
  prontuarioId,
  open,
  onClose,
  onEdit
}) => {
  const resolvedId = prontuarioId ?? 0
  const {
    prontuario: { data: prontuario },
    isLoading
  } = useProntuario(resolvedId)
  const { unities } = useUnities()
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [deliveries, setDeliveries] = useState<ProntuarioDeliveryData[]>([])
  const [loadingAtendimentos, setLoadingAtendimentos] = useState(true)

  useEffect(() => {
    const fetchAtendimentos = async () => {
      try {
        setLoadingAtendimentos(true)
        const atendimentosData = await invoke<Atendimento[]>('atendimento_get_by_prontuario', { prontuarioId: resolvedId })
        setAtendimentos(atendimentosData ?? [])

        const deliveryData = await invoke<ProntuarioDeliveryData[]>('delivery_get_by_prontuario', { prontuarioId: resolvedId })
        setDeliveries(deliveryData ?? [])
      } catch (error) {
        console.error('Erro ao buscar dados do prontuário:', error)
        setAtendimentos([])
        setDeliveries([])
      } finally {
        setLoadingAtendimentos(false)
      }
    }

    if (resolvedId && open) {
      fetchAtendimentos()
    }
  }, [resolvedId, open])

  const getDeliveryStatus = (reunionId: number, atendimentoDevolvido?: boolean) => {
    if (atendimentoDevolvido) return 'devolvido'
    const delivery = deliveries.find((d) => d.reunionId === reunionId)
    return delivery?.status || 'pendente'
  }

  const statusInfo = prontuario ? getStatusInfo(prontuario.status) : null
  const totalAtendimentos = atendimentos.length
  const atendimentosPendentes = atendimentos.filter((a) => {
    const status = getDeliveryStatus(a.reunionId, a.devolvido)
    return status !== 'entregue' && status !== 'devolvido'
  }).length

  const valorTotalRecebido = atendimentos.reduce((total, a) => total + (a.value || 0), 0)

  return (
    <DialogRoot open={open} onOpenChange={(e) => !e.open && onClose()} size="lg" placement="center">
      <DialogBackdrop />
      <Portal>
        <DialogPositioner>
          <DialogContent
            maxH="90vh"
            overflowY="auto"
            bg="bg"
            border="1px solid"
            borderColor="border"
          >
            <DialogHeader borderBottom="1px solid" borderColor="border" pb={4}>
              <Flex justify="space-between" align="center" w="100%" pr={6}>
                <Box>
                  <DialogTitle fontSize="xl" fontWeight="bold" color={{ base: 'blue.600', _dark: 'blue.300' }}>
                    {prontuario ? `Prontuário #${prontuario.number}` : 'Detalhes do Prontuário'}
                  </DialogTitle>
                  {prontuario && (
                    <Text color="fg.muted" fontSize="xs">
                      ID Interno: {prontuario.id}
                    </Text>
                  )}
                </Box>
                {prontuario && statusInfo && (
                  <Tag.Root colorPalette={statusInfo.color} size="md">
                    <Flex align="center" gap={1.5}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </Flex>
                  </Tag.Root>
                )}
              </Flex>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={6}>
              {isLoading ? (
                <Flex justify="center" align="center" py={10}>
                  <Text>Carregando prontuário...</Text>
                </Flex>
              ) : !prontuario ? (
                <Box py={10} textAlign="center">
                  <Text color="fg.muted">Selecione um prontuário válido para visualizar os detalhes.</Text>
                </Box>
              ) : (
                <Stack gap={6}>
                  {/* Grid das Informações Básicas e Resumo */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {/* Informações Básicas */}
                    <Card.Root
                      variant="subtle"
                      size="sm"
                      bg="bg.subtle"
                      border="1px solid"
                      borderColor="border"
                    >
                      <Card.Body>
                        <Stack gap={3}>
                          <Text fontWeight="bold" fontSize="sm" color={{ base: 'blue.700', _dark: 'blue.300' }}>
                            Informações Gerais
                          </Text>
                          <Separator borderColor="border" />
                          <Stack gap={2}>
                            <InfoItem
                              icon={<FiUser />}
                              label="Número do Prontuário"
                              value={prontuario.number}
                              highlight
                            />
                            <InfoItem
                              icon={<FiMapPin />}
                              label="Unidade vinculada"
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
                              label="Data de Cadastro"
                              value={formatDateTime(prontuario.createdAt)}
                            />
                            {prontuario.updatedAt && (
                              <InfoItem
                                icon={<FiClock />}
                                label="Última Atualização"
                                value={formatDateTime(prontuario.updatedAt)}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </Card.Body>
                    </Card.Root>

                    {/* Resumo de Atendimentos */}
                    <Card.Root
                      variant="subtle"
                      size="sm"
                      bg="bg.subtle"
                      border="1px solid"
                      borderColor="border"
                    >
                      <Card.Body>
                        <Stack gap={3} h="100%">
                          <Text fontWeight="bold" fontSize="sm" color={{ base: 'blue.700', _dark: 'blue.300' }}>
                            Resumo financeiro / cestas
                          </Text>
                          <Separator borderColor="border" />
                          <Stack gap={3} justify="center" flex={1}>
                            <Flex
                              justify="space-between"
                              align="center"
                              p={2.5}
                              bg={{ base: 'blue.50', _dark: 'blue.950' }}
                              borderRadius="md"
                            >
                              <Text
                                fontSize="xs"
                                color={{ base: 'blue.700', _dark: 'blue.300' }}
                                fontWeight="medium"
                              >
                                Total de Atendimentos
                              </Text>
                              <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={{ base: 'blue.800', _dark: 'blue.200' }}
                              >
                                {totalAtendimentos}
                              </Text>
                            </Flex>

                            <Flex
                              justify="space-between"
                              align="center"
                              p={2.5}
                              bg={{ base: 'orange.50', _dark: 'orange.950' }}
                              borderRadius="md"
                            >
                              <Text
                                fontSize="xs"
                                color={{ base: 'orange.700', _dark: 'orange.300' }}
                                fontWeight="medium"
                              >
                                Entregas Pendentes
                              </Text>
                              <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={{ base: 'orange.800', _dark: 'orange.200' }}
                              >
                                {atendimentosPendentes}
                              </Text>
                            </Flex>

                            <Flex
                              justify="space-between"
                              align="center"
                              p={2.5}
                              bg={{ base: 'green.50', _dark: 'green.950' }}
                              borderRadius="md"
                            >
                              <Text
                                fontSize="xs"
                                color={{ base: 'green.700', _dark: 'green.300' }}
                                fontWeight="medium"
                              >
                                Valor Total Recebido
                              </Text>
                              <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={{ base: 'green.800', _dark: 'green.200' }}
                              >
                                {formatCurrency(valorTotalRecebido)}
                              </Text>
                            </Flex>
                          </Stack>
                        </Stack>
                      </Card.Body>
                    </Card.Root>
                  </SimpleGrid>

                  {/* Histórico de Atendimentos */}
                  <Stack gap={3}>
                    <Text fontWeight="bold" fontSize="sm" color={{ base: 'blue.700', _dark: 'blue.300' }}>
                      Histórico de Atendimentos
                    </Text>
                    <Separator borderColor="border" />

                    {loadingAtendimentos ? (
                      <Text py={4} textAlign="center" fontSize="sm">Carregando histórico...</Text>
                    ) : atendimentos.length === 0 ? (
                      <Text py={6} textAlign="center" color="fg.muted" fontStyle="italic" fontSize="sm">
                        Nenhum atendimento registrado para este prontuário.
                      </Text>
                    ) : (
                      <Box overflowY="auto" maxH="220px" border="1px solid" borderColor="border" borderRadius="md">
                        <Table.Root w="100%" variant="line" size="sm">
                          <Table.Header bg="bg.muted" position="sticky" top={0} zIndex={1}>
                            <Table.Row>
                              <Table.ColumnHeader fontSize="xs" color="fg.muted" whiteSpace="nowrap">Data</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color="fg.muted" whiteSpace="nowrap">Reunião</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color="fg.muted" whiteSpace="nowrap">Valor</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color="fg.muted" whiteSpace="nowrap">Cestas</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color="fg.muted" whiteSpace="nowrap">Status</Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="xs" color="fg.muted" minW="90px">Tags</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {atendimentos.map((atendimento) => {
                              const status = getDeliveryStatus(atendimento.reunionId, atendimento.devolvido)
                              const statusColor =
                                status === 'entregue'
                                  ? 'green'
                                  : status === 'devolvido'
                                    ? 'blue'
                                    : 'orange'
                              const statusLabel =
                                status === 'entregue'
                                  ? 'Entregue'
                                  : status === 'devolvido'
                                    ? 'Devolvido'
                                    : 'Pendente'

                              return (
                                <Table.Row key={atendimento.id}>
                                  <Table.Cell fontSize="xs" whiteSpace="nowrap">
                                    {formatDate(atendimento.date)}
                                  </Table.Cell>
                                  <Table.Cell fontSize="xs" whiteSpace="nowrap">#{atendimento.reunionId}</Table.Cell>
                                  <Table.Cell fontSize="xs" whiteSpace="nowrap">
                                    {atendimento.value ? formatCurrency(atendimento.value) : '-'}
                                  </Table.Cell>
                                  <Table.Cell fontSize="xs">{atendimento.foodBasketQuantity || '-'}</Table.Cell>
                                  <Table.Cell fontSize="xs" whiteSpace="nowrap">
                                    <Badge colorPalette={statusColor} variant="solid" size="xs">
                                      {statusLabel}
                                    </Badge>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Flex gap={1} wrap="wrap">
                                      {atendimento.emergency && (
                                        <Badge colorPalette="red" size="xs">
                                          <FiAlertTriangle size={8} />
                                        </Badge>
                                      )}
                                      {atendimento.aprovedValue && (
                                        <Badge colorPalette="green" size="xs">
                                          <FiCheck size={8} />
                                        </Badge>
                                      )}
                                      {atendimento.repeat && (
                                        <Badge colorPalette="orange" size="xs">
                                          <FiRepeat size={8} />
                                        </Badge>
                                      )}
                                      {atendimento.onlyClothes && (
                                        <Badge colorPalette="purple" size="xs">
                                          <FiPackage size={8} />
                                        </Badge>
                                      )}
                                    </Flex>
                                  </Table.Cell>
                                </Table.Row>
                              )
                            })}
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    )}
                  </Stack>
                </Stack>
              )}
            </DialogBody>

            <DialogFooter borderTop="1px solid" borderColor="border" pt={3}>
              {prontuario && (
                <Button variant="outline" colorPalette="blue" size="sm" onClick={() => onEdit(prontuario)}>
                  Editar Prontuário
                </Button>
              )}
              <Button size="sm" onClick={onClose}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
}
