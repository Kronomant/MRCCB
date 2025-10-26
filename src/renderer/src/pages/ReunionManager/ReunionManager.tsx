import { Button, Flex, InputGroup, Tag } from '@chakra-ui/react'
import { FiSearch, FiEdit } from 'react-icons/fi'
import { DrawerForm, BaseTable, Input, PageHeader } from '../../components'
import { statusMap } from './ReunionManager.helper'
import { ReunionManagerViewProps, useReunionManager } from './useReunionManager'

const columns: Column<Reunion>[] = [
  { header: 'Reunião', accessor: 'name' },
  {
    header: 'Status',
    accessor: 'status',
    customRender: (row) => {
      const status = statusMap[row.status] || { label: row.status, colorScheme: 'gray' }
      return <Tag.Root colorPalette={status.colorScheme}>{status.label}</Tag.Root>
    }
  },
  { header: 'Total', accessor: 'value' },
  { header: 'Qtd. Atendimentos', accessor: 'treatmentQuantity' },
  { header: 'Qtd. Cestas', accessor: 'foodBasketQuantity' },
  { header: 'Data Reunião', accessor: 'date' }
]

const ReunionManagerView = (props: ReunionManagerViewProps) => {
  const {
    drawerOpen,
    isEditMode,
    selectedReunion,
    register,
    errors,
    isSubmitting,
    reunions,
    handleRowClick,
    handleAddNew,
    handleCloseDrawer,
    handleEditToggle,
    title,
    primaryLabel,
    secondaryLabel,
    onPrimaryAction,
    canEdit,
    canShowEditButton,
    editError
  } = props

  const editButton = canShowEditButton ? (
    <Button size="sm" variant="outline" onClick={handleEditToggle} colorPalette="blue">
      <FiEdit />
      Editar
    </Button>
  ) : null

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
            onClose={handleCloseDrawer}
            title={title}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            onPrimaryAction={onPrimaryAction}
            isLoading={isSubmitting}
            headerActions={editButton}
          >
            {editError ? (
              <Tag.Root colorPalette="red" mb={3}>
                {editError}
              </Tag.Root>
            ) : null}

            <Input
              label="Nome da reunião"
              mb={3}
              disabled={!canEdit}
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Data"
              type="date"
              mb={3}
              disabled={!canEdit}
              {...register('date')}
              error={errors.date?.message}
            />
            <Input
              label="Valor da reunião"
              type="number"
              step="0.01"
              mb={3}
              disabled={!canEdit}
              {...register('value', { valueAsNumber: true })}
              error={errors.value?.message}
            />
            <Input
              label="Quantidade de Atendimentos"
              type="number"
              mb={3}
              disabled={!canEdit}
              {...register('treatmentQuantity', { valueAsNumber: true })}
              error={errors.treatmentQuantity?.message}
            />
            <Input
              label="Quantidade de Cestas"
              type="number"
              mb={3}
              disabled={!canEdit}
              {...register('foodBasketQuantity', { valueAsNumber: true })}
              error={errors.foodBasketQuantity?.message}
            />
          </DrawerForm>
        </Flex>
      </Flex>
    </Flex>
  )
}

export const ReunionManager = () => {
  const logic = useReunionManager()
  return <ReunionManagerView {...logic} />
}
