import React from 'react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
  Button,
  Box,
  useBreakpointValue,
  Flex
} from '@chakra-ui/react'
import { PDFViewer, PDFDownloadLink, usePDF } from '@react-pdf/renderer'
import { ProtocolDocument } from './ProtocolDocument'
import { format } from 'date-fns'
import { FiExternalLink } from 'react-icons/fi'

interface ProtocolModalProps {
  isOpen: boolean
  onClose: () => void
  records: any[]
  unities: any[]
  prontuarios: any[]
  date: string
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({
  isOpen,
  onClose,
  records,
  unities,
  prontuarios,
  date
}) => {
  const fileName = `Protocolo_${date ? format(new Date(date), 'yyyy-MM-dd') : 'Reuniao'}.pdf`
  const document = (
    <ProtocolDocument records={records} unities={unities} prontuarios={prontuarios} date={date} />
  )

  const maxHeight = '90vh'
  const margin = '0 20% 0 0'
  const borderRadius = 'md'

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size={'xl'}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent
          h={maxHeight}
          m={margin}
          rounded={borderRadius}
          display="flex"
          flexDirection="column"
          overflow="hidden" // Prevents overflow of the modal itself
        >
          <DialogHeader borderBottomWidth="1px">
            <DialogTitle>Gerar Protocolo</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>

          <DialogBody p={0} flex="1" display="flex" flexDirection="column" overflow="hidden">
            {/* 
              Wrapper needs to be flex-1 and overflow-hidden to contain the PDFViewer 
              and force it to respect the parent's height 
            */}
            <Box flex="1" w="100%" h="100%" overflow="hidden">
              <PDFViewer width="100%" height="100%" showToolbar={true} style={{ border: 'none' }}>
                {document}
              </PDFViewer>
            </Box>
          </DialogBody>

          <DialogFooter borderTopWidth="1px">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>

            <PDFDownloadLink document={document} fileName={fileName}>
              {({ loading }) => (
                <Button colorScheme="green" disabled={loading}>
                  {loading ? 'Gerando PDF...' : 'Salvar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
