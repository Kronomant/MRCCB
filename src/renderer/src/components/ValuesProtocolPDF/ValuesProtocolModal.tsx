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
} from '@chakra-ui/react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { ValuesProtocolDocument } from './ValuesProtocolDocument'
import { format, parseISO } from 'date-fns'

interface ValuesProtocolModalProps {
  isOpen: boolean
  onClose: () => void
  records: any[]
  unities: any[]
  prontuarios: any[]
  date: string
  basketValue?: number
  institutionName?: string
}

export const ValuesProtocolModal: React.FC<ValuesProtocolModalProps> = ({
  isOpen,
  onClose,
  records,
  unities,
  prontuarios,
  date,
  basketValue = 0,
  institutionName = 'Congregação Cristã no Brasil - Obra da Piedade',
}) => {
  const fileName = `Protocolo_Valores_${date ? format(parseISO(date), 'yyyy-MM-dd') : 'Reuniao'}.pdf`
  const document = (
    <ValuesProtocolDocument
      records={records}
      unities={unities}
      prontuarios={prontuarios}
      date={date}
      basketValue={basketValue}
      institutionName={institutionName}
    />
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
          overflow="hidden"
        >
          <DialogHeader borderBottomWidth="1px">
            <DialogTitle>Gerar resultado da reunião</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>

          <DialogBody p={0} flex="1" display="flex" flexDirection="column" overflow="hidden">
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
