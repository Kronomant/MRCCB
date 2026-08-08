import { Button } from '@chakra-ui/react';
import { DrawerForm } from '@shared/components';
import { ReunionRecordForm } from './ReunionRecordForm';
import { RecordType } from '../../hooks/records/useRecords';

interface ReunionAttendanceDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  record: RecordType;
  isClosed: boolean;
  prontuarioSearch: string;
  isNewProntuario: boolean;
  selectedUnityId: number | null;
  filteredProntuarios: any[];
  collection: any;
  unities: any[];
  onSaveRecord: () => void;
  onRecordChange: (updates: Partial<RecordType>) => void;
  onProntuarioSelect: (val: string) => void;
  onProntuarioSearch: (val: string) => void;
  onUnityChange: (id: number | null) => void;
  onToggleDelivery: (id: number, current: boolean) => void;
}

export const ReunionAttendanceDrawer = ({
  drawerOpen,
  setDrawerOpen,
  record,
  isClosed,
  prontuarioSearch,
  isNewProntuario,
  selectedUnityId,
  filteredProntuarios,
  collection,
  unities,
  onSaveRecord,
  onRecordChange,
  onProntuarioSelect,
  onProntuarioSearch,
  onUnityChange,
  onToggleDelivery
}: ReunionAttendanceDrawerProps) => {
  return (
    <DrawerForm
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title={record.id === 0 ? 'Novo Atendimento' : 'Editar Atendimento'}
      primaryLabel="Salvar"
      secondaryLabel="Cancelar"
      onPrimaryAction={onSaveRecord}
      headerActions={
        isClosed && record.id !== 0 && (
          <Button
            size="sm"
            colorPalette={record.delivered ? 'gray' : 'orange'}
            onClick={() => onToggleDelivery(record.id, record.delivered)}
          >
            {record.delivered ? 'DEVOLVIDO' : 'DEVOLVER'}
          </Button>
        )
      }
    >
      <ReunionRecordForm
        record={record}
        prontuarioSearch={prontuarioSearch}
        isNewProntuario={isNewProntuario}
        selectedUnityId={selectedUnityId}
        filteredProntuarios={filteredProntuarios}
        collection={collection}
        unities={unities}
        onRecordChange={onRecordChange}
        onProntuarioSelect={onProntuarioSelect}
        onProntuarioSearch={onProntuarioSearch}
        onUnityChange={onUnityChange}
      />
    </DrawerForm>
  );
};
