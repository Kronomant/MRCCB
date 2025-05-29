import { Box, Button, Flex, Input, InputGroup } from '@chakra-ui/react'
import { PageHeader } from '../components'
import { FiSearch } from 'react-icons/fi'
import { BaseTable } from '../components/Table/BaseTable'
import mockDataService from '../services/mockData'

const columns: Column<Reunion>[] = [
  { header: "Reunião", accessor: "id" },
  { header: "Reunião", accessor: "name" },
  { header: "Qtd. Atendimentos", accessor: "treatmentQuantity" },
  { header: "Qtd. Cestas", accessor: "foodBasketQuantity" },
  { header: "Total", accessor: "value" },
  { header: "Data Reunião", accessor: "date" },
];

export const Reunion = () => (
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
      <Button colorPalette="gray">Adicionar reunião</Button>
    </PageHeader>
    <Flex w="60%">
      <InputGroup endElement={<FiSearch />}>
        <Input borderRadius="3xl" placeholder="Buscar" />
      </InputGroup>
    </Flex>
    <Box height="100%" maxH="70vh">
      <BaseTable 
        data={mockDataService.getReunions()} 
        columns={columns}
        isLoading={false}
        actions={[
          <Button key="delete" variant="outline" size="sm">Delete</Button>,
          <Button key="share" variant="outline" size="sm">Share</Button>
        ]}
      ></BaseTable>
      </Box>
  </Flex>
)
