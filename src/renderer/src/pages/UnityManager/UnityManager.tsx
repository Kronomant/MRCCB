import { Button, Flex, InputGroup, Stack, Text, Tag, Box, Textarea, Switch } from '@chakra-ui/react'
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi'
import { DrawerForm } from '../../components/DrawerForm'
import { BaseTable } from '../../components/Table/BaseTable'
import { PageHeader, PageContainer } from '../../components'
import { Input } from '../../components/Input'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUnities } from '../../hooks/unity/useUnities'
import { unityFormSchema, type UnityFormData } from '../../schemas/unitySchema'
import { useTutorialContext } from '../../contexts/TutorialContext'

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
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const { startTutorial, hasSeenTutorial } = useTutorialContext()

  useEffect(() => {
    if (!hasSeenTutorial('unityManager')) {
      startTutorial('unityManager')
    }
  }, [])

  const { unities, createUnity, createUnitiesBulk, updateUnity, deleteUnity } = useUnities()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UnityFormData>({
    resolver: zodResolver(unityFormSchema),
    defaultValues: { name: '' }
  })

  const filtered = (unities || []).filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRowClick = (unity: Unity) => {
    setSelectedUnity(unity)
    reset({ name: unity.name })
    setIsEditMode(false)
    setIsBulkMode(false)
    setBulkText('')
    setDrawerOpen(true)
  }

  const handleAddNew = () => {
    setSelectedUnity(null)
    reset({ name: '' })
    setIsEditMode(true)
    setIsBulkMode(false)
    setBulkText('')
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
        // Creating new unity - keep modal open and clear fields
        await createUnity.mutateAsync(data)
        reset({ name: '' })
        // Don't close drawer, don't change edit mode, don't clear selected
      } else {
        // Updating existing unity - close modal
        await updateUnity.mutateAsync({ id: selectedUnity.id, name: data.name })
        setDrawerOpen(false)
        setIsEditMode(false)
        setSelectedUnity(null)
        reset({ name: '' })
      }
    } catch (error) {
      console.error('Erro ao salvar unidade:', error)
    }
  }

  const onBulkSubmit = async () => {
    try {
      const names = bulkText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      if (names.length === 0) {
        return
      }

      await createUnitiesBulk.mutateAsync(names)
      setBulkText('')
      // Keep modal open in bulk mode
    } catch (error) {
      console.error('Erro ao salvar unidades em massa:', error)
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
  const onPrimaryAction = isBulkMode ? onBulkSubmit : handleSubmit(onSubmit)
  const onSecondaryAction =
    isNew || isEditMode
      ? () => {
          setDrawerOpen(false)
          setIsEditMode(false)
          setIsBulkMode(false)
          setBulkText('')
        }
      : handleDelete

  const headerActions =
    !isNew && !isEditMode ? (
      <Button size="sm" variant="outline" onClick={handleEditToggle} colorPalette="blue">
        <FiEdit />
        Editar
      </Button>
    ) : null

  return (
    <PageContainer>
      <Stack gap={12}>
        <Box id="unidades-header">
          <PageHeader title="Unidades">
            <Button id="unidades-add-btn" colorPalette="gray" onClick={handleAddNew}>
              Adicionar unidade
            </Button>
          </PageHeader>
        </Box>

      <Flex id="unidades-search" w="60%">
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
        <Flex w="100%" h="100%" position="relative">
          <Box
            id="unidades-table"
            w={drawerOpen ? 'calc(100% - 400px)' : '100%'}
            h="100%"
            transition="width 0.4s cubic-bezier(.4,0,.2,1)"
          >
            <BaseTable
              drawerOpen={drawerOpen}
              data={filtered}
              columns={columns}
              isLoading={false}
              onRowClick={handleRowClick}
            />
          </Box>

          <DrawerForm
            isOpen={drawerOpen}
            onClose={() => {
              setDrawerOpen(false)
              setIsEditMode(false)
              setSelectedUnity(null)
              setIsBulkMode(false)
              setBulkText('')
              reset({ name: '' })
            }}
            title={title}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            onPrimaryAction={onPrimaryAction}
            onSecondaryAction={onSecondaryAction}
            isLoading={isSubmitting || createUnitiesBulk.isPending}
            headerActions={headerActions}
          >
            {selectedUnity && !isEditMode ? (
              <Stack color="fg" gap={2} mb={6}>
                <Text>
                  <b>Unidade:</b> {selectedUnity.name}
                </Text>
                <Text>
                  <b>Criado em:</b>{' '}
                  <Tag.Root colorPalette="gray" size="sm">
                    {formatDate(selectedUnity.createdAt)}
                  </Tag.Root>
                </Text>
                <Text>
                  <b>Atualizado em:</b>{' '}
                  <Tag.Root colorPalette="gray" size="sm">
                    {formatDate(selectedUnity.updatedAt)}
                  </Tag.Root>
                </Text>
              </Stack>
            ) : null}

            {isNew && (
              <Flex align="center" gap={3} mb={4}>
                <Switch.Root
                  checked={isBulkMode}
                  onCheckedChange={(e) => setIsBulkMode(e.checked)}
                  colorPalette="blue"
                />
                <Text fontSize="sm" fontWeight="medium">
                  Cadastro em massa
                </Text>
              </Flex>
            )}

            {isBulkMode ? (
              <Stack gap={2}>
                <Text fontSize="sm" color="fg.muted">
                  Digite uma unidade por linha:
                </Text>
                <Textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Obra da Piedade - Sede&#10;Obra da Piedade - Filial 1&#10;Obra da Piedade - Filial 2"
                  rows={10}
                  resize="vertical"
                />
                <Text fontSize="xs" color="fg.muted">
                  {bulkText.split('\n').filter(line => line.trim().length > 0).length} unidade(s) para cadastrar
                </Text>
              </Stack>
            ) : (
              <Input
                label="Nome da unidade"
                placeholder="Ex.: Obra da Piedade - Sede"
                mb={6}
                disabled={!canEdit}
                {...register('name')}
                error={errors.name?.message}
              />
            )}
          </DrawerForm>
        </Flex>
      </Flex>
      </Stack>
    </PageContainer>
  )
}
