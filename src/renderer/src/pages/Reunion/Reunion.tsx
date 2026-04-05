import {
  Button,
  Flex,
  InputGroup,
  Box,
  Stack,
  Text,
  Checkbox,
  SimpleGrid,
  Tag,
  SelectRoot,
  SelectLabel,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  SelectItemText,
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxControl,
  ComboboxPositioner,
  ComboboxIndicatorGroup,
  ComboboxClearTrigger,
  Portal,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
  Tabs,
} from '@chakra-ui/react'

import { createListCollection } from '@ark-ui/react/collection'
import { PageHeader, DrawerForm, BaseTable, Input, CurrencyInput, PageContainer } from '../../components'
import { Tooltip } from '../../components/ui/tooltip'
import { FiSearch, FiFilter, FiPlus, FiTrash2, FiFileText, FiEye, FiList, FiDollarSign } from 'react-icons/fi'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { RecordType } from '../../hooks/records/useRecords'
import { useReunionBehavior, LABEL_COLORS } from './useReunionBehavior'
import { useEffect } from 'react'
import { ReunionStatus } from '../../types/reunion-status'
import { ProtocolModal } from '../../components/ProtocolPDF/ProtocolModal'
import { useTutorialContext } from '../../contexts/TutorialContext'
import { CashRegisterTab } from './components/CashRegisterTab'

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

  const { record, prontuarioSearch, prontuarioError, selectedUnityId } = formState
  const isClosed = reunionStatus === ReunionStatus.FINISHED

  // Table columns
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
            header: 'Entregue',
            accessor: 'delivered',
            customRender: (row: RecordType) => (
              <Checkbox.Root
                checked={row.delivered}
                readOnly
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

  const drawerContent = (
    <Stack gap={6}>
      <ComboboxRoot
        collection={handlers.collection}
        value={
          record.prontuarioId
            ? [String(record.prontuarioId)]
            : formState.isNewProntuario && record.prontuarioNumber
              ? [`new-${record.prontuarioNumber}`]
              : []
        }
        onValueChange={(details) => {
          const val = details.value[0]
          handlers.handleProntuarioSelect(val || '')
        }}
        onInputValueChange={(details) => {
          handlers.updateProntuarioSearch(details.inputValue)
        }}
        inputValue={prontuarioSearch}
        allowCustomValue
      >
        <ComboboxLabel>Prontuário</ComboboxLabel>
        <ComboboxControl>
          <ComboboxInput placeholder="Selecione ou digite um prontuário" />
          <ComboboxIndicatorGroup>
            <ComboboxClearTrigger />
            <ComboboxTrigger />
          </ComboboxIndicatorGroup>
        </ComboboxControl>
        <Portal>
          <ComboboxPositioner>
            <ComboboxContent>
              {filteredProntuarios.map((item) => (
                <ComboboxItem
                  key={item.value}
                  item={item}
                  onPointerDown={(e) => {
                    e.preventDefault()
                  }}
                >
                  <ComboboxItemText>
                    {item.value.startsWith('new-') ? `+ Criar "${item.label}"` : item.label}
                  </ComboboxItemText>
                  <ComboboxItemIndicator />
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </ComboboxPositioner>
        </Portal>
      </ComboboxRoot>

      <SelectRoot
        collection={createListCollection<{ label: string; value: string }>({
          items: (unities || []).map((u) => ({ label: u.name, value: String(u.id) }))
        })}
        value={[selectedUnityId ? String(selectedUnityId) : '']}
        onValueChange={(details: { value: string[] }) =>
          handlers.updateUnityId(Number(details.value[0]))
        }
      >
        <SelectLabel>Unidade</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder="Selecione a unidade" />
        </SelectTrigger>
        <SelectContent>
          {(unities || []).map((u) => (
            <SelectItem key={u.id} item={String(u.id)}>
              <SelectItemText>{u.name}</SelectItemText>
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      <CurrencyInput
        label="Valor"
        value={record.valor}
        onChange={(val) => handlers.updateRecord({ valor: val })}
      />
      <Input
        label="Quantidade de Cestas"
        type="number"
        value={record.cestas}
        onFocus={(e) => e.target.select()}
        onChange={(e) => handlers.updateRecord({ cestas: Number(e.target.value) })}
      />

      <Stack gap={2} mt={2}>
        <Checkbox.Root
          checked={record.ministerio}
          onCheckedChange={(details) => handlers.updateRecord({ ministerio: !!details.checked })}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Ministério</Checkbox.Label>
        </Checkbox.Root>
        {Object.keys(LABEL_COLORS).map((flag) => (
          <Checkbox.Root
            key={flag}
            checked={record.labels.includes(flag)}
            onCheckedChange={(details) => {
              const checked = !!details.checked
              const newLabels = checked
                ? [...record.labels, flag]
                : record.labels.filter((l) => l !== flag)
              handlers.updateRecord({ labels: newLabels })
            }}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{flag}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </Stack>
  )

  const renderSummary = () => {
    if (isClosed) {
      return (
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} w="100%">
          <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
            <Text color="fg.muted" fontSize="sm">
              Total Gasto
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              R$ {summary.totalGasto.toLocaleString('pt-BR')}
            </Text>
          </Box>
          <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
            <Text color="fg.muted" fontSize="sm">
              Prontuários Entregues
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              {summary.entregues}/{summary.atendimentos}
            </Text>
          </Box>
          <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
            <Text color="fg.muted" fontSize="sm">
              Atendimentos Realizados
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              {summary.atendimentos}
            </Text>
          </Box>
          <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
            <Text color="fg.muted" fontSize="sm">
              Cestas Entregues
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              {summary.cestas}
            </Text>
          </Box>
        </SimpleGrid>
      )
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} w="100%">
        <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
          <Text color="fg.muted" fontSize="sm">
            Total Atribuído
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            R$ {summary.totalAtribuido.toLocaleString('pt-BR')}
          </Text>
        </Box>
        <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
          <Text color="fg.muted" fontSize="sm">
            Atendimentos Realizados
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {summary.atendimentos}
          </Text>
        </Box>
        <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
          <Text color="fg.muted" fontSize="sm">
            Cestas Entregues
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {summary.cestas}
          </Text>
        </Box>
        <Box bg="bg.subtle" p={5} rounded="md" minW="180px">
          <Text color="fg.muted" fontSize="sm">
            Total Gasto
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            R$ {summary.totalGasto.toLocaleString('pt-BR')}
          </Text>
        </Box>
      </SimpleGrid>
    )
  }

  return (
    <PageContainer>
      <Stack gap={8}>
      <Box id="reunion-header">
        <PageHeader title="Reunião" onBack={() => navigate('/reunioes')}>
          <Text color="fg.muted" fontSize="md" ml={4}>
            {summary.data
              ? format(parseISO(summary.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR }).replace(
                  /de ([a-z])/g,
                  (match) => match.replace(match[3], match[3].toUpperCase())
                )
              : ''}
          </Text>
          {!isClosed && (
            <Button colorScheme="red" ml={4} onClick={() => setCloseModalOpen(true)}>
              Encerrar Reunião
            </Button>
          )}
          {isClosed && (
            <Flex gap={4}>
              <Button colorScheme="blue" variant="outline" onClick={() => setReopenModalOpen(true)}>
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

        <Tabs.Root defaultValue="atendimentos" variant="subtle">
          <Tabs.List mb={6}>
            <Tabs.Trigger value="atendimentos">
              <FiList style={{ marginRight: '8px' }} /> Atendimentos
            </Tabs.Trigger>
            <Tabs.Trigger value="caixa">
              <FiDollarSign style={{ marginRight: '8px' }} /> Caixa
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="atendimentos">
            <Stack gap={8}>
              <Box id="reunion-summary">{renderSummary()}</Box>

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
                        columns={columns as any}
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
                            colorPalette={record.delivered ? 'gray' : 'green'}
                            onClick={() =>
                              handlers.handleToggleDelivery(record.prontuarioId, record.delivered)
                            }
                          >
                            {record.delivered ? 'ENTREGUE' : 'ENTREGAR'}
                          </Button>
                        )
                      }
                    >
                      {drawerContent}
                    </DrawerForm>
                  </Flex>
                </Flex>
              </Box>
            </Stack>
          </Tabs.Content>

          <Tabs.Content value="caixa">
            <CashRegisterTab
              reunionId={reunionId}
              reunionStatus={reunionStatus}
              summary={{
                totalGasto: summary.totalGasto,
                cestas: summary.cestas
              }}
              basketValue={reunion?.basketValue || 200}
            />
          </Tabs.Content>
        </Tabs.Root>

      {/* Modal de confirmação para reabrir reunião */}
      <DialogRoot
        open={reopenModalOpen}
        onOpenChange={(e) => setReopenModalOpen(e.open)}
        placement="center"
      >
        <DialogBackdrop />
        <Portal>
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Reabertura</DialogTitle>
                <DialogCloseTrigger />
              </DialogHeader>
              <DialogBody>
                <Stack gap={4}>
                  <Text fontSize="md">
                    Você está prestes a reabrir esta reunião. Deseja continuar?
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Ao reabrir, você poderá adicionar novos atendimentos e editar os existentes.
                  </Text>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReopenModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    handlers.handleReopenReunion()
                    setReopenModalOpen(false)
                  }}
                >
                  Confirmar Reabertura
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>

      {/* Modal de confirmação para encerrar reunião */}
      <DialogRoot
        open={closeModalOpen}
        onOpenChange={(e) => setCloseModalOpen(e.open)}
        placement="center"
      >
        <DialogBackdrop />
        <Portal>
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Encerramento</DialogTitle>
                <DialogCloseTrigger />
              </DialogHeader>
              <DialogBody>
                <Stack gap={4}>
                  <Text fontSize="md" mb={2}>
                    Você está prestes a encerrar esta reunião. Confira os dados:
                  </Text>

                  <Box bg="bg.subtle" p={4} rounded="md">
                    <Stack gap={2}>
                      <Flex justify="space-between">
                        <Text fontWeight="semibold">Valor Total (Atendimentos + Cestas):</Text>
                        <Text>
                          R${' '}
                          {(
                            summary.totalGasto +
                            summary.cestas * (reunion?.basketValue || 0)
                          ).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2
                          })}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="semibold">Valor Atendimentos:</Text>
                        <Text>
                          R${' '}
                          {summary.totalGasto.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2
                          })}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="semibold">Valor Cestas:</Text>
                        <Text>
                          R${' '}
                          {(
                            summary.cestas * (reunion?.basketValue || 0)
                          ).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2
                          })}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="semibold">Cestas Associadas:</Text>
                        <Text>{summary.cestas}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="semibold">Atendimentos Realizados:</Text>
                        <Text>{summary.atendimentos}</Text>
                      </Flex>
                    </Stack>
                  </Box>

                  <Text fontSize="sm" color="fg.muted">
                    Após encerrar, o status da reunião será alterado para "Encerrado".
                  </Text>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCloseModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    handlers.handleCloseReunion()
                    setCloseModalOpen(false)
                  }}
                >
                  Confirmar Encerramento
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>

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
