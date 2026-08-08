import { Stack, Text } from '@chakra-ui/react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { ReunionCloseDialogBody } from './ReunionCloseDialogBody';
import { ProtocolModal } from '../../components/ProtocolPDF/ProtocolModal';
import { ValuesProtocolModal } from '../../components'
import { RecordType } from '../../hooks/records/useRecords';
// Global types are used for Prontuario and Unity

interface ReunionModalsContainerProps {
  // Modals state
  reopenModalOpen: boolean;
  setReopenModalOpen: (open: boolean) => void;
  closeModalOpen: boolean;
  setCloseModalOpen: (open: boolean) => void;
  protocolModalOpen: boolean;
  setProtocolModalOpen: (open: boolean) => void;
  valuesProtocolModalOpen: boolean;
  setValuesProtocolModalOpen: (open: boolean) => void;
  
  // Handlers
  onConfirmReopen: () => void;
  onConfirmClose: () => void;
  
  // Data
  summary: any;
  reunion: any;
  records: RecordType[];
  unities: Unity[];
  prontuarios: Prontuario[];
}

export const ReunionModalsContainer = ({
  reopenModalOpen, setReopenModalOpen,
  closeModalOpen, setCloseModalOpen,
  protocolModalOpen, setProtocolModalOpen,
  valuesProtocolModalOpen, setValuesProtocolModalOpen,
  onConfirmReopen, onConfirmClose,
  summary, reunion, records, unities, prontuarios
}: ReunionModalsContainerProps) => {
  return (
    <>
      <ConfirmationDialog
        open={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Confirmar Reabertura"
        onConfirm={onConfirmReopen}
        confirmLabel="Confirmar Reabertura"
        confirmColorPalette="blue"
      >
        <Stack gap={4}>
          <Text fontSize="md">
            Você está prestes a reabrir esta reunião. Deseja continuar?
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Ao reabrir, você poderá adicionar novos atendimentos e editar os existentes.
          </Text>
        </Stack>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Confirmar Encerramento"
        onConfirm={onConfirmClose}
        confirmLabel="Confirmar Encerramento"
        confirmColorPalette="red"
      >
        <ReunionCloseDialogBody summary={summary} reunion={reunion} />
      </ConfirmationDialog>

      <ProtocolModal
        isOpen={protocolModalOpen}
        onClose={() => setProtocolModalOpen(false)}
        records={records}
        unities={unities}
        prontuarios={prontuarios}
        date={summary.data}
      />

      <ValuesProtocolModal
        isOpen={valuesProtocolModalOpen}
        onClose={() => setValuesProtocolModalOpen(false)}
        records={records}
        unities={unities}
        prontuarios={prontuarios}
        date={summary.data}
        basketValue={reunion?.basketValue}
      />
    </>
  );
};
