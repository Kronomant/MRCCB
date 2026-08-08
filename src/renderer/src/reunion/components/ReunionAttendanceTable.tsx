import { Flex, Button, Tag, Text, Checkbox, Box } from '@chakra-ui/react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { BaseTable } from '@shared/components';
import { RecordType } from '../../hooks/records/useRecords';
import { REUNION_LABEL_COLORS } from '@reunion/constants';

type Column<T> = globalThis.Column<T>;

interface ReunionAttendanceTableProps {
  filteredRecords: RecordType[];
  isLoading: boolean;
  isClosed: boolean;
  drawerOpen: boolean;
  onViewRecord: (record: RecordType) => void;
  onDeleteRecord: (id: number) => void;
  onToggleDelivery: (id: number, current: boolean) => void;
}

export const ReunionAttendanceTable = ({
  filteredRecords,
  isLoading,
  isClosed,
  drawerOpen,
  onViewRecord,
  onDeleteRecord,
  onToggleDelivery
}: ReunionAttendanceTableProps) => {
  const columns: Column<RecordType>[] = [
    {
      header: 'Prontuário',
      accessor: 'prontuarioNumber',
      customRender: (row: RecordType) => (
        <Flex>
          {row.prontuarioNumber}
          {row.ministerio === true ? (
            <Tag.Root colorPalette="blue" ml={2}>
              A
            </Tag.Root>
          ) : null}
        </Flex>
      )
    },
    {
      header: 'Valor (R$)',
      accessor: 'valor',
      customRender: (row: RecordType) =>
        row.valor > 0 ? `R$ ${row.valor}` : <Text color="gray.400">R$ 0</Text>
    },
    { header: 'Cestas', accessor: 'cestas' },
    {
      header: 'Labels',
      accessor: 'labels',
      customRender: (row: RecordType) => (
        <Flex gap={1} wrap="wrap">
          {row.labels.map((label: string) => (
            <Tag.Root colorPalette={REUNION_LABEL_COLORS[label] || 'gray'} key={label}>
              {label}
            </Tag.Root>
          ))}
        </Flex>
      )
    },
    ...(isClosed
      ? [
          {
            header: 'Devolvido',
            accessor: 'delivered' as keyof RecordType,
            customRender: (row: RecordType) => (
              <Checkbox.Root
                checked={row.delivered}
                onCheckedChange={() => onToggleDelivery(row.id, row.delivered)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            )
          }
        ]
      : []),
    {
      header: 'Ações',
      customRender: (row: RecordType) => (
        <Flex gap={2}>
          <Button size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); onViewRecord(row); }}>
            <FiEye />
          </Button>
          <Button size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); onDeleteRecord(row.id); }}>
            <FiTrash2 />
          </Button>
        </Flex>
      )
    }
  ];

  return (
    <Box
      id="reunion-table"
      w={drawerOpen ? 'calc(100% - 400px)' : '100%'}
      h="95%"
      transition="width 0.4s cubic-bezier(.4,0,.2,1)"
    >
      <BaseTable
        drawerOpen={drawerOpen}
        data={filteredRecords}
        columns={columns}
        isLoading={isLoading}
      />
    </Box>
  );
};
