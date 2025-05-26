import { Button, Flex, Input, InputGroup } from '@chakra-ui/react'
import { PageHeader } from '../components'
import { FiSearch } from 'react-icons/fi'

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
  </Flex>
)
