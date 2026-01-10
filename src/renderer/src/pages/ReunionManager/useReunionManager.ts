import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReunionStatus } from '../../types/reunion-status'
import { useReunions } from '../../hooks/reunion/useReunions'
import { reunionFormSchema, ReunionFormData } from '../../schemas/reunionSchema'

const defaultReunion: Reunion = {
  id: 0,
  name: '',
  value: 0,
  treatmentQuantity: 0,
  foodBasketQuantity: 0,
  date: '',
  status: ReunionStatus.NEW
}

export interface UseReunionManagerResult {
  drawerOpen: boolean
  isEditMode: boolean
  selectedReunion: Reunion
  register: ReturnType<typeof useForm<ReunionFormData>>['register']
  errors: ReturnType<typeof useForm<ReunionFormData>>['formState']['errors']
  isSubmitting: boolean
  reunions: ReturnType<typeof useReunions>['reunions']
  handleRowClick: (reunion: Reunion) => void
  handleAddNew: () => void
  handleCloseDrawer: () => void
  handleEditToggle: () => void
  title: string
  primaryLabel: string
  secondaryLabel: string
  onPrimaryAction: () => void | Promise<void>
  canEdit: boolean
  canShowEditButton: boolean
  editError: string | null
  handleDelete: () => Promise<void>
  startDateInput: string
  setStartDateInput: React.Dispatch<React.SetStateAction<string>>
  endDateInput: string
  setEndDateInput: React.Dispatch<React.SetStateAction<string>>
  statusInput: string
  setStatusInput: React.Dispatch<React.SetStateAction<string>>
  handleFilter: () => void
}

export function useReunionManager(): UseReunionManagerResult {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReunion, setSelectedReunion] = useState<Reunion>(defaultReunion)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [startDateInput, setStartDateInput] = useState('')
  const [endDateInput, setEndDateInput] = useState('')
  const [statusInput, setStatusInput] = useState('')
  const [activeFilter, setActiveFilter] = useState<
    { startDate?: string; endDate?: string; status?: string } | undefined
  >(undefined)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReunionFormData>({
    resolver: zodResolver(reunionFormSchema),
    defaultValues: defaultReunion
  })

  const { reunions, createReunion, updateReunion, deleteReunion } = useReunions(activeFilter)

  const handleFilter = () => {
    setActiveFilter({
      startDate: startDateInput || undefined,
      endDate: endDateInput || undefined,
      status: statusInput || undefined
    })
  }

  const handleRowClick = (reunion: Reunion) => {
    setSelectedReunion(reunion)
    reset(reunion)
    setIsEditMode(false)
    setDrawerOpen(true)
  }

  const handleDelete = async () => {
    if (selectedReunion.id && selectedReunion.id !== 0) {
      if (confirm('Tem certeza que deseja excluir esta reunião?')) {
        await deleteReunion.mutateAsync(selectedReunion.id)
        handleCloseDrawer()
      }
    }
  }

  const handleAddNew = () => {
    setSelectedReunion(defaultReunion)
    reset(defaultReunion)
    setIsEditMode(true)
    setDrawerOpen(true)
  }

  const handleStartOrAccess = async () => {
    if (selectedReunion.status === ReunionStatus.NEW) {
      await updateReunion.mutateAsync({
        ...selectedReunion,
        status: ReunionStatus.IN_PROGRESS
      })
      setSelectedReunion((prev) => ({ ...prev, status: ReunionStatus.IN_PROGRESS }))
    } else if (
      selectedReunion.status === ReunionStatus.IN_PROGRESS ||
      selectedReunion.status === ReunionStatus.FINISHED
    ) {
      navigate(`/reunioes/${selectedReunion.id}`)
    }
  }

  const handleEditToggle = () => {
    try {
      const status = selectedReunion.status
      if (status === ReunionStatus.FINISHED) {
        setEditError('Reuniões encerradas não podem ser editadas.')
        return
      }
      if (status === ReunionStatus.NEW) {
        setEditError('Inicie a reunião antes de editar.')
        return
      }
      setIsEditMode(true)
      setEditError(null)
    } catch (error) {
      console.error('Erro ao entrar em modo de edição:', error)
      setEditError('Ocorreu um erro ao ativar o modo de edição.')
    }
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setIsEditMode(false)
    reset(defaultReunion)
    setSelectedReunion(defaultReunion)
  }

  const onSubmit = async (data: ReunionFormData) => {
    try {
      let savedReunion: Reunion

      if (selectedReunion.id === 0) {
        savedReunion = await createReunion.mutateAsync(data)
        setSelectedReunion(savedReunion)
        reset(savedReunion)
      } else {
        savedReunion = await updateReunion.mutateAsync({
          id: selectedReunion.id || 0,
          ...data
        })
        setSelectedReunion(savedReunion)
        reset(savedReunion)
      }
      setIsEditMode(false)
    } catch (error) {
      console.error('Erro ao salvar reunião:', error)
    }
  }

  const getDrawerContent = () => {
    const isNewReunion = selectedReunion.id === 0
    const isFinished = selectedReunion.status === ReunionStatus.FINISHED
    const canEdit = isNewReunion || (isEditMode && !isFinished)

    if (isNewReunion) {
      return {
        title: 'Nova Reunião',
        primaryLabel: 'Salvar',
        primaryAction: handleSubmit(onSubmit),
        secondaryLabel: 'Cancelar',
        canEdit
      }
    }

    if (isEditMode) {
      return {
        title: 'Editar Reunião',
        primaryLabel: 'Salvar alterações',
        primaryAction: handleSubmit(onSubmit),
        secondaryLabel: 'Cancelar',
        canEdit
      }
    }

    const title = 'Detalhes da Reunião'

    if (selectedReunion.status === ReunionStatus.NEW) {
      return {
        title,
        primaryLabel: 'Iniciar Reunião',
        primaryAction: handleStartOrAccess,
        secondaryLabel: 'Fechar',
        canEdit
      }
    }

    if (selectedReunion.status === ReunionStatus.IN_PROGRESS) {
      return {
        title,
        primaryLabel: 'Acessar Reunião',
        primaryAction: handleStartOrAccess,
        secondaryLabel: 'Fechar',
        canEdit
      }
    }

    return {
      title,
      primaryLabel: 'Visualizar Reunião',
      primaryAction: handleStartOrAccess,
      secondaryLabel: 'Fechar',
      canEdit
    }
  }

  const { title, primaryLabel, primaryAction, secondaryLabel, canEdit } = getDrawerContent()
  const canShowEditButton =
    selectedReunion.status !== ReunionStatus.NEW && selectedReunion.id !== 0 && !isEditMode

  return {
    drawerOpen,
    isEditMode,
    selectedReunion,
    register,
    errors,
    isSubmitting,
    reunions,
    handleRowClick,
    handleAddNew,
    handleCloseDrawer,
    handleEditToggle,
    handleDelete,
    title,
    primaryLabel,
    secondaryLabel,
    onPrimaryAction: primaryAction,
    canEdit,
    canShowEditButton,
    editError,
    startDateInput,
    setStartDateInput,
    endDateInput,
    setEndDateInput,
    handleFilter,
    statusInput,
    setStatusInput
  }
}

export type ReunionManagerViewProps = ReturnType<typeof useReunionManager>
