import { Button, Flex, InputGroup, Tag, Stack, Text, Box } from '@chakra-ui/react'
import { PageHeader } from '../../components'
import { FiSearch } from 'react-icons/fi'
import { BaseTable } from '../../components/Table/BaseTable'
import { DrawerForm } from '../../components/DrawerForm'
import { useState } from 'react'
import { Input } from '../../components/Input'
import { useAllTreatments } from '../../hooks/treatment'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTreatmentSchema, CreateTreatment } from '../../schemas/treatmentSchema'
import { TreatmentDetail } from './TreatmentDetail'

const statusMap = {
  entregues: { label: 'Entregues', colorScheme: 'green' },
  pendente: { label: 'Pendente', colorScheme: 'orange' },
  sem_atendimentos: { label: 'Sem atendimentos', colorScheme: 'blue' }
}

const getStatusColor = (treatment: Treatment) => {
  if (treatment.returned) return 'green'
  if (treatment.emergency) return 'red'
  if (treatment.aprovedValue) return 'blue'
  return 'gray'
}

const getStatusLabel = (treatment: Treatment) => {
  if (treatment.returned) return 'Entregue'
  if (treatment.emergency) return 'Emergencial'
  if (treatment.aprovedValue) return 'Aprovado'
  return 'Pendente'
}

const getStatusFromTreatment = (treatment: Treatment) => {
  if (treatment.returned) return 'entregues'
  if (treatment.emergency) return 'pendente'
  return 'sem_atendimentos'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const getAssistanceType = (treatment: Treatment) => {
  const types = []
  if (treatment.value > 0) types.push('Valor')
  if (treatment.foodBasketQuantity > 0) types.push('Cestas básicas')
  if (treatment.onlyClothes) types.push('Roupas')
  return types.join(', ') || 'Não especificado'
}

const InfoSection: React.FC<{ treatment: Treatment }> = ({ treatment }) => {
  const status = getStatusFromTreatment(treatment)
  const statusInfo = statusMap[status] || { label: status, colorScheme: 'gray' }

  return (
    <Stack color="fg" gap={2} mb={6}>
      <Text>
        <b>Status:</b> <Tag.Root colorPalette={statusInfo.colorScheme}>{statusInfo.label}</Tag.Root>
      </Text>
      <Text>
        <b>Prontuário:</b> {treatment.enchiridionId}
      </Text>
      <Text>
        <b>Valor:</b> {formatCurrency(treatment.value)}
      </Text>
      <Text>
        <b>Cestas básicas:</b> {treatment.foodBasketQuantity}
      </Text>
      <Text>
        <b>Tipo de assistência:</b> {getAssistanceType(treatment)}
      </Text>
    </Stack>
  )
}

const columns = [
  { header: 'Prontuário', accessor: 'enchiridionId' },
  {
    header: 'Status',
    accessor: 'id',
    customRender: (row) => {
      return (
        <Tag.Root colorPalette={getStatusColor(row)} size="sm">
          {getStatusLabel(row)}
        </Tag.Root>
      )
    }
  },
  {
    header: 'Ministério',
    accessor: 'unityId',
    customRender: (row) => {
      // Aqui você pode mapear o unityId para o nome da unidade
      return `Unidade ${row.unityId}`
    }
  },
  {
    header: 'Último atendimento',
    accessor: 'date',
    customRender: (row) => formatDate(row.date)
  },
  {
    header: 'Comum',
    accessor: 'enchiridionId',
    customRender: (row) => `Atendido ${row.enchiridionId}`
  }
]

const defaultFormValues: CreateTreatment = {
  enchiridionId: 1,
  reunionId: 1,
  unityId: 1,
  date: new Date().toISOString().split('T')[0],
  aprovedValue: false,
  value: 0,
  foodBasketQuantity: 0,
  onlyClothes: false,
  emergency: false,
  returned: false,
  repeat: false
}

export const TreatmentManager = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<number | null>(null)
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CreateTreatment>({
    resolver: zodResolver(createTreatmentSchema),
    defaultValues: defaultFormValues
  })

  const {
    treatments: { data: treatments = [], isLoading },
    createTreatment,
    updateTreatment,
    deleteTreatment
  } = useAllTreatments()

  const filteredTreatments = treatments.filter(
    (treatment) =>
      treatment.enchiridionId.toString().includes(searchTerm) ||
      treatment.id.toString().includes(searchTerm)
  )

  const onSubmit = async (data: CreateTreatment) => {
    try {
      console.log('Dados do formulário:', data)
      if (editingTreatment) {
        console.log('Atualizando prontuário:', editingTreatment.id)
        await updateTreatment.mutateAsync({ id: editingTreatment.id, ...data })
      } else {
        console.log('Criando novo prontuário')
        const result = await createTreatment.mutateAsync(data)
        console.log('Resultado da criação:', result)
      }
      setIsDrawerOpen(false)
      setEditingTreatment(null)
      reset()
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error)
    }
  }

  const handleView = (treatment: Treatment) => {
    // Abrir edição via Drawer ao clicar na linha (alinhado ao ReunionManager)
    setEditingTreatment(treatment)
    reset({
      enchiridionId: treatment.enchiridionId,
      reunionId: treatment.reunionId,
      unityId: treatment.unityId,
      date: treatment.date,
      aprovedValue: treatment.aprovedValue,
      value: treatment.value,
      foodBasketQuantity: treatment.foodBasketQuantity,
      onlyClothes: treatment.onlyClothes,
      emergency: treatment.emergency,
      returned: treatment.returned,
      repeat: treatment.repeat
    })
    setIsDrawerOpen(true)
  }

  const handleDelete = async (treatment: Treatment) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o prontuário #${treatment.enchiridionId}?`
    )
    if (confirmed) {
      try {
        await deleteTreatment.mutateAsync(treatment.id)
      } catch (error) {
        console.error('Erro ao deletar prontuário:', error)
      }
    }
  }

  const handleCloseDetail = () => {
    setViewMode('list')
    setSelectedTreatmentId(null)
  }

  const handleNewTreatment = () => {
    setEditingTreatment(null)
    reset()
    setIsDrawerOpen(true)
  }

  // Remover visualização em página separada para manter layout consistente
  // if (viewMode === 'detail' && selectedTreatmentId) {
  //   return (
  //     <TreatmentDetail
  //       treatmentId={selectedTreatmentId}
  //       onClose={handleCloseDetail}
  //       onEdit={handleEdit}
  //     />
  //   )
  // }

  return (
    <Flex
      p="24px"
      flexDir="column"
      gap="48px"
      w="100%"
      h="100%"
      backgroundColor="bg"
      borderRadius="8px"
    >
      <PageHeader title="Prontuários">
        <Button colorPalette="gray" onClick={handleNewTreatment}>
          Adicionar prontuário
        </Button>
      </PageHeader>

      <Flex w="60%">
        <InputGroup endElement={<FiSearch />}>
          <Input
            borderRadius="3xl"
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Flex w="100%" h="70vh">
        <Flex w="100%" h="100%" gap={16} position="relative">
          <BaseTable
            drawerOpen={isDrawerOpen}
            data={filteredTreatments}
            columns={columns}
            isLoading={isLoading}
            onRowClick={(treatment) => handleView(treatment)}
          />

          <DrawerForm
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false)
              setEditingTreatment(null)
              reset()
            }}
            title={editingTreatment ? 'Editar Prontuário' : 'Novo Prontuário'}
            primaryLabel={'Salvar'}
            secondaryLabel={'Cancelar'}
            onSecondaryAction={() => {
              setIsDrawerOpen(false)
              setEditingTreatment(null)
              reset()
            }}
            onPrimaryAction={handleSubmit(onSubmit)}
            isLoading={createTreatment.isPending || updateTreatment.isPending}
          >
            {editingTreatment && <InfoSection treatment={editingTreatment} />}

            <Stack gap={4}>
              <Input
                label="Prontuário (Enchiridion)"
                type="number"
                {...register('enchiridionId', { valueAsNumber: true })}
                error={errors.enchiridionId?.message}
                placeholder="Número do prontuário"
              />

              <Input
                label="Reunião"
                type="number"
                {...register('reunionId', { valueAsNumber: true })}
                error={errors.reunionId?.message}
                placeholder="ID da reunião"
              />

              <Input
                label="Unidade"
                type="number"
                {...register('unityId', { valueAsNumber: true })}
                error={errors.unityId?.message}
                placeholder="ID da unidade"
              />

              <Input
                label="Data do Atendimento"
                type="date"
                {...register('date')}
                error={errors.date?.message}
              />

              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                {...register('value', { valueAsNumber: true })}
                error={errors.value?.message}
                placeholder="0.00"
              />

              <Input
                label="Quantidade de Cestas Básicas"
                type="number"
                {...register('foodBasketQuantity', { valueAsNumber: true })}
                error={errors.foodBasketQuantity?.message}
                placeholder="0"
              />

              <Stack gap={3}>
                <Text fontWeight="medium">Opções de Atendimento</Text>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input type="checkbox" {...register('aprovedValue')} />
                  <Text>Valor aprovado</Text>
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input type="checkbox" {...register('onlyClothes')} />
                  <Text>Somente roupas</Text>
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input type="checkbox" {...register('emergency')} />
                  <Text>Emergencial</Text>
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input type="checkbox" {...register('returned')} />
                  <Text>Retornado/Entregue</Text>
                </label>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input type="checkbox" {...register('repeat')} />
                  <Text>Repetir atendimento</Text>
                </label>
              </Stack>
            </Stack>
          </DrawerForm>
        </Flex>
      </Flex>
    </Flex>
  )
}
