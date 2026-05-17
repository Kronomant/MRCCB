import { Button, Flex, Tag, Box, NativeSelect, Text, SimpleGrid } from '@chakra-ui/react'
import { FiEdit, FiTrash2, FiAlertCircle } from 'react-icons/fi'
import {
  DrawerForm,
  BaseTable,
  Input,
  PageHeader,
  CurrencyInput,
  PageContainer,
  SyncButton
} from '../../components'
import { statusMap } from './ReunionManager.helper'
import { ReunionManagerViewProps, useReunionManager } from './useReunionManager'
import { ReunionStatus } from '../../types/reunion-status'
import { Controller } from 'react-hook-form'
import SearchInput from './SearchInput'
import { useTutorialContext } from '../../contexts/TutorialContext'
import { useEffect } from 'react'


const buildColumns = (): Column<Reunion>[] => [
  { header: 'Reunião', accessor: 'name' },
  {
    header: 'Status',
    accessor: 'status',
    customRender: (row) => {
      const status = statusMap[row.status] || { label: row.status, colorScheme: 'gray' }
      const hasPending = row.deliveredQuantity !== row.treatmentQuantity
      const colorScheme =
        row.status === ReunionStatus.FINISHED
          ? hasPending
            ? 'orange'
            : 'green'
          : status.colorScheme
      return (
        <Flex gap={2} alignItems="center">
          <Tag.Root colorPalette={colorScheme}>{status.label}</Tag.Root>
          {hasPending && (
            <Text color="orange.400" title="Prontuários com entrega pendente">
              <FiAlertCircle />
            </Text>
          )}
        </Flex>
      )
    }
  },
  { header: 'Qtd. Atendimentos', accessor: 'treatmentQuantity' },
  { header: 'Qtd. Cestas', accessor: 'foodBasketQuantity' },
  {
    header: 'Valor Atendimentos',
    accessor: 'totalAtendimentoValue',
    customRender: (row) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        row.totalAtendimentoValue ?? 0
      )
  },
  {
    header: 'Valor Cestas',
    accessor: 'totalBasketValue',
    customRender: (row) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        row.totalBasketValue ?? 0
      )
  },
  {
    header: 'Devoluções',
    accessor: 'deliveredQuantity',
    customRender: (row) => {
      const total = row.deliveredQuantity ?? 0
      return total > 0 ? (
        <Text fontWeight="medium">{total}</Text>
      ) : (
        <Text color="fg.subtle">—</Text>
      )
    }
  },
  {
    header: 'Data Reunião',
    accessor: 'date',
    customRender: (row) =>
      new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(row.date))
  }
]

const ReunionManagerView = (props: ReunionManagerViewProps) => {
  const {
    drawerOpen,
    isEditMode,
    selectedReunion,
    register,
    control,
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

  const columns = buildColumns()

  const headerActions = (
    <Flex gap={1}>
      {canShowEditButton && (
        <Button size="sm" variant="ghost" onClick={handleEditToggle} colorPalette="blue" title="Editar">
          <FiEdit />
        </Button>
      )}
      {selectedReunion.id !== 0 && (
        <Button size="sm" variant="ghost" onClick={handleDelete} colorPalette="red" title="Excluir">
          <FiTrash2 />
        </Button>
      )}
    </Flex>
  )

  return (
    <PageContainer>
      <Box id="reunioes-header">
        <PageHeader title="Reuniões">
          <Flex gap={2} alignItems="center">
            <SyncButton />
            <Button id="reunioes-add-btn" colorPalette="gray" onClick={handleAddNew}>
              Adicionar reunião
            </Button>
          </Flex>
        </PageHeader>
      </Box>

      <Flex id="reunioes-filters" w="100%" gap={4} alignItems="center" padding="12px 0">
        <Box id="reunioes-search">
          <SearchInput
            onSearch={props.handleSearch}
            placeholder="Pesquisar por nome da reunião..."
            debounceTime={300}
          />
        </Box>
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
        <Flex w="100%" h="100%" position="relative" overflowX="hidden">
          <Box
            id="reunioes-table"
            w={drawerOpen ? 'calc(100% - 400px)' : '100%'}
            h="100%"
            transition="width 0.4s cubic-bezier(.4,0,.2,1)"
          >
            <BaseTable
              drawerOpen={drawerOpen}
              data={reunions || []}
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
              mb={6}
              disabled={!canEdit}
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Data"
              type="date"
              mb={6}
              disabled={!canEdit}
              {...register('date')}
              error={errors.date?.message}
            />
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  label="Valor da reunião"
                  mb={6}
                  disabled={!canEdit}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.value?.message}
                />
              )}
            />
            <Controller
              name="basketValue"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  label="Valor da Cesta"
                  mb={6}
                  disabled={!canEdit}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.basketValue?.message}
                />
              )}
            />

            {selectedReunion.status !== ReunionStatus.NEW && (() => {
              const pending = selectedReunion.treatmentQuantity - (selectedReunion.deliveredQuantity ?? 0)
              return (
                <>
                  <Box my={4} p={4} borderRadius="lg" bg="bg.subtle" border="1px solid" borderColor="border">
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="fg.muted"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={3}
                    >
                      Resumo
                    </Text>
                    <SimpleGrid columns={3} gap={3}>
                      <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {selectedReunion.treatmentQuantity}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">Atendimentos</Text>
                      </Box>
                      <Box textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          {selectedReunion.foodBasketQuantity}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">Cestas</Text>
                      </Box>
                      <Box textAlign="center">
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color={(selectedReunion.deliveredQuantity ?? 0) > 0 ? 'orange.500' : 'fg.muted'}
                        >
                          {selectedReunion.deliveredQuantity ?? 0}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">Devoluções</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                  {pending > 0 && (
                    <Flex
                      align="center"
                      gap={2}
                      px={4}
                      py={3}
                      borderRadius="lg"
                      bg="orange.subtle"
                      border="1px solid"
                      borderColor="orange.emphasized"
                      mb={4}
                    >
                      <Text color="orange.400" flexShrink={0}>
                        <FiAlertCircle />
                      </Text>
                      <Text fontSize="sm" color="orange.fg" fontWeight="medium">
                        {pending === 1
                          ? '1 prontuário com devolução pendente'
                          : `${pending} prontuários com devolução pendente`}
                      </Text>
                    </Flex>
                  )}
                </>
              )
            })()}
          </DrawerForm>
        </Flex>
      </Flex>
    </PageContainer>
  )
}

export const ReunionManager = () => {
  const logic = useReunionManager()
  const { startTutorial, hasSeenTutorial } = useTutorialContext()

  useEffect(() => {
    if (!hasSeenTutorial('reunionManager')) {
      startTutorial('reunionManager')
    }
  }, [])

  return <ReunionManagerView {...logic} />
}

