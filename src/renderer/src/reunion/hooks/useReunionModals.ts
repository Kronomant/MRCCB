import { useState } from 'react';

export const useReunionModals = () => {
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [protocolModalOpen, setProtocolModalOpen] = useState(false);
  const [valuesProtocolModalOpen, setValuesProtocolModalOpen] = useState(false);

  return {
    closeModalOpen,
    setCloseModalOpen,
    reopenModalOpen,
    setReopenModalOpen,
    protocolModalOpen,
    setProtocolModalOpen,
    valuesProtocolModalOpen,
    setValuesProtocolModalOpen,
  };
};
