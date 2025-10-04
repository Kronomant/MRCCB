import { Button, Flex, InputGroup, Tag, Stack, Text, Box } from '@chakra-ui/react'
import { PageHeader } from '../../components'
import { FiSearch } from 'react-icons/fi'
import { BaseTable } from '../../components/Table/BaseTable'
import { DrawerForm } from '../../components/DrawerForm'
import { useState } from 'react'
import { ReunionStatus } from '../../types/reunion-status'
import { RenderDrawerContent } from './ReunionManager.helper'
import { Input } from '../../components/Input'
import { useNavigate } from 'react-router-dom'
import { useReunions } from '../../hooks/reunion/useReunions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reunionFormSchema, ReunionFormData } from '../../schemas/reunionSchema'

const statusMap = {
  [ReunionStatus.NEW]: { label: 'Prevista', colorScheme: 'green' },
  [ReunionStatus.IN_PROGRESS]: { label: 'Em Andamento', colorScheme: 'blue' },
  [ReunionStatus.FINISHED]: { label: 'Encerrada', colorScheme: 'orange' }
}

const InfoSection: React.FC<{ reunion: Reunion }> = ({ reunion }) => (
  <Stack color="fg" gap={2} mb={6}>
    <Text>
      <b>Status:</b>{' '}
      <Tag.Root colorPalette={statusMap[reunion.status]?.colorScheme || 'gray'}>
        {statusMap[reunion.status]?.label || reunion.status}
      </Tag.Root>
    </Text>
    <Text>
      <b>Qtd. Atendimentos:</b> {reunion.treatmentQuantity}
    </Text>
    <Text>
      <b>Qtd. Cestas:</b> {reunion.foodBasketQuantity}
    </Text>
    <Text>
      <b>Valor total:</b> R$ {reunion.value}
    </Text>
  </Stack>
)

const columns: Column<Reunion>[] = [
  { header: 'Reunião', accessor: 'id' },
  { header: 'Reunião', accessor: 'name' },
  {
    header: 'Status',
    accessor: 'status',
    customRender: (row) => {
      const status = statusMap[row.status] || { label: row.status, colorScheme: 'gray' }
      return <Tag.Root colorPalette={status.colorScheme}>{status.label}</Tag.Root>
    }
  },
  { header: 'Qtd. Atendimentos', accessor: 'treatmentQuantity' },
  { header: 'Qtd. Cestas', accessor: 'foodBasketQuantity' },
  { header: 'Total', accessor: 'value' },
  { header: 'Data Reunião', accessor: 'date' }
]

const defaultReunion: Reunion = {
  id: 0,
  name: '',
  value: 0,
  treatmentQuantity: 0,
  foodBasketQuantity: 0,
  date: '',
  status: ReunionStatus.NEW
}

const defaultFormValues: ReunionFormData = {
  id: 0,
  name: '',
  value: 0,
  treatmentQuantity: 0,
  foodBasketQuantity: 0,
  date: '',
  status: ReunionStatus.NEW
}

export const ReunionManager = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReunion, setSelectedReunion] = useState<Reunion>(defaultReunion)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ReunionFormData>({
    resolver: zodResolver(reunionFormSchema),
    defaultValues: defaultFormValues
  })

  const fields = watch()

  console.log(fields)

  const { reunions, createReunion, updateReunion } = useReunions()

  const handleRowClick = (reunion: Reunion) => {
    setSelectedReunion(reunion)
    reset({
      id: reunion.id,
      name: reunion.name,
      value: reunion.value,
      treatmentQuantity: reunion.treatmentQuantity,
      foodBasketQuantity: reunion.foodBasketQuantity,
      date: reunion.date,
      status: reunion.status
    })
    setDrawerOpen(true)
  }

  const handleAddNew = () => {
    setSelectedReunion(defaultReunion)
    reset(defaultFormValues)
    setDrawerOpen(true)
  }

  const handleStartOrAccess = () => {
    if (selectedReunion.status === ReunionStatus.NEW) {
      setSelectedReunion((prev) => ({ ...prev, status: ReunionStatus.IN_PROGRESS }))
    } else if (selectedReunion.status === ReunionStatus.IN_PROGRESS) {
      navigate(`/reunioes/${selectedReunion.id}`)
    }
  }

  const onSubmit = async (data: ReunionFormData) => {
    try {
      if (selectedReunion.id === 0) {
        // Criando nova reunião
        await createReunion.mutateAsync({
          name: data.name,
          date: data.date,
          value: data.value,
          treatmentQuantity: data.treatmentQuantity,
          foodBasketQuantity: data.foodBasketQuantity,
          status: data.status
        })
      } else {
        // Atualizando reunião existente
        await updateReunion.mutateAsync({
          id: selectedReunion.id || 0,
          name: data.name,
          date: data.date,
          value: data.value,
          treatmentQuantity: data.treatmentQuantity,
          foodBasketQuantity: data.foodBasketQuantity,
          status: data.status
        })
      }

      // Fechar drawer após sucesso
      setDrawerOpen(false)
      reset(defaultFormValues)
      setSelectedReunion(defaultReunion)
    } catch (error) {
      console.error('Erro ao salvar reunião:', error)
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  }

  const renderDrawerContent = () => (
    <>
      <InfoSection reunion={selectedReunion} />
      {(selectedReunion.status === ReunionStatus.NEW ||
        selectedReunion.status === ReunionStatus.IN_PROGRESS) && (
        <>
          <Box as="hr" borderWidth="1px" borderColor="gray.200" my={4} />
          <Button
            colorPalette={selectedReunion.status === ReunionStatus.NEW ? 'green' : 'blue'}
            w="100%"
            variant="surface"
            onClick={handleStartOrAccess}
          >
            {selectedReunion.status === ReunionStatus.NEW ? 'Iniciar Reunião' : 'Acessar Reunião'}
          </Button>
        </>
      )}
    </>
  )

  const { title, primaryLabel, secondaryLabel } = RenderDrawerContent(selectedReunion.status)

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
      <PageHeader title="Reuniões">
        <Button colorPalette="gray" onClick={handleAddNew}>
          Adicionar reunião
        </Button>
      </PageHeader>

      <Flex w="60%">
        <InputGroup endElement={<FiSearch />}>
          <Input borderRadius="3xl" label="Buscar" />
        </InputGroup>
      </Flex>

      <Flex w="100%" h="70vh">
        <Flex w="100%" h="100%" gap={16} position="relative">
          <BaseTable
            drawerOpen={drawerOpen}
            data={reunions.data || []}
            columns={columns}
            isLoading={false}
            onRowClick={handleRowClick}
          />

          <DrawerForm
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title={title}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            onPrimaryAction={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            <Input
              label="Nome da reunião"
              mb={3}
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Data"
              type="date"
              mb={3}
              {...register('date')}
              error={errors.date?.message}
            />
            <Input
              label="Valor da reunião"
              type="number"
              step="0.01"
              mb={3}
              {...register('value', { valueAsNumber: true })}
              error={errors.value?.message}
            />
            <Input
              label="Quantidade de Atendimentos"
              type="number"
              mb={3}
              {...register('treatmentQuantity', { valueAsNumber: true })}
              error={errors.treatmentQuantity?.message}
            />
            <Input
              label="Quantidade de Cestas"
              type="number"
              mb={3}
              {...register('foodBasketQuantity', { valueAsNumber: true })}
              error={errors.foodBasketQuantity?.message}
            />
            {renderDrawerContent()}
          </DrawerForm>
        </Flex>
      </Flex>
    </Flex>
  )
}
