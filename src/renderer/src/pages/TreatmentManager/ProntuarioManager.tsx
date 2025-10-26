import { Button, Flex, InputGroup, Tag, Stack, Text, Box } from '@chakra-ui/react'
import { PageHeader } from '../../components'
import { FiSearch, FiEye, FiEdit } from 'react-icons/fi'
import { BaseTable } from '../../components/Table/BaseTable'
import { DrawerForm } from '../../components/DrawerForm'
import { useState } from 'react'
import { Input } from '../../components/Input'
import { useProntuarios } from '../../hooks/prontuario'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProntuarioSchema, CreateProntuario } from '../../schemas/prontuarioSchema'
import { ProntuarioDetail } from './ProntuarioDetail'

// Importar o tipo Prontuario do global.d.ts
type Prontuario = globalThis.Prontuario
type Column<T> = globalThis.Column<T>

const statusMap = {
  active: { label: 'Ativo', colorScheme: 'green' },
  inactive: { label: 'Inativo', colorScheme: 'gray' }
}

const getStatusColor = (prontuario: Prontuario) => {
  switch (prontuario.status) {
    case 'active':
      return 'green'
    case 'inactive':
      return 'gray'
    default:
      return 'gray'
  }
}

const getStatusLabel = (prontuario: Prontuario) => {
  switch (prontuario.status) {
    case 'active':
      return 'Ativo'
    case 'inactive':
      return 'Inativo'
    default:
      return 'Indefinido'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const InfoSection: React.FC<{ prontuario: Prontuario }> = ({ prontuario }) => {
  const statusInfo = statusMap[prontuario.status] || { label: prontuario.status, colorScheme: 'gray' }

  return (
    <Stack color="fg" gap={2} mb={6}>
      <Text>
        <b>Status:</b> <Tag.Root colorPalette={statusInfo.colorScheme}>{statusInfo.label}</Tag.Root>
      </Text>
      <Text>
        <b>Número:</b> {prontuario.number}
      </Text>
      <Text>
        <b>Unidade:</b> {prontuario.unityId}
      </Text>
      <Text>
        <b>Ministério:</b> {prontuario.ministry ? 'Sim' : 'Não'}
      </Text>
      <Text>
        <b>Criado em:</b> {formatDate(prontuario.createdAt)}
      </Text>
      {prontuario.updatedAt && (
        <Text>
          <b>Atualizado em:</b> {formatDate(prontuario.updatedAt)}
        </Text>
      )}
    </Stack>
  )
}

const defaultFormValues: CreateProntuario = {
  number: 0,
  unityId: 1,
  ministry: false,
  status: 'active'
}

export const ProntuarioManager = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProntuario, setEditingProntuario] = useState<Prontuario | null>(null)
  const [viewingProntuario, setViewingProntuario] = useState<Prontuario | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateProntuario>({
    resolver: zodResolver(createProntuarioSchema),
    defaultValues: defaultFormValues
  })

  const {
    prontuarios,
    createProntuario,
    updateProntuario,
    deleteProntuario
  } = useProntuarios()

  const isLoading = false // TODO: Implementar loading state
  const prontuariosData = prontuarios || []

  const filteredProntuarios = prontuariosData.filter(
    (prontuario: Prontuario) =>
      prontuario.number.toString().includes(searchTerm) ||
      prontuario.id.toString().includes(searchTerm)
  )

  const onSubmit = async (data: CreateProntuario) => {
    try {
      console.log('Dados do formulário:', data)
      if (editingProntuario) {
        console.log('Atualizando prontuário:', editingProntuario.id)
        await updateProntuario.mutateAsync({ id: editingProntuario.id, ...data })
      } else {
        console.log('Criando novo prontuário')
        const result = await createProntuario.mutateAsync(data)
        console.log('Resultado da criação:', result)
      }
      setIsDrawerOpen(false)
      setEditingProntuario(null)
      reset()
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error)
    }
  }

  const handleView = (prontuario: Prontuario) => {
    setViewingProntuario(prontuario)
  }

  const handleEdit = (prontuario: Prontuario) => {
    setEditingProntuario(prontuario)
    reset({
      number: prontuario.number,
      unityId: prontuario.unityId,
      ministry: prontuario.ministry,
      status: prontuario.status
    })
    setIsDrawerOpen(true)
  }

  const handleDelete = async (prontuario: Prontuario) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o prontuário #${prontuario.number}?`
    )
    if (confirmed) {
      try {
        await deleteProntuario.mutateAsync(prontuario.id)
      } catch (error) {
        console.error('Erro ao deletar prontuário:', error)
      }
    }
  }

  const handleNewProntuario = () => {
    setEditingProntuario(null)
    reset()
    setIsDrawerOpen(true)
  }

  const columns: Column<Prontuario>[] = [
    { header: 'Número', accessor: 'number' },
    {
      header: 'Status',
      accessor: 'status',
      customRender: (row: Prontuario) => {
        return (
          <Tag.Root colorPalette={getStatusColor(row)} size="sm">
            {getStatusLabel(row)}
          </Tag.Root>
        )
      }
    },
    {
      header: 'Unidade',
      accessor: 'unityId',
      customRender: (row: Prontuario) => {
        return `Unidade ${row.unityId}`
      }
    },
    {
      header: 'Ministério',
      accessor: 'ministry',
      customRender: (row: Prontuario) => row.ministry ? 'Sim' : 'Não'
    },
    {
      header: 'Criado em',
      customRender: (row: Prontuario) => formatDate(row.createdAt)
    },
    {
      header: 'Ações',
      customRender: (row: Prontuario) => (
        <Flex gap={2}>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="blue"
            onClick={(e) => {
              e.stopPropagation()
              handleView(row)
            }}
          >
            <FiEye />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="orange"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row)
            }}
          >
            <FiEdit />
          </Button>
        </Flex>
      )
    }
  ]

  // Se estiver visualizando detalhes, renderizar o componente de detalhes
  if (viewingProntuario) {
    return (
      <ProntuarioDetail
        prontuarioId={viewingProntuario.id}
        onClose={() => setViewingProntuario(null)}
        onEdit={(prontuario) => {
          setViewingProntuario(null)
          handleEdit(prontuario)
        }}
      />
    )
  }

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
      <PageHeader title="Prontuários">
        <Button colorPalette="gray" onClick={handleNewProntuario}>
          Adicionar prontuário
        </Button>
      </PageHeader>

      <Flex w="60%">
        <InputGroup endElement={<FiSearch />}>
          <Input
            borderRadius="3xl"
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Flex w="100%" h="70vh">
        <Flex w="100%" h="100%" gap={16} position="relative">
          <BaseTable
            drawerOpen={isDrawerOpen}
            data={filteredProntuarios}
            columns={columns}
            isLoading={isLoading}
            onRowClick={(prontuario) => handleView(prontuario)}
          />

          <DrawerForm
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false)
              setEditingProntuario(null)
              reset()
            }}
            title={editingProntuario ? 'Editar Prontuário' : 'Novo Prontuário'}
            primaryLabel={'Salvar'}
            secondaryLabel={'Cancelar'}
            onSecondaryAction={() => {
              setIsDrawerOpen(false)
              setEditingProntuario(null)
              reset()
            }}
            onPrimaryAction={handleSubmit(onSubmit)}
            isLoading={createProntuario.isPending || updateProntuario.isPending}
          >
            {editingProntuario && <InfoSection prontuario={editingProntuario} />}

            <Stack gap={4}>
              <Input
                label="Número do Prontuário"
                type="number"
                {...register('number', { valueAsNumber: true })}
                error={errors.number?.message}
                placeholder="Número do prontuário"
              />

              <Input
                label="Unidade"
                type="number"
                {...register('unityId', { valueAsNumber: true })}
                error={errors.unityId?.message}
                placeholder="ID da unidade"
              />

              <Stack gap={3}>
                <Text fontWeight="medium">Status</Text>
                <select {...register('status')} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="arquivado">Arquivado</option>
                </select>
                {errors.status && <Text color="red.500" fontSize="sm">{errors.status.message}</Text>}
              </Stack>

              <Stack gap={3}>
                <Text fontWeight="medium">Opções</Text>

                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input type="checkbox" {...register('ministry')} />
                  <Text>Ministério</Text>
                </label>
              </Stack>
            </Stack>
          </DrawerForm>
        </Flex>
      </Flex>
    </Flex>
  )
}
