import { Button, Flex, InputGroup, Tag, Box, NativeSelect, Text } from '@chakra-ui/react'
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi'
import { DrawerForm, BaseTable, Input, PageHeader } from '../../components'
import { statusMap } from './ReunionManager.helper'
import { ReunionManagerViewProps, useReunionManager } from './useReunionManager'
import { ReunionStatus } from '../../types/reunion-status'

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
    editError,
    handleDelete
  } = props

  const headerActions = (
    <Flex gap={2}>
      {canShowEditButton && (
        <Button size="sm" variant="outline" onClick={handleEditToggle} colorPalette="blue">
          <FiEdit />
          Editar
        </Button>
      )}
      {selectedReunion.id !== 0 && (
        <Button size="sm" variant="outline" onClick={handleDelete} colorPalette="red">
          <FiTrash2 />
          Excluir
        </Button>
      )}
    </Flex>
  )

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

      <Flex w="100%" gap={4} alignItems="center" padding="12px 0">
        <InputGroup w="40%" endElement={<FiSearch />}>
          <Input borderRadius="3xl" label="Buscar" />
        </InputGroup>
        <Input
          type="date"
          width="180px"
          value={props.startDateInput}
          onChange={(e) => props.setStartDateInput(e.target.value)}
          label="Data Início"
          borderRadius="3xl"
        />
        <Input
          type="date"
          width="180px"
          value={props.endDateInput}
          onChange={(e) => props.setEndDateInput(e.target.value)}
          label="Data Fim"
          borderRadius="3xl"
        />
        <NativeSelect.Root width="280px" size="md">
          <NativeSelect.Field
            borderRadius="3xl"
            value={props.statusInput}
            onChange={(e) => props.setStatusInput(e.currentTarget.value)}
          >
            <option value="">Status: Todos</option>
            <option value={ReunionStatus.NEW}>Prevista</option>
            <option value={ReunionStatus.IN_PROGRESS}>Em andamento</option>
            <option value={ReunionStatus.FINISHED}>Encerrada</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Button onClick={props.handleFilter} variant="outline">
          Filtrar
        </Button>
      </Flex>

      <Flex w="100%" h="70vh">
        <Flex w="100%" h="100%" position="relative">
          <Box
            w={drawerOpen ? 'calc(100% - 400px)' : '100%'}
            h="100%"
            transition="width 0.4s cubic-bezier(.4,0,.2,1)"
          >
            <BaseTable
              drawerOpen={drawerOpen}
              data={reunions.data || []}
              columns={columns}
              isLoading={false}
              onRowClick={handleRowClick}
            />
          </Box>{' '}
          <DrawerForm
            isOpen={drawerOpen}
            onClose={handleCloseDrawer}
            title={title}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            onPrimaryAction={onPrimaryAction}
            isLoading={isSubmitting}
            headerActions={headerActions}
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

            {selectedReunion.status !== ReunionStatus.NEW && (
              <Flex justifyContent="space-around" my={4}>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold">
                    {selectedReunion.treatmentQuantity}
                  </Text>
                  <Text>Atendimentos</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold">
                    {selectedReunion.foodBasketQuantity}
                  </Text>
                  <Text>Cestas</Text>
                </Box>
              </Flex>
            )}
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
