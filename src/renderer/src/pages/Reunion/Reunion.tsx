import { useState, type ChangeEvent } from 'react'
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
  SelectItemText
} from '@chakra-ui/react'

import { createListCollection } from '@ark-ui/react/collection'
import { PageHeader } from '../../components'
import { FiSearch, FiFilter, FiPlus, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi'
import { BaseTable } from '../../components/Table/BaseTable'
import { DrawerForm } from '../../components/DrawerForm'
import { Input } from '../../components/Input'
import { useRecords } from '../../hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { useProntuarios } from '../../hooks/prontuario'

// Importar o tipo Prontuario do global.d.ts
type Prontuario = globalThis.Prontuario

// Tipagem para registro (atendimento)
interface RecordType {
  id: number
  prontuarioId: number
  prontuarioNumber: number
  ministerio: boolean
  valor: number
  cestas: number
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
    prontuarioId: 1,
    prontuarioNumber: 123,
    valor: 500,
    cestas: 1,
    labels: ['Valor total aprovado', 'Emergencial'],
    ministerio: true,
    representacao: false,
    somenteRoupas: false,
    valorTotalAprovado: true
  },
  {
    id: 2,
    prontuarioId: 2,
    prontuarioNumber: 225,
    valor: 0,
    cestas: 1,
    labels: ['Somente roupas', 'Emergencial'],
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
  prontuarioId: 0,
  prontuarioNumber: 0,
  ministerio: false,
  valor: 0,
  cestas: 0,
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
  const {
    records: hookRecords,
    summary,
    isLoading,
    createAtendimento,
    updateAtendimento,
    deleteAtendimento,
    reunions
  } = useRecords(reunionId)
  const { activeProntuarios } = useProntuarios()

  // Handlers
  const handleAdd = () => {
    const reunionData = reunions.data
    const recordWithDefaults = {
      ...defaultRecord,
      valor: reunionData?.value || 0,
      cestas: reunionData?.foodBasketQuantity || 0
    }
    setSelectedRecord(recordWithDefaults)
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
    deleteAtendimento.mutate(id)
  }
  const handleSave = () => {
    if (selectedRecord.id === 0) {
      const payload = {
        prontuarioId: selectedRecord.prontuarioId,
        reunionId,
        date: reunions.data?.date ?? new Date().toISOString().split('T')[0],
        aprovedValue: selectedRecord.valorTotalAprovado,
        value: selectedRecord.valor,
        foodBasketQuantity: selectedRecord.cestas,
        onlyClothes: selectedRecord.somenteRoupas,
        emergency: selectedRecord.labels.includes('Emergencial'),
        returned: selectedRecord.representacao,
        repeat: false
      }
      createAtendimento.mutate(payload)
    } else {
      const payload = {
        id: selectedRecord.id,
        prontuarioId: selectedRecord.prontuarioId,
        reunionId,
        date: reunions.data?.date ?? new Date().toISOString().split('T')[0],
        aprovedValue: selectedRecord.valorTotalAprovado,
        value: selectedRecord.valor,
        foodBasketQuantity: selectedRecord.cestas,
        onlyClothes: selectedRecord.somenteRoupas,
        emergency: selectedRecord.labels.includes('Emergencial'),
        returned: selectedRecord.representacao,
        repeat: false
      }
      updateAtendimento.mutate(payload)
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
      <SelectRoot
        collection={createListCollection<{ label: string; value: string }>({
          items:
            activeProntuarios?.map((p) => ({ label: String(p.number), value: String(p.id) })) || []
        })}
        value={[String(selectedRecord.prontuarioId || '')]}
        onValueChange={(details: { value: string[] }) => {
          const selectedProntuario = activeProntuarios?.find(
            (p) => p.id === Number(details.value[0])
          )
          if (selectedProntuario) {
            setSelectedRecord({
              ...selectedRecord,
              prontuarioId: selectedProntuario.id,
              prontuarioNumber: selectedProntuario.number
            })
          }
        }}
      >
        <SelectLabel>Prontuário</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder="Selecione um prontuário" />
        </SelectTrigger>
        <SelectContent>
          {activeProntuarios?.map((prontuario) => (
            <SelectItem key={prontuario.id} item={String(prontuario.id)}>
              <SelectItemText>{prontuario.number}</SelectItemText>
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      {/* Valores padrão da reunião */}
      {reunions.data && (
        <Box p={3} bg="bg.subtle" rounded="md">
          <Text fontWeight="bold" mb={2}>
            Valores Padrão da Reunião
          </Text>
          <Flex gap={4} align="center">
            <Text fontSize="sm">Valor: R$ {reunions.data.value.toLocaleString('pt-BR')}</Text>
            <Text fontSize="sm">Cestas: {reunions.data.foodBasketQuantity}</Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedRecord({
                  ...selectedRecord,
                  valor: reunions.data?.value || 0,
                  cestas: reunions.data?.foodBasketQuantity || 0
                })
              }}
            >
              Usar Padrão
            </Button>
          </Flex>
        </Box>
      )}

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

      <Text fontWeight="bold" mt={2}>
        Flags
      </Text>
      <Flex gap={3} wrap="wrap">
        {Object.keys(LABEL_COLORS)?.map((flag) => (
          <Checkbox.Root checked={selectedRecord.labels.includes(flag)} key={flag}>
            <Checkbox.HiddenInput />
            <Checkbox.Control
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
              data={hookRecords.filter((r) => String(r.prontuarioId).includes(search))}
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
