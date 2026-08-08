import { Flex, Button, InputGroup } from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import { Input } from '@shared/components';

interface ReunionAttendanceToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  isClosed: boolean;
  onAddRecord: () => void;
}

export const ReunionAttendanceToolbar = ({
  search,
  setSearch,
  isClosed,
  onAddRecord
}: ReunionAttendanceToolbarProps) => {
  return (
    <Flex id="reunion-search" mb={4} gap={3} align="center">
      <InputGroup endElement={<FiSearch />} w="300px">
        <Input
          borderRadius="3xl"
          label="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <Button variant="outline">
        <FiFilter /> Filtros
      </Button>
      {!isClosed && (
        <Button id="reunion-add-btn" colorScheme="blue" onClick={onAddRecord}>
          <FiPlus /> Adicionar
        </Button>
      )}
    </Flex>
  );
};
