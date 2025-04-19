import { Box, Flex, Icon, Text, VStack, Link as ChakraLink } from '@chakra-ui/react'
import { FiHome, FiSettings, FiUser } from 'react-icons/fi'
import { ReactNode } from 'react'

interface NavItemProps {
  icon: ReactNode
  children: string
  href: string
}

const NavItem = ({ icon, children, href }: NavItemProps) => {
  return (
    <ChakraLink
      href={href}
      w="100%"
      style={{ textDecoration: 'none', borderRadius: '4px' }}
      _hover={{ textDecoration: 'none', bg: 'gray.200', color: 'gray.700' }}
    >
      <Flex align="center" p="3" mx="2" borderRadius="md" role="group" cursor="pointer">
        <Icon mr="3" fontSize="20" color="gray.700">
          {icon}
        </Icon>
        <Text fontSize="sm" color={'blue.900'}>
          {children}
        </Text>
      </Flex>
    </ChakraLink>
  )
}

export const Sidebar = () => {
  return (
    <Box bg="gray.50" w="240px" h="100vh" p="4" boxShadow="md" position="fixed" top="0" left="0">
      <Text fontSize="xl" fontWeight="bold" mb="6" color="gray.700">
        MyApp
      </Text>

      <VStack align="start" gap={'16px'}>
        <NavItem icon={<FiHome />} href="#">
          Início
        </NavItem>
        <NavItem icon={<FiUser />} href="#">
          Perfil
        </NavItem>
        <NavItem icon={<FiSettings />} href="#">
          Configurações
        </NavItem>
      </VStack>
    </Box>
  )
}
