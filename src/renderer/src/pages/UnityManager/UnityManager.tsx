import { Button, Flex, InputGroup, Stack, Text, Tag } from '@chakra-ui/react'
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi'
import { DrawerForm } from '../../components/DrawerForm'
import { BaseTable } from '../../components/Table/BaseTable'
import { PageHeader } from '../../components/PageHeader/Header'
import { Input } from '../../components/Input'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUnities } from '../../hooks/unity/useUnities'
import { unityFormSchema, type UnityFormData } from '../../schemas/unitySchema'

type Column<T> = globalThis.Column<T>

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const columns: Column<Unity>[] = [
  { header: 'Unidade', accessor: 'name' },
  { header: 'Criado em', customRender: (row) => formatDate(row.createdAt) },
  { header: 'Atualizado em', customRender: (row) => formatDate(row.updatedAt) }
]

export const UnityManager = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUnity, setSelectedUnity] = useState<Unity | null>(null)
  const [search, setSearch] = useState('')

  const { unities, createUnity, updateUnity, deleteUnity } = useUnities()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UnityFormData>({
    resolver: zodResolver(unityFormSchema),
    defaultValues: { name: '' }
  })

  const filtered = (unities || []).filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))

  const handleRowClick = (unity: Unity) => {
    setSelectedUnity(unity)
    reset({ name: unity.name })
    setIsEditMode(false)
    setDrawerOpen(true)
  }

  const handleAddNew = () => {
    setSelectedUnity(null)
    reset({ name: '' })
    setIsEditMode(true)
    setDrawerOpen(true)
  }

  const handleEditToggle = () => {
    setIsEditMode(true)
    if (selectedUnity) {
      reset({ name: selectedUnity.name })
    }
  }

  const onSubmit = async (data: UnityFormData) => {
    try {
      if (!selectedUnity) {
        await createUnity.mutateAsync(data)
      } else {
        await updateUnity.mutateAsync({ id: selectedUnity.id, name: data.name })
      }
      setDrawerOpen(false)
      setIsEditMode(false)
      setSelectedUnity(null)
      reset({ name: '' })
    } catch (error) {
      console.error('Erro ao salvar unidade:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedUnity) return
    const confirmed = window.confirm(`Excluir unidade "${selectedUnity.name}"?`)
    if (!confirmed) return
    try {
      await deleteUnity.mutateAsync(selectedUnity.id)
      setDrawerOpen(false)
      setSelectedUnity(null)
      setIsEditMode(false)
      reset({ name: '' })
    } catch (error) {
      console.error('Erro ao deletar unidade:', error)
    }
  }

  const isNew = !selectedUnity
  const canEdit = isNew || isEditMode
  const title = isNew ? 'Nova Unidade' : isEditMode ? 'Editar Unidade' : 'Detalhes da Unidade'
  const primaryLabel = isNew || isEditMode ? 'Salvar' : 'Fechar'
  const secondaryLabel = isNew || isEditMode ? 'Cancelar' : 'Excluir'
  const onPrimaryAction = isNew || isEditMode ? handleSubmit(onSubmit) : () => setDrawerOpen(false)
  const onSecondaryAction = isNew || isEditMode ? () => { setDrawerOpen(false); setIsEditMode(false); } : handleDelete

  const headerActions = !isNew && !isEditMode ? (
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
      <PageHeader title="Unidades">
        <Button colorPalette="gray" onClick={handleAddNew}>
          Adicionar unidade
        </Button>
      </PageHeader>

      <Flex w="60%">
        <InputGroup endElement={<FiSearch />}>
          <Input
            borderRadius="3xl"
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Flex w="100%" h="70vh">
        <Flex w="100%" h="100%" gap={16} position="relative">
          <BaseTable
            drawerOpen={drawerOpen}
            data={filtered}
            columns={columns}
            isLoading={false}
            onRowClick={handleRowClick}
          />

          <DrawerForm
            isOpen={drawerOpen}
            onClose={() => {
              setDrawerOpen(false)
              setIsEditMode(false)
              setSelectedUnity(null)
              reset({ name: '' })
            }}
            title={title}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            onPrimaryAction={onPrimaryAction}
            onSecondaryAction={onSecondaryAction}
            isLoading={isSubmitting}
            headerActions={headerActions}
          >
            {selectedUnity && !isEditMode ? (
              <Stack color="fg" gap={2} mb={6}>
                <Text>
                  <b>Unidade:</b> {selectedUnity.name}
                </Text>
                <Text>
                  <b>Criado em:</b> <Tag.Root colorPalette="gray" size="sm">{formatDate(selectedUnity.createdAt)}</Tag.Root>
                </Text>
                <Text>
                  <b>Atualizado em:</b> <Tag.Root colorPalette="gray" size="sm">{formatDate(selectedUnity.updatedAt)}</Tag.Root>
                </Text>
              </Stack>
            ) : null}

            <Input
              label="Nome da unidade"
              placeholder="Ex.: Obra da Piedade - Sede"
              mb={3}
              disabled={!canEdit}
              {...register('name')}
              error={errors.name?.message}
            />
          </DrawerForm>
        </Flex>
      </Flex>
    </Flex>
  )
}