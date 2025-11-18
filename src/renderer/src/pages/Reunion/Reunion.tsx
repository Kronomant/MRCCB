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
import { PageHeader, DrawerForm, BaseTable, Input } from '../../components'
import { FiSearch, FiFilter, FiPlus, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi'

import { useRecords } from '../../hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { useProntuarios } from '../../hooks/prontuario'
import { useUnities } from '../../hooks/unity'

// Adiciona serviço para busca direta de prontuário por número
import { getProntuarioByNumber } from '../../services/prontuarioService'

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
  const [search, setSearch] = useState('')
  // Estado para digitação e validação do número do prontuário no Select
  const [prontuarioSearch, setProntuarioSearch] = useState('')
  const [prontuarioError, setProntuarioError] = useState<string | null>(null)
  const [selectedUnityId, setSelectedUnityId] = useState<number | null>(null)

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
  const { activeProntuarios, createProntuario } = useProntuarios()
  const { unities } = useUnities()

  const isValidProntuarioNumber = (value: string) => /^\d+$/.test(value) && Number(value) > 0

  // Handlers
  const handleAdd = () => {
    const reunionData = reunions.data
    const recordWithDefaults = {
      ...defaultRecord,
      valor: reunionData?.value || 0,
      cestas: reunionData?.foodBasketQuantity || 0
    }
    setSelectedRecord(recordWithDefaults)
    setProntuarioSearch('')
    setProntuarioError(null)
    setDrawerOpen(true)
  }
  const handleEdit = (record: RecordType) => {
    setSelectedRecord(record)
    setProntuarioSearch(String(record.prontuarioNumber || ''))
    setProntuarioError(null)
    setDrawerOpen(true)
  }
  const handleView = (record: RecordType) => {
    setSelectedRecord(record)
    setProntuarioSearch(String(record.prontuarioNumber || ''))
    setProntuarioError(null)
    setDrawerOpen(true)
  }
  const handleDelete = (id: number) => {
    deleteAtendimento.mutate(id)
  }

  const handleSave = async () => {
    const typedNumber = Number(prontuarioSearch.trim())
    try {
      // Determina prontuário alvo: selecionado ou digitado
      let targetProntuarioId = selectedRecord.prontuarioId

      if (!targetProntuarioId && prontuarioSearch.trim() !== '') {
        if (!isValidProntuarioNumber(prontuarioSearch.trim())) {
          setProntuarioError('Número de prontuário inválido')
          console.error('Formato inválido do número do prontuário')
          return
        }


        const existing = await getProntuarioByNumber(typedNumber)
        const prontuarioToSelect =
          existing ??
          (await createProntuario.mutateAsync({
            number: typedNumber,
            unityId: selectedUnityId ?? 1,
            ministry: false,
            status: 'active'
          }))

        targetProntuarioId = prontuarioToSelect.id!

        // Atualiza o estado de forma coesa para refletir a seleção
        setSelectedRecord((prev) => ({
          ...prev,
          prontuarioId: prontuarioToSelect.id,
          prontuarioNumber: prontuarioToSelect.number
        }))
        setProntuarioSearch(String(prontuarioToSelect.number))
        setSelectedUnityId(prontuarioToSelect.unityId)
        setProntuarioError(null)
      }

      const payloadBase = {
        prontuarioId: targetProntuarioId,
        reunionId,
        date: reunions.data?.date ?? new Date().toISOString().split('T')[0],
        aprovedValue: selectedRecord.valorTotalAprovado,
        value: selectedRecord.valor,
        foodBasketQuantity: selectedRecord.cestas,
        onlyClothes: selectedRecord.somenteRoupas,
        emergency: selectedRecord.labels.includes('Emergencial'),
        returned: selectedRecord.representacao,
        repeat: false,
        prontuarioNumber: typedNumber
      }

      if (selectedRecord.id === 0) {
        // Criar novo atendimento
        createAtendimento.mutate(payloadBase)
      } else {
        // Atualizar atendimento existente (mantém comportamento atual)
        updateAtendimento.mutate({ id: selectedRecord.id, ...payloadBase })
      }

      setDrawerOpen(false)
    } catch (err) {
      console.error('Erro no fluxo de salvamento de atendimento/prontuário:', err)
    }
  }
  // Table columns
  const columns = [
    { header: 'Prontuário', accessor: 'prontuarioNumber' },
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

  // Lista filtrada para o Select conforme digitação
  const filteredProntuarios = (activeProntuarios ?? []).filter((p) =>
    String(p.number).includes(prontuarioSearch)
  )

  // DrawerForm content
  const drawerContent = (
    <Stack gap={3}>
      <SelectRoot
        collection={createListCollection<{ label: string; value: string }>({
          items:
            filteredProntuarios.map((p) => ({ label: String(p.number), value: String(p.id) })) || []
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
            setProntuarioSearch(String(selectedProntuario.number))
            setProntuarioError(null)
            setSelectedUnityId(selectedProntuario.unityId)
          }
        }}
      >
        <SelectLabel>Prontuário</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder="Selecione ou digite um prontuário" />
        </SelectTrigger>
        <SelectContent>
          {/* Campo de busca dentro do menu do select */}
          <Box px={3} py={2}>
            <Input
              label="Número do prontuário"
              placeholder="Digite o número"
              value={prontuarioSearch}
              onChange={(e) => {
                const val = e.target.value
                setProntuarioSearch(val)
                if (val && !isValidProntuarioNumber(val)) {
                  setProntuarioError('Número de prontuário inválido')
                } else {
                  setProntuarioError(null)
                }
              }}
              error={prontuarioError ?? undefined}
            />
          </Box>

          {filteredProntuarios.length === 0 && (
            <Text color="fg.muted" px={3} py={2}>
              Prontuário não encontrado
            </Text>
          )}

          {filteredProntuarios?.map((prontuario) => (
            <SelectItem key={prontuario.id} item={String(prontuario.id)}>
              <SelectItemText>{prontuario.number}</SelectItemText>
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      {selectedRecord.prontuarioId ? (
        <Stack gap={2}>
          <Text fontWeight="medium">Unidade</Text>
          <Tag.Root colorPalette="gray">
            {unities.find((u) => u.id === selectedUnityId)?.name || 'Unidade não definida'}
          </Tag.Root>
        </Stack>
      ) : (
        <SelectRoot
          collection={createListCollection<{ label: string; value: string }>({
            items: (unities || []).map((u) => ({ label: u.name, value: String(u.id) }))
          })}
          value={[selectedUnityId ? String(selectedUnityId) : '']}
          onValueChange={(details: { value: string[] }) => {
            setSelectedUnityId(Number(details.value[0]))
          }}
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
