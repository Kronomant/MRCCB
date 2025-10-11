import { useState, useEffect } from 'react'
import {
  Button,
  Flex,
  InputGroup,
  Box,
  Stack,
  Text,
  Tag as ChakraTag,
  Checkbox,
  SimpleGrid,
  Tag,
  ListCollection
} from '@chakra-ui/react'
import { PageHeader, Select } from '../../components'
import { FiSearch, FiFilter, FiPlus, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi'
import { BaseTable } from '../../components/Table/BaseTable'
import { DrawerForm } from '../../components/DrawerForm'
import { Input } from '../../components/Input'
import { useRecords } from '../../hooks'
import { useNavigate, useParams } from 'react-router-dom'

// Tipagem para registro
interface RecordType {
  id: number
  prontuario: number
  ministerio: boolean
  valor: number
  cestas: number
  unidade: string
  labels: string[]
  representacao: boolean
  somenteRoupas: boolean
  valorTotalAprovado: boolean
}

// Mock data para exemplo
// Removido mockSummary em favor de dados reais

const mockRecords: RecordType[] = [
  {
    id: 1,
    prontuario: 123,
    valor: 500,
    cestas: 1,
    labels: ['Valor total aprovado', 'Emergencial'],
    unidade: 'Santa cecilia',
    ministerio: true,
    representacao: false,
    somenteRoupas: false,
    valorTotalAprovado: true
  },
  {
    id: 2,
    prontuario: 225,
    valor: 0,
    cestas: 1,
    labels: ['Somente roupas', 'Emergencial'],
    unidade: 'Veneza',
    ministerio: false,
    representacao: false,
    somenteRoupas: true,
    valorTotalAprovado: false
  }
  // ... outros registros
]

const LABEL_COLORS: Record<string, string> = {
  Emergencial: 'red',
  'Somente roupas': 'blue',
  'Valor total aprovado': 'green',
  Representação: 'purple'
}

const unidades = ['Santa cecilia', 'Veneza', 'Alterosa', 'San Genaro', 'Florença', 'Vereda']

const defaultRecord: RecordType = {
  id: 0,
  prontuario: 0,
  ministerio: false,
  valor: 0,
  cestas: 0,
  unidade: '',
  labels: [],
  representacao: false,
  somenteRoupas: false,
  valorTotalAprovado: false
}

export const Reunion = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<RecordType>(defaultRecord)
  const [records, setRecords] = useState<RecordType[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()
  const reunionId = Number(id)
  const { records: hookRecords, summary, isLoading, createTreatment, updateTreatment, deleteTreatment, reunions } = useRecords(reunionId)

  // Handlers
  const handleAdd = () => {
    setSelectedRecord(defaultRecord)
    setDrawerOpen(true)
  }
  const handleEdit = (record: RecordType) => {
    setSelectedRecord(record)
    setDrawerOpen(true)
  }
  const handleView = (record: RecordType) => {
    setSelectedRecord(record)
    setDrawerOpen(true)
  }
  const handleDelete = (id: number) => {
    deleteTreatment.mutate(id)
  }
  const handleSave = () => {
    if (selectedRecord.id === 0) {
      const payload = {
        enchiridionId: selectedRecord.prontuario,
        reunionId,
        unityId: Number(selectedRecord.unidade) || 0,
        date: reunions.data?.date ?? new Date().toISOString().split('T')[0],
        aprovedValue: selectedRecord.valorTotalAprovado,
        value: selectedRecord.valor,
        foodBasketQuantity: selectedRecord.cestas,
        onlyClothes: selectedRecord.somenteRoupas,
        emergency: selectedRecord.labels.includes('Emergencial'),
        returned: selectedRecord.representacao,
        repeat: false
      }
      createTreatment.mutate(payload)
    } else {
      const payload = {
        id: selectedRecord.id,
        enchiridionId: selectedRecord.prontuario,
        reunionId,
        unityId: Number(selectedRecord.unidade) || 0,
        date: reunions.data?.date ?? new Date().toISOString().split('T')[0],
        aprovedValue: selectedRecord.valorTotalAprovado,
        value: selectedRecord.valor,
        foodBasketQuantity: selectedRecord.cestas,
        onlyClothes: selectedRecord.somenteRoupas,
        emergency: selectedRecord.labels.includes('Emergencial'),
        returned: selectedRecord.representacao,
        repeat: false
      }
      updateTreatment.mutate(payload)
    }
    setDrawerOpen(false)
  }

  // Table columns
  const columns = [
    { header: 'Prontuário', accessor: 'prontuario' },
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
    { header: 'Unidade', accessor: 'unidade' },
    {
      header: 'Ações',
      accessor: 'actions',
      customRender: (row: RecordType) => (
        <Flex gap={2}>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row.id)
            }}
          >
            <FiTrash2 />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row)
            }}
          >
            <FiEdit2 />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleView(row)
            }}
          >
            <FiEye />
          </Button>
        </Flex>
      )
    }
  ]

  // Dados e resumo agora vêm do hook useRecords

  // DrawerForm content
  const drawerContent = (
    <Stack gap={3}>
      <Input
        label="Prontuário"
        type="number"
        value={selectedRecord.prontuario}
        onChange={(e) =>
          setSelectedRecord({ ...selectedRecord, prontuario: Number(e.target.value) })
        }
      />

      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Ministério</Checkbox.Label>
      </Checkbox.Root>
      <Input
        label="Valor"
        type="number"
        value={selectedRecord.valor}
        onChange={(e) => setSelectedRecord({ ...selectedRecord, valor: Number(e.target.value) })}
      />
      <Input
        label="Quantidade de Cestas"
        type="number"
        value={selectedRecord.cestas}
        onChange={(e) => setSelectedRecord({ ...selectedRecord, cestas: Number(e.target.value) })}
      />

      <Select
        options={unidades.map((unidade) => ({ label: unidade, value: unidade }))}
        placeholder="Selecione a unidade"
        value={selectedRecord.unidade}
        onChange={(value: any) => setSelectedRecord({ ...selectedRecord, unidade: value })}
      />

      <Text fontWeight="bold" mt={2}>
        Flags
      </Text>
      <Flex gap={3} wrap="wrap">
        {Object.keys(LABEL_COLORS)?.map((flag) => (
          <Checkbox.Root checked={selectedRecord.labels.includes(flag)} key={flag}>
            <Checkbox.HiddenInput />
            <Checkbox.Control
              onChange={(e: any) => {
                setSelectedRecord({
                  ...selectedRecord,
                  labels: e.target.checked
                    ? [...selectedRecord.labels, flag]
                    : selectedRecord.labels.filter((l) => l !== flag)
                })
              }}
            />
            {flag}
          </Checkbox.Root>
        ))}
      </Flex>
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
      {/* Header */}
      <PageHeader title="Records" onBack={() => navigate('/reunioes')}>
        <Text color="fg.muted" fontSize="md" ml={4}>
          {summary.data || ''}
        </Text>
        <Button colorScheme="gray" ml={4}>
          Encerrar Reunião
        </Button>
      </PageHeader>

      {/* Cards de resumo */}
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

      {/* Seção de atendimentos */}
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
          <Button colorScheme="blue" onClick={handleAdd}>
            <FiPlus />
            Adicionar
          </Button>
        </Flex>

        <Flex w="100%" h="70vh">
          <Flex w="100%" h="100%" gap={16} position="relative">
            <BaseTable
              drawerOpen={drawerOpen}
              data={hookRecords.filter((r) => String(r.prontuario).includes(search))}
              columns={columns as Column<RecordType>[]}
              isLoading={isLoading}
              onRowClick={handleView}
            />
            <DrawerForm
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title={selectedRecord.id === 0 ? 'Novo Atendimento' : 'Editar Atendimento'}
              primaryLabel="Salvar"
              secondaryLabel="Cancelar"
              onPrimaryAction={handleSave}
            >
              {drawerContent}
            </DrawerForm>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}
