import { Box, Flex, Text } from '@chakra-ui/react'
import { NavLink, Outlet } from 'react-router-dom'
import { useRealtimeSync } from '../ws/useRealtimeSync'

const navItems = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/reunioes', label: 'Reuniões', icon: '📋' },
  { to: '/prontuarios', label: 'Prontuários', icon: '📁' },
  { to: '/unidades', label: 'Unidades', icon: '🏛️' }
]

export function Layout() {
  useRealtimeSync()

  return (
    <Flex direction="column" minH="100dvh" bg="gray.50">
      <Box flex="1" overflowY="auto" pb="80px">
        <Outlet />
      </Box>

      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTopWidth="1px"
        borderColor="gray.200"
        safeAreaPaddingBottom="env(safe-area-inset-bottom)"
      >
        <Flex justify="space-around" py={2}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {({ isActive }) => (
                <Flex
                  direction="column"
                  align="center"
                  gap={0.5}
                  px={3}
                  py={1}
                  borderRadius="md"
                  color={isActive ? 'blue.600' : 'gray.500'}
                >
                  <Text fontSize="xl">{item.icon}</Text>
                  <Text fontSize="xs" fontWeight={isActive ? 'semibold' : 'normal'}>
                    {item.label}
                  </Text>
                </Flex>
              )}
            </NavLink>
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}
