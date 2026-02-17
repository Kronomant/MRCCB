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
  Separator
} from '@chakra-ui/react'
import {
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiAlertTriangle,
  FiCheck,
  FiRepeat
} from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useUnities } from '../../hooks/unity'

// Importar o tipo Treatment do global.d.ts
type Treatment = globalThis.Treatment

interface TreatmentDetailProps {
  treatmentId: number
  onClose: () => void
  onEdit: (treatment: Treatment) => void
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
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

const getStatusInfo = (treatment: Treatment) => {
  if (treatment.returned) return { label: 'Entregue', color: 'green', icon: <FiCheck /> }
  if (treatment.emergency) return { label: 'Emergencial', color: 'red', icon: <FiAlertTriangle /> }
  return { label: 'Pendente', color: 'orange', icon: <FiCalendar /> }
}

const AssistanceItem: React.FC<{
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

export const TreatmentDetail: React.FC<TreatmentDetailProps> = ({
  treatmentId,
  onClose,
  onEdit
}) => {
  const [treatment, setTreatment] = useState<Treatment | null>(null)
  const [loading, setLoading] = useState(true)
  const { unities } = useUnities()

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const data = await window.electron.ipcRenderer.invoke('treatment:getById', treatmentId) as Treatment | null
        setTreatment(data ?? null)
      } catch (error) {
        console.error('Erro ao buscar prontuário:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTreatment()
  }, [treatmentId])

  if (loading) {
    return (
      <Box p={6}>
        <Text>Carregando...</Text>
      </Box>
    )
  }

  if (!treatment) {
    return (
      <Box p={6}>
        <Text>Prontuário não encontrado</Text>
        <Button mt={4} onClick={onClose}>
          Voltar
        </Button>
      </Box>
    )
  }

  const statusInfo = getStatusInfo(treatment)

  return (
    <Box p={8} maxW="5xl" mx="auto">
      {/* Header */}
      <Card.Root mb={6}>
        <Card.Body>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="xl" color="blue.600">
                Prontuário #{treatment.enchiridionId}
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Atendimento #{treatment.id}
              </Text>
            </Box>
            <Flex gap={3}>
              <Button variant="outline" colorPalette="blue" onClick={() => onEdit(treatment)}>
                Editar
              </Button>
              <Button variant="solid" onClick={onClose}>
                Fechar
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Status e Informações Básicas */}
      <Card.Root mb={6}>
        <Card.Body>
          <Stack gap={4}>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="medium">
                Status do Atendimento
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
              <Flex gap={4} wrap="wrap">
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Data do Atendimento
                  </Text>
                  <Text fontWeight="medium">{formatDate(treatment.date)}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Reunião
                  </Text>
                  <Text fontWeight="medium">#{treatment.reunionId}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600">
                    Unidade
                  </Text>
                  <Text fontWeight="medium">
                    {unities.find((u) => u.id === treatment.unityId)?.name ||
                      `Unidade ${treatment.unityId}`}
                  </Text>
                </Box>
              </Flex>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Benefícios Concedidos */}
      <Card.Root mb={6}>
        <Card.Body>
          <Stack gap={4}>
            <Text fontSize="lg" fontWeight="medium">
              Benefícios Concedidos
            </Text>

            <Stack gap={3}>
              {treatment.value > 0 && (
                <AssistanceItem
                  icon={<FiDollarSign />}
                  label="Valor Monetário"
                  value={formatCurrency(treatment.value)}
                  highlight={treatment.aprovedValue}
                />
              )}

              {treatment.foodBasketQuantity > 0 && (
                <AssistanceItem
                  icon={<FiPackage />}
                  label="Cestas Básicas"
                  value={`${treatment.foodBasketQuantity} unidade(s)`}
                />
              )}

              {treatment.onlyClothes && (
                <AssistanceItem icon={<FiPackage />} label="Roupas" value="Fornecidas" />
              )}

              {!treatment.value && !treatment.foodBasketQuantity && !treatment.onlyClothes && (
                <Text color="gray.500" fontStyle="italic">
                  Nenhum benefício específico registrado
                </Text>
              )}
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Características do Atendimento */}
      <Card.Root mb={6}>
        <Card.Body>
          <Stack gap={4}>
            <Text fontSize="lg" fontWeight="medium">
              Características do Atendimento
            </Text>

            <Flex gap={3} wrap="wrap">
              {treatment.emergency && (
                <Badge colorPalette="red" variant="solid">
                  <Flex align="center" gap={1}>
                    <FiAlertTriangle size={12} />
                    Emergencial
                  </Flex>
                </Badge>
              )}

              {treatment.aprovedValue && (
                <Badge colorPalette="green" variant="solid">
                  <Flex align="center" gap={1}>
                    <FiCheck size={12} />
                    Valor Aprovado
                  </Flex>
                </Badge>
              )}

              {treatment.returned && (
                <Badge colorPalette="blue" variant="solid">
                  <Flex align="center" gap={1}>
                    <FiCheck size={12} />
                    Entregue
                  </Flex>
                </Badge>
              )}

              {treatment.repeat && (
                <Badge colorPalette="orange" variant="solid">
                  <Flex align="center" gap={1}>
                    <FiRepeat size={12} />
                    Repetir
                  </Flex>
                </Badge>
              )}

              {treatment.onlyClothes && (
                <Badge colorPalette="purple" variant="solid">
                  <Flex align="center" gap={1}>
                    <FiPackage size={12} />
                    Somente Roupas
                  </Flex>
                </Badge>
              )}
            </Flex>

            {!treatment.emergency &&
              !treatment.aprovedValue &&
              !treatment.returned &&
              !treatment.repeat &&
              !treatment.onlyClothes && (
                <Text color="gray.500" fontStyle="italic">
                  Nenhuma característica especial
                </Text>
              )}
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Resumo Financeiro */}
      {treatment.value > 0 && (
        <Card.Root>
          <Card.Body>
            <Stack gap={4}>
              <Text fontSize="lg" fontWeight="medium">
                Resumo Financeiro
              </Text>

              <Flex justify="space-between" align="center" p={4} bg="green.50" borderRadius="md">
                <Text fontWeight="medium">Total do Atendimento</Text>
                <Text fontSize="xl" fontWeight="bold" color="green.700">
                  {formatCurrency(treatment.value)}
                </Text>
              </Flex>

              <Text fontSize="sm" color="gray.600">
                Status: {treatment.aprovedValue ? 'Aprovado' : 'Pendente de aprovação'}
              </Text>
            </Stack>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  )
}
