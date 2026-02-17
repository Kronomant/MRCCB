import { Box, Flex, Icon, Image, Text, VStack, IconButton } from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import { ColorModeButton, useColorMode } from '../ui/color-mode'
import { Link } from 'react-router-dom'
import { menuItems } from './Sidebar.data'
import logo from '../../assets/logo.svg'
import whiteLogo from '../../assets/white-logo.svg'
import './Sidebar.style.scss'
import { FiHelpCircle } from 'react-icons/fi'
import { useTutorialContext } from '../../contexts/TutorialContext'

interface NavItemProps {
  id: string
  icon: ReactNode
  children: string
  href: string
  onClick: () => void
  selected: boolean
}

const NavItem = ({ id, icon, children, href, onClick, selected }: NavItemProps) => {
  return (
    <Link className="sidebar__nav" to={href} onClick={onClick}>
      <Flex
        id={id}
        className={`sidebar__nav-item ${selected ? 'sidebar__nav-item--selected' : ''}`}
        w="100%"
        align="start"
        justify="start"
        p="3"
        paddingLeft="6"
        borderRadius="md"
        role="group"
        cursor="pointer"
      >
        <Icon mr="3" size="md" className="sidebar__nav-icon">
          {icon}
        </Icon>
        <Text fontSize="md" className="sidebar__nav-text">
          {children}
        </Text>
      </Flex>
    </Link>
  )
}

export const Sidebar = () => {
  const { colorMode } = useColorMode()
  const [selected, setSelected] = useState<string>('reunioes')
  const { startTutorial } = useTutorialContext()

  const handleStartTutorial = () => {
    startTutorial('sidebar')
  }

  return (
    <Box id="sidebar" bg="bg.muted" w="240px" h="100vh" p="4" boxShadow="md">
      <Box id="sidebar-logo">
        <Image src={colorMode === 'dark' ? whiteLogo : logo} />
      </Box>
      <VStack align="start" gap="16px">
        <Flex
          id="sidebar-theme-toggle"
          w="100%"
          align="center"
          justify="center"
          p="3"
          borderRadius="md"
        >
          <ColorModeButton />
        </Flex>
        {menuItems.map((item) => (
          <NavItem
            id={`sidebar-nav-${item.path}`}
            selected={!!item.path.match(selected)}
            key={item.title}
            icon={item.icon}
            href={item.path}
            onClick={() => setSelected(item.path)}
          >
            {item.title}
          </NavItem>
        ))}
        <Flex
          id="sidebar-tutorial-btn"
          w="100%"
          align="center"
          justify="center"
          mt="auto"
          pt="4"
        >
          <IconButton
            aria-label="Ajuda e Tutorial"
            variant="ghost"
            size="md"
            onClick={handleStartTutorial}
            title="Iniciar Tutorial"
          >
            <FiHelpCircle />
          </IconButton>
        </Flex>
      </VStack>
    </Box>
  )
}

