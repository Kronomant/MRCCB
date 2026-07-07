import { ReactNode } from 'react'
import {
  Button,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
  Portal
} from '@chakra-ui/react'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  title: string
  onConfirm: () => void
  confirmLabel: string
  confirmColorPalette?: string
  children: ReactNode
}

export const ConfirmationDialog = ({
  open,
  onClose,
  title,
  onConfirm,
  confirmLabel,
  confirmColorPalette = 'blue',
  children
}: ConfirmationDialogProps) => (
  <DialogRoot open={open} onOpenChange={(e) => !e.open && onClose()} placement="center">
    <DialogBackdrop />
    <Portal>
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>{children}</DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorPalette={confirmColorPalette}
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </Portal>
  </DialogRoot>
)
