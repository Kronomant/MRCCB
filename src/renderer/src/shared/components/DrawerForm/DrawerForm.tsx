import React from 'react'
import { Box, Flex, Button, Text } from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'

interface DrawerFormProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  onPrimaryAction?: () => void
  primaryLabel?: string
  onSecondaryAction?: () => void
  secondaryLabel?: string
  isLoading?: boolean
  headerActions?: React.ReactNode
}

const drawerWidth = 400

export const DrawerForm: React.FC<DrawerFormProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onPrimaryAction,
  primaryLabel = 'Salvar',
  onSecondaryAction,
  secondaryLabel = 'Cancelar',
  isLoading = false,
  headerActions
}) => (
  <Box
    as="form"
    onSubmit={(e) => {
      e.preventDefault()
      onPrimaryAction?.()
    }}
    position="absolute"
    right={0}
    top={0}
    height="100%"
    width={drawerWidth}
    maxWidth="100vw"
    bg="bg"
    rounded="md"
    border="1px solid"
    borderColor="border"
    zIndex={10}
    display={'flex'}
    flexDirection="column"
    style={{
      transform: isOpen ? 'translateX(0)' : `translateX(${drawerWidth}px)`,
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1)'
    }}
  >
    <Flex
      w="100%"
      justify="space-between"
      align="center"
      px={4}
      py={2}
      borderBottom="1px solid"
      borderColor="border"
      gap={2}
    >
      {title && (
        <Text fontWeight="bold" color="fg" fontSize="lg" flex={1} minW={0} truncate>
          {title}
        </Text>
      )}
      <Flex align="center" gap={2} flexShrink={0}>
        {headerActions}
        <Button variant="outline" onClick={onClose} size="sm" type="button">
          <FiX />
        </Button>
      </Flex>
    </Flex>
    <Box flex={1} px={6} py={4} overflowY="auto">
      {children}
    </Box>
    <Flex
      px={6}
      py={4}
      borderTop="1px solid"
      borderColor="border.subtle"
      justify="flex-end"
      gap={3}
    >
      <Button
        variant="outline"
        onClick={onSecondaryAction || onClose}
        disabled={isLoading}
        type="button"
      >
        {secondaryLabel}
      </Button>
      <Button colorScheme="blue" type="submit" loading={isLoading} disabled={isLoading}>
        {primaryLabel}
      </Button>
    </Flex>
  </Box>
)
