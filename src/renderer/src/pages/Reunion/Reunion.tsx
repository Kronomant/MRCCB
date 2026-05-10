import { Button, Flex, InputGroup, Box, Stack, Text, Checkbox, Tag } from '@chakra-ui/react'
import { PageHeader, DrawerForm, BaseTable, Input, PageContainer } from '../../components'
import { Tooltip } from '../../components/ui/tooltip'
import { FiSearch, FiFilter, FiPlus, FiFileText, FiEye, FiTrash2 } from 'react-icons/fi'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect } from 'react'

import { RecordType } from '../../hooks/records/useRecords'
import { useReunionBehavior, LABEL_COLORS } from './useReunionBehavior'
import { ReunionStatus } from '../../types/reunion-status'
import { ProtocolModal } from '../../components/ProtocolPDF/ProtocolModal'
import { useTutorialContext } from '../../contexts/TutorialContext'
import { CashRegisterTab } from './components/CashRegisterTab'

import { ReunionSummaryCards, ReunionRecordForm, ConfirmationDialog, ReunionCloseDialogBody } from './components'

export const Reunion = () => {
  const { startTutorial, hasSeenTutorial } = useTutorialContext()

  const {
    navigate,
    drawerOpen,
    setDrawerOpen,
    search,
    setSearch,
    formState,
    isLoading,
    summary,
    filteredRecords,
    records,
    filteredProntuarios,
    prontuarios,
    unities,
    handlers,
    closeModalOpen,
    setCloseModalOpen,
    reopenModalOpen,
    setReopenModalOpen,
    reunionStatus,
    protocolModalOpen,
    setProtocolModalOpen,
    reunion,
    reunionId
  } = useReunionBehavior()

  useEffect(() => {
    if (!hasSeenTutorial('reunion')) {
      startTutorial('reunion')
    }
  }, [])

  const { record, prontuarioSearch, isNewProntuario, selectedUnityId } = formState
  const isClosed = reunionStatus === ReunionStatus.FINISHED

  const columns = [
    {
      header: 'Prontuário',
      accessor: 'prontuarioNumber',
      customRender: (row: RecordType) => (
        <Flex>
          {row.prontuarioNumber}
          {row.ministerio === true ? (
            <Tag.Root colorPalette="blue" ml={2}>
              A
            </Tag.Root>
          ) : null}
        </Flex>
      )
    },
    {
      header: 'Valor (R$)',
      accessor: 'valor',
      customRender: (row: RecordType) =>
        row.valor > 0 ? `R$ ${row.valor}` : <Text color="gray.400">R$ 0</Text>
    },
    { header: 'Cestas', accessor: 'cestas' },
    {
      header: 'Labels',
      accessor: 'labels',
      customRender: (row: RecordType) => (
        <Flex gap={1} wrap="wrap">
          {row.labels.map((label: string) => (
            <Tag.Root colorPalette={LABEL_COLORS[label] || 'gray'} key={label}>
              {label}
            </Tag.Root>
          ))}
        </Flex>
      )
    },
    ...(isClosed
      ? [
          {
            header: 'Devolvido',
            accessor: 'delivered',
            customRender: (row: RecordType) => (
              <Checkbox.Root
                checked={row.delivered}
                onClick={(e) => {
                  e.stopPropagation()
                  handlers.handleToggleDelivery(row.id, row.delivered)
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            )
          }
        ]
      : []),
    {
      header: 'Ações',
      customRender: (row: RecordType) => (
        <Flex gap={2}>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handlers.handleView(row)
            }}
          >
            <FiEye />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handlers.handleDelete(row.id)
            }}
          >
            <FiTrash2 />
          </Button>
        </Flex>
      )
    }
  ]

  const formattedDate = summary.data
    ? format(parseISO(summary.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR }).replace(
        /de ([a-z])/g,
        (match) => match.replace(match[3], match[3].toUpperCase())
      )
    : ''

  return (
    <PageContainer>
      <Stack gap={8}>
        <Box id="reunion-header">
          <PageHeader title="Reunião" onBack={() => navigate('/reunioes')}>
            <Text color="fg.muted" fontSize="md" ml={4}>
              {formattedDate}
            </Text>
            {!isClosed && (
              <Button colorScheme="red" ml={4} onClick={() => setCloseModalOpen(true)}>
                Encerrar Reunião
              </Button>
            )}
            {isClosed && (
              <Flex gap={4}>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setReopenModalOpen(true)}
                >
                  Reabrir Reunião
                </Button>
                <Tooltip content="Gerar protocolo da reunião">
                  <Button colorScheme="green" onClick={() => setProtocolModalOpen(true)}>
                    <FiFileText /> Gerar Protocolo
                  </Button>
                </Tooltip>
              </Flex>
            )}
          </PageHeader>
        </Box>

        <Box id="reunion-summary">
          <ReunionSummaryCards summary={summary} isClosed={isClosed} reunion={reunion} />
        </Box>

        <Box>
          <Flex id="reunion-search" mb={4} gap={3} align="center">
            <InputGroup endElement={<FiSearch />} w="300px">
              <Input
                borderRadius="3xl"
                label="Pesquisar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Button variant="outline">
              <FiFilter />
              Filtros
            </Button>
            {!isClosed && (
              <Button id="reunion-add-btn" colorScheme="blue" onClick={handlers.handleAdd}>
                <FiPlus />
                Adicionar
              </Button>
            )}
          </Flex>

          <CashRegisterTab
              reunionId={reunionId}
              reunionStatus={reunionStatus}
              summary={{
                totalGasto: summary.totalGasto,
                cestas: summary.cestas
              }}
              basketValue={reunion?.basketValue || 200}
            />

          <Flex w="100%" h="70vh" pb={10}>
            <Flex w="100%" h="100%" position="relative" overflow="hidden">
              <Box
                id="reunion-table"
                w={drawerOpen ? 'calc(100% - 400px)' : '100%'}
                h="100%"
                transition="width 0.4s cubic-bezier(.4,0,.2,1)"
              >
                <BaseTable
                  drawerOpen={drawerOpen}
                  data={filteredRecords}
                  columns={columns as Column<RecordType>[]}
                  isLoading={isLoading}
                />
              </Box>

              <DrawerForm
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={record.id === 0 ? 'Novo Atendimento' : 'Editar Atendimento'}
                primaryLabel="Salvar"
                secondaryLabel="Cancelar"
                onPrimaryAction={handlers.handleSave}
                headerActions={
                  isClosed &&
                  record.id !== 0 && (
                    <Button
                      size="sm"
                      colorPalette={record.delivered ? 'gray' : 'orange'}
                      onClick={() =>
                        handlers.handleToggleDelivery(record.id, record.delivered)
                      }
                    >
                      {record.delivered ? 'DEVOLVIDO' : 'DEVOLVER'}
                    </Button>
                  )
                }
              >
                <ReunionRecordForm
                  record={record}
                  prontuarioSearch={prontuarioSearch}
                  isNewProntuario={isNewProntuario}
                  selectedUnityId={selectedUnityId}
                  filteredProntuarios={filteredProntuarios}
                  collection={handlers.collection}
                  unities={unities}
                  onRecordChange={handlers.updateRecord}
                  onProntuarioSelect={handlers.handleProntuarioSelect}
                  onProntuarioSearch={handlers.updateProntuarioSearch}
                  onUnityChange={handlers.updateUnityId}
                />
              </DrawerForm>
            </Flex>
          </Flex>
        </Box>

        <ConfirmationDialog
          open={reopenModalOpen}
          onClose={() => setReopenModalOpen(false)}
          title="Confirmar Reabertura"
          onConfirm={handlers.handleReopenReunion}
          confirmLabel="Confirmar Reabertura"
          confirmColorPalette="blue"
        >
          <Stack gap={4}>
            <Text fontSize="md">
              Você está prestes a reabrir esta reunião. Deseja continuar?
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Ao reabrir, você poderá adicionar novos atendimentos e editar os existentes.
            </Text>
          </Stack>
        </ConfirmationDialog>

        <ConfirmationDialog
          open={closeModalOpen}
          onClose={() => setCloseModalOpen(false)}
          title="Confirmar Encerramento"
          onConfirm={handlers.handleCloseReunion}
          confirmLabel="Confirmar Encerramento"
          confirmColorPalette="red"
        >
          <ReunionCloseDialogBody summary={summary} reunion={reunion} />
        </ConfirmationDialog>

        <ProtocolModal
          isOpen={protocolModalOpen}
          onClose={() => setProtocolModalOpen(false)}
          records={records}
          unities={unities}
          prontuarios={prontuarios}
          date={summary.data}
        />
      </Stack>
    </PageContainer>
  )
}
