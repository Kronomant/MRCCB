import { Button, Flex, InputGroup, Tag, Stack, Text, Box } from '@chakra-ui/react'
import { PageHeader } from '../../components'
import { FiSearch } from 'react-icons/fi'
import { BaseTable } from '../../components/Table/BaseTable'
import mockDataService from '../../services/mockData'
import { DrawerForm } from '../../components/DrawerForm'
import { useState } from 'react'
import { ReunionStatus } from '../../types/reunion-status'
import { RenderDrawerContent } from './ReunionManager.helper'
import { Input } from '../../components/Input'
import { useNavigate } from 'react-router-dom'

const statusMap = {
  [ReunionStatus.NEW]: { label: 'Prevista', colorScheme: 'green' },
  [ReunionStatus.IN_PROGRESS]: { label: 'Em Andamento', colorScheme: 'blue' },
  [ReunionStatus.FINISHED]: { label: 'Encerrada', colorScheme: 'orange' }
}

const InfoSection: React.FC<{ reunion: Reunion }> = ({ reunion }) => (
  <Stack color="fg" gap={2} mb={6}>
    <Text>
      <b>Status:</b>{' '}
      <Tag.Root colorPalette={statusMap[reunion.status]?.colorScheme || 'gray'}>
        {statusMap[reunion.status]?.label || reunion.status}
      </Tag.Root>
    </Text>
    <Text>
      <b>Qtd. Atendimentos:</b> {reunion.treatmentQuantity}
    </Text>
    <Text>
      <b>Qtd. Cestas:</b> {reunion.foodBasketQuantity}
    </Text>
    <Text>
      <b>Valor total:</b> R$ {reunion.value}
    </Text>
  </Stack>
)

const columns: Column<Reunion>[] = [
  { header: 'Reunião', accessor: 'id' },
  { header: 'Reunião', accessor: 'name' },
  {
    header: 'Status',
    accessor: 'status',
    customRender: (row) => {
      const status = statusMap[row.status] || { label: row.status, colorScheme: 'gray' }
      return <Tag.Root colorPalette={status.colorScheme}>{status.label}</Tag.Root>
    }
  },
  { header: 'Qtd. Atendimentos', accessor: 'treatmentQuantity' },
  { header: 'Qtd. Cestas', accessor: 'foodBasketQuantity' },
  { header: 'Total', accessor: 'value' },
  { header: 'Data Reunião', accessor: 'date' }
]

const defaultReunion: Reunion = {
  id: 0,
  name: '',
  value: 0,
  treatmentQuantity: 0,
  foodBasketQuantity: 0,
  date: '',
  status: ReunionStatus.NEW
}

export const ReunionManager = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReunion, setSelectedReunion] = useState<Reunion>(defaultReunion)
  const navigate = useNavigate()

  const reunions = mockDataService.getReunions()

  const handleRowClick = (reunion: any) => {
    setSelectedReunion(reunion)
    setDrawerOpen(true)
  }

  const handleAddNew = () => {
    setSelectedReunion(defaultReunion)
    setDrawerOpen(true)
  }

  const handleStartOrAccess = () => {
    if (selectedReunion.status === ReunionStatus.NEW) {
      setSelectedReunion((prev) => ({ ...prev, status: ReunionStatus.IN_PROGRESS }))
    } else if (selectedReunion.status === ReunionStatus.IN_PROGRESS) {
      navigate(`/reunioes/${selectedReunion.id}`)
    }
  }

  const renderDrawerContent = () => (
    <>
      <InfoSection reunion={selectedReunion} />
      {(selectedReunion.status === ReunionStatus.NEW ||
        selectedReunion.status === ReunionStatus.IN_PROGRESS) && (
        <>
          <Box as="hr" borderWidth="1px" borderColor="gray.200" my={4} />
          <Button
            colorPalette={selectedReunion.status === ReunionStatus.NEW ? 'green' : 'blue'}
            w="100%"
            variant="surface"
            onClick={handleStartOrAccess}
          >
            {selectedReunion.status === ReunionStatus.NEW ? 'Iniciar Reunião' : 'Acessar Reunião'}
          </Button>
        </>
      )}
    </>
  )

  const { title, primaryLabel, secondaryLabel } = RenderDrawerContent(selectedReunion.status)

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
      <PageHeader title="Reuniões">
        <Button colorPalette="gray" onClick={handleAddNew}>
          Adicionar reunião
        </Button>
      </PageHeader>
      <Flex w="60%">
        <InputGroup endElement={<FiSearch />}>
          <Input borderRadius="3xl" label="Buscar" />
        </InputGroup>
      </Flex>
      <Flex w="100%" h="70vh">
        <Flex w="100%" h="100%" gap={16} position="relative">
          <BaseTable
            drawerOpen={drawerOpen}
            data={reunions}
            columns={columns}
            isLoading={false}
            onRowClick={handleRowClick}
          />
          <DrawerForm
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title={title}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
          >
            <Input label="Nome da reunião" value={selectedReunion.name} mb={3} />
            <Input label="Data" value={selectedReunion.date} mb={3} />
            <Input label="Valor da reunião" value={selectedReunion.value} mb={3} />
            {renderDrawerContent()}
          </DrawerForm>
        </Flex>
      </Flex>
    </Flex>
  )
}
