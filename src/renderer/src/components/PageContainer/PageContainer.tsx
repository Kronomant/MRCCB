import { Box, BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface PageContainerProps extends BoxProps {
  children: ReactNode
  isFixed?: boolean
}

export const PageContainer = ({ children, isFixed = false, ...props }: PageContainerProps) => {
  return (
    <Box
      w="100%"
      h="100%"
      overflowY={isFixed ? 'hidden' : 'auto'}
      overflowX="hidden"
      p={6}
      position="relative"
      backgroundColor="bg.panel"
      {...props}
    >
      {children}
    </Box>
  )
}
