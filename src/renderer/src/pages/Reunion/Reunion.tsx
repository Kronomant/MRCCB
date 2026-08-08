import { Box, Stack, Tabs, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@shared/components';
import { FiUsers, FiDollarSign } from 'react-icons/fi';
import { useEffect } from 'react';

import { useTutorialContext } from '../../contexts/TutorialContext';
import {
  CashRegisterTab,
  ReunionHeader,
  ReunionModalsContainer,
  ReunionSummaryCards,
  ReunionAttendanceToolbar,
  ReunionAttendanceTable,
  ReunionAttendanceDrawer,
} from '@reunion/components';

import { useReunionData } from '@reunion/hooks';
import { useReunionModals } from '@reunion/hooks';
import { useReunionTable } from '@reunion/hooks';
import { useReunionForm } from '@reunion/hooks';
import { ReunionStatus } from '../../types/reunion-status';
import { RecordType } from '../../hooks/records/useRecords';

export const Reunion = () => {
  const { startTutorial, hasSeenTutorial } = useTutorialContext();
  const { id } = useParams();
  const reunionId = Number(id);

  useEffect(() => {
    if (!hasSeenTutorial('reunion')) {
      startTutorial('reunion');
    }
  }, [hasSeenTutorial, startTutorial]);

  // 1. Data Hook (Global Reunion Data)
  const data = useReunionData(reunionId);
  const isClosed =
    data.reunionStatus === ReunionStatus.FINISHED ||
    data.reunionStatus?.toLowerCase() === 'finished' ||
    data.reunionStatus?.toLowerCase() === 'closed';

  // 2. Modals Hook (UI State for Modals)
  const modals = useReunionModals();

  // 3. Table Hook (Search, Filters, Deletion)
  const table = useReunionTable(reunionId);

  // 4. Form Hook (Drawer state and saving logic)
  const form = useReunionForm(reunionId);

  // Derived Handlers
  const handleViewOrEdit = (record: RecordType) => {
    const prontuario = data.prontuarios.find((p) => p.id === record.prontuarioId);
    form.setFormState({
      record,
      prontuarioSearch: String(record.prontuarioNumber || ''),
      prontuarioError: null,
      selectedUnityId: prontuario?.unityId ?? null,
      isNewProntuario: record.id !== 0 && !record.prontuarioId,
    });
    form.setDrawerOpen(true);
  };

  const handleAdd = () => {
    form.setFormState({
      record: {
        ...form.defaultRecord,
        valor: 0,
        cestas: data.reunion?.foodBasketQuantity || 0,
      },
      prontuarioSearch: '',
      prontuarioError: null,
      selectedUnityId: null,
      isNewProntuario: false,
    });
    form.setDrawerOpen(true);
  };

  const onToggleDelivery = (atendimentoId: number, currentStatus: boolean) => {
    table.handleToggleDelivery(atendimentoId, currentStatus, form.updateRecord);
  };

  return (
    <PageContainer isFixed>
      <Stack gap={4} h="100%" flexDirection="column">
        <Box id="reunion-header">
          <ReunionHeader
            dateString={data.summary.data}
            isClosed={isClosed}
            onNavigateBack={() => data.navigate('/reunioes')}
            onOpenCloseModal={() => modals.setCloseModalOpen(true)}
            onOpenReopenModal={() => modals.setReopenModalOpen(true)}
            onOpenProtocolModal={() => modals.setProtocolModalOpen(true)}
            onOpenValuesProtocolModal={() => modals.setValuesProtocolModalOpen(true)}
          />
        </Box>

        <Tabs.Root defaultValue="atendimentos" variant="plain" flex="1" display="flex" flexDirection="column" minH="0">
          <Tabs.List
            mb={4}
            bg="bg.muted"
            p="1"
            borderRadius="xl"
            display="inline-flex"
            w="fit-content"
            borderWidth="1px"
            borderColor="border"
          >
            <Tabs.Trigger
              value="atendimentos"
              px={6}
              py={2.5}
              borderRadius="lg"
              fontSize="md"
              fontWeight="semibold"
              display="flex"
              alignItems="center"
              gap={2.5}
              _selected={{ bg: 'bg', color: 'cyan.600', shadow: 'sm' }}
              _hover={{ cursor: 'pointer', color: 'cyan.400' }}
            >
              <FiUsers size={18} />
              Atendimentos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="auditoria"
              px={6}
              py={2.5}
              borderRadius="lg"
              fontSize="md"
              fontWeight="semibold"
              display="flex"
              alignItems="center"
              gap={2.5}
              _selected={{ bg: 'bg', color: 'pink.600', shadow: 'sm' }}
              _hover={{ cursor: 'pointer', color: 'pink.400' }}
            >
              <FiDollarSign size={18} />
              Auditoria
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="atendimentos" flex="1" display="flex" flexDirection="column" minH="0">
            <Box id="reunion-summary" mb={8}>
              <ReunionSummaryCards summary={data.summary} isClosed={isClosed} reunion={data.reunion} />
            </Box>

            <ReunionAttendanceToolbar
              search={table.search}
              setSearch={table.setSearch}
              isClosed={isClosed}
              onAddRecord={handleAdd}
            />

            <Flex w="100%" flex="1" minH="0">
              <Flex w="100%" h="100%" position="relative" overflow="hidden">
                <ReunionAttendanceTable
                  filteredRecords={table.filteredRecords}
                  isLoading={data.isLoading}
                  isClosed={isClosed}
                  drawerOpen={form.drawerOpen}
                  onViewRecord={handleViewOrEdit}
                  onDeleteRecord={table.handleDelete}
                  onToggleDelivery={onToggleDelivery}
                />

                <ReunionAttendanceDrawer
                  drawerOpen={form.drawerOpen}
                  setDrawerOpen={form.setDrawerOpen}
                  record={form.formState.record}
                  isClosed={isClosed}
                  prontuarioSearch={form.formState.prontuarioSearch}
                  isNewProntuario={form.formState.isNewProntuario}
                  selectedUnityId={form.formState.selectedUnityId}
                  filteredProntuarios={form.filteredProntuarios}
                  collection={form.collection}
                  unities={data.unities}
                  onSaveRecord={form.handleSave}
                  onRecordChange={form.updateRecord}
                  onProntuarioSelect={form.handleProntuarioSelect}
                  onProntuarioSearch={form.updateProntuarioSearch}
                  onUnityChange={form.updateUnityId}
                  onToggleDelivery={onToggleDelivery}
                />
              </Flex>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="auditoria" flex="1" display="flex" flexDirection="column" minH="0" overflow="hidden">
            <CashRegisterTab
              reunionId={reunionId}
              reunionStatus={data.reunionStatus}
              summary={{
                totalGasto: data.summary.totalGasto,
                cestas: data.summary.cestas,
                atendimentos: data.summary.atendimentos
              }}
              reunionDate={data.reunion?.date}
              records={data.records}
              unities={data.unities}
              prontuarios={data.prontuarios}
              basketValue={data.reunion?.basketValue}
            />
          </Tabs.Content>
        </Tabs.Root>

        <ReunionModalsContainer
          reopenModalOpen={modals.reopenModalOpen}
          setReopenModalOpen={modals.setReopenModalOpen}
          closeModalOpen={modals.closeModalOpen}
          setCloseModalOpen={modals.setCloseModalOpen}
          protocolModalOpen={modals.protocolModalOpen}
          setProtocolModalOpen={modals.setProtocolModalOpen}
          valuesProtocolModalOpen={modals.valuesProtocolModalOpen}
          setValuesProtocolModalOpen={modals.setValuesProtocolModalOpen}
          
          onConfirmReopen={data.handleReopenReunion}
          onConfirmClose={data.handleCloseReunion}
          
          summary={data.summary}
          reunion={data.reunion}
          records={data.records}
          unities={data.unities}
          prontuarios={data.prontuarios}
        />
      </Stack>
    </PageContainer>
  );
};
