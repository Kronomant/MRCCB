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
import { ClosingDocument } from './ClosingDocument'
import { format } from 'date-fns'

interface ClosingModalProps {
  isOpen: boolean
  onClose: () => void
  cashRegister: CashRegister
  tickets: CashTicket[]
  expenses: CashExpense[]
  summary: {
    totalGasto: number
    cestas: number
    atendimentos: number
  }
  reunionDate?: string
  institutionName?: string
}

export const ClosingModal: React.FC<ClosingModalProps> = ({
  isOpen,
  onClose,
  cashRegister,
  tickets,
  expenses,
  summary,
  reunionDate,
  institutionName = 'Congregação Cristã no Brasil - Obra da Piedade',
}) => {
  const date = reunionDate ?? cashRegister.createdAt ?? ''
  const fileName = `Fechamento_${date ? format(new Date(date), 'yyyy-MM-dd') : 'Reuniao'}.pdf`

  const totalTickets = tickets.reduce((s, t) => s + t.value, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.value, 0)

  const document = (
    <ClosingDocument
      institutionName={institutionName}
      date={date}
      openingValue={cashRegister.openingValue}
      availableValue={cashRegister.availableValue}
      openingCounts={cashRegister.openingCounts}
      closingValue={cashRegister.closingValue ?? 0}
      closingCounts={cashRegister.closingCounts}
      closingDifference={cashRegister.closingDifference ?? 0}
      tickets={tickets}
      expenses={expenses}
      totalAttendances={summary.totalGasto}
      atendimentoCount={summary.atendimentos}
      cestasCount={summary.cestas}
      totalTickets={totalTickets}
      totalExpenses={totalExpenses}
    />
  )

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="xl"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent
          h="90vh"
          m="0 20% 0 0"
          rounded="md"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <DialogHeader borderBottomWidth="1px">
            <DialogTitle>Fechamento de Caixa</DialogTitle>
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
