import { Box, Flex, Icon, Image, Text, VStack } from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import { ColorModeButton, useColorMode } from '../ui/color-mode'
import { Link } from 'react-router-dom'
import { menuItems } from './Sidebar.data'
import logo from '../../assets/logo.svg'
import whiteLogo from '../../assets/white-logo.svg'
import './Sidebar.style.scss'

interface NavItemProps {
  icon: ReactNode
  children: string
  href: string
  onClick: () => void
  selected: boolean
}

const NavItem = ({ icon, children, href, onClick, selected }: NavItemProps) => {
  return (
    <Link className="sidebar__nav" to={href} onClick={onClick}>
      <Flex
        w="100%"
        align="center"
        justify="center"
        p="3"
        borderRadius="md"
        role="group"
        cursor="pointer"
        backgroundColor={selected ? 'gray.200' : ''}
      >
        <Icon mr="3" size="md" color="gray.solid">
          {icon}
        </Icon>
        <Text fontSize="md" color="fg">
          {children}
        </Text>
      </Flex>
    </Link>
  )
}

export const Sidebar = () => {
  const { colorMode } = useColorMode()
  const [selected, setSelected] = useState<string>('reunioes')
  return (
    <Box bg="bg.muted" w="240px" h="100vh" p="4" boxShadow="md">
      <Image src={colorMode === 'dark' ? whiteLogo : logo} />
      <VStack align="start" gap="16px">
        <Flex w="100%" align="center" justify="center" p="3" borderRadius="md">
          <ColorModeButton />
        </Flex>
        {menuItems.map((item) => (
          <NavItem
            selected={!!item.path.match(selected)}
            key={item.title}
            icon={item.icon}
            href={item.path}
            onClick={() => setSelected(item.path)}
          >
            {item.title}
          </NavItem>
        ))}
      </VStack>
    </Box>
  )
}
