import { Button, Flex, Text } from '@chakra-ui/react';
import { PageHeader } from '@shared/components';
import { Tooltip } from '../../shared/components/ui/tooltip';
import { FiFileText } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReunionHeaderProps {
  dateString?: string;
  isClosed: boolean;
  onNavigateBack: () => void;
  onOpenCloseModal: () => void;
  onOpenReopenModal: () => void;
  onOpenProtocolModal: () => void;
  onOpenValuesProtocolModal: () => void;
}

export const ReunionHeader = ({
  dateString,
  isClosed,
  onNavigateBack,
  onOpenCloseModal,
  onOpenReopenModal,
  onOpenProtocolModal,
  onOpenValuesProtocolModal,
}: ReunionHeaderProps) => {
  const formattedDate = dateString
    ? format(parseISO(dateString), "d 'de' MMMM 'de' yyyy", { locale: ptBR }).replace(
        /de ([a-z])/g,
        (match) => match.replace(match[3], match[3].toUpperCase())
      )
    : '';

  return (
    <PageHeader title="Reunião" onBack={onNavigateBack}>
      <Text color="fg.muted" fontSize="md" ml={4}>
        {formattedDate}
      </Text>
      {!isClosed && (
        <Button colorScheme="red" ml={4} onClick={onOpenCloseModal}>
          Encerrar Reunião
        </Button>
      )}
      {isClosed && (
        <Flex gap={4}>
          <Button colorScheme="blue" variant="outline" onClick={onOpenReopenModal}>
            Reabrir Reunião
          </Button>
          <Tooltip content="Gerar protocolo da reunião">
            <Button colorScheme="green" onClick={onOpenProtocolModal}>
              <FiFileText /> Gerar Protocolo
            </Button>
          </Tooltip>
          <Tooltip content="Gerar protocolo detalhado com valores">
            <Button colorScheme="teal" onClick={onOpenValuesProtocolModal}>
              <FiFileText /> Resultado da reunião
            </Button>
          </Tooltip>
        </Flex>
      )}
    </PageHeader>
  );
};
