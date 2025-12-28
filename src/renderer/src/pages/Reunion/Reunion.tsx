import { type ChangeEvent } from 'react'
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
  Portal
} from '@chakra-ui/react'

import { createListCollection } from '@ark-ui/react/collection'
import { PageHeader, DrawerForm, BaseTable, Input } from '../../components'
import { FiSearch, FiFilter, FiPlus, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi'

import { RecordType } from '../../hooks/records/useRecords'
import { useReunionBehavior, LABEL_COLORS } from './useReunionBehavior'

export const Reunion = () => {
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
    filteredProntuarios,
    unities,
    handlers
  } = useReunionBehavior()

  const { record, prontuarioSearch, prontuarioError, selectedUnityId } = formState
  // Table columns
  const columns: Column<RecordType>[] = [
    { header: 'Prontuário', accessor: 'prontuarioNumber', customRender: (row: RecordType) => 
    <Flex>
{row.prontuarioNumber}
{(row.ministerio === true) ? <Tag.Root colorPalette="blue" ml={2}>A</Tag.Root> : null}
    </Flex> },
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
    {
      header: 'Ações',
      customRender: (row: RecordType) => (
        <Flex gap={2}>
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
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handlers.handleEdit(row)
            }}
          >
            <FiEdit2 />
          </Button>
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
        </Flex>
      )
    }
  ]

  const drawerContent = (
    <Stack gap={3}>
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
          onValueChange={(details: { value: string[] }) => handlers.updateUnityId(Number(details.value[0]))}
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
            
      <Input
        label="Valor"
        type="number"
        value={record.valor}
        onFocus={(e) => e.target.select()}
        onChange={(e) => handlers.updateRecord({ valor: Number(e.target.value) })}
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

  return (
    <Flex
      p="24px"
      flexDir="column"
      gap="32px"
      w="100%"
      h="100%"
      backgroundColor="bg"
      borderRadius="8px"
    >
      <PageHeader title="Atendimentos" onBack={() => navigate('/reunioes')}>
        <Text color="fg.muted" fontSize="md" ml={4}>
          {summary.data || ''}
        </Text>
        <Button colorScheme="gray" ml={4}>
          Encerrar Reunião
        </Button>
      </PageHeader>

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

      <Box>
        <Flex mb={4} gap={3} align="center">
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
          <Button colorScheme="blue" onClick={handlers.handleAdd}>
            <FiPlus />
            Adicionar
          </Button>
        </Flex>

        <Flex w="100%" h="70vh">
          <Flex w="100%" h="100%" gap={16} position="relative">
            <BaseTable
              drawerOpen={drawerOpen}
              data={filteredRecords}
              columns={columns}
              isLoading={isLoading}
              onRowClick={handlers.handleView}
            />
            <DrawerForm
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title={record.id === 0 ? 'Novo Atendimento' : 'Editar Atendimento'}
              primaryLabel="Salvar"
              secondaryLabel="Cancelar"
              onPrimaryAction={handlers.handleSave}
            >
              {drawerContent}
            </DrawerForm>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}
