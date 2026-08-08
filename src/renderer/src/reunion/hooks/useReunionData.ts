import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRecords } from '../../hooks/records/useRecords';
import { useProntuarios } from '../../hooks/prontuario';
import { useUnities } from '../../hooks/unity';
import { updateReunion } from '../../services/reunionService';
import { ReunionStatus } from '../../types/reunion-status';

export const useReunionData = (reunionId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    records: hookRecords,
    summary,
    isLoading,
    reunions,
  } = useRecords(reunionId);

  const { getProntuariosForReunion } = useProntuarios({
    fetchAll: false,
    fetchActive: false, // active fetched in form when drawer opens
  });

  const { data: reunionProntuarios } = getProntuariosForReunion(hookRecords);
  const { unities } = useUnities();

  const updateReunionMutation = useMutation({
    mutationFn: updateReunion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reunion', reunionId] });
      queryClient.invalidateQueries({ queryKey: ['reunions'] });
    },
  });

  const handleCloseReunion = async () => {
    try {
      const currentReunion = reunions.data;
      if (!currentReunion) return;

      await updateReunionMutation.mutateAsync({
        ...currentReunion,
        status: ReunionStatus.FINISHED,
      });

      navigate('/reunioes');
    } catch (err) {
      console.error('Falha ao encerrar reunião:', err);
    }
  };

  const handleReopenReunion = async () => {
    try {
      const currentReunion = reunions.data;
      if (!currentReunion) return;

      await updateReunionMutation.mutateAsync({
        ...currentReunion,
        status: ReunionStatus.IN_PROGRESS,
      });
    } catch (err) {
      console.error('Falha ao reabrir reunião:', err);
    }
  };

  return {
    navigate,
    isLoading,
    summary,
    records: hookRecords,
    prontuarios: reunionProntuarios || [],
    unities,
    reunionStatus: reunions.data?.status,
    reunion: reunions.data,
    handleCloseReunion,
    handleReopenReunion,
  };
};
