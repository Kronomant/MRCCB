import { Box, Button, Card, Flex, Heading, Icon, Image, Stack, Text } from '@chakra-ui/react'
import { FiCalendar, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import logoLight from '../../assets/logo.svg'
import logoDark from '../../assets/white-logo.svg'
import { useColorModeValue } from '../../components/ui/color-mode'
import wavyLines from '../../assets/wavy-lines.svg'

export const Home = (): JSX.Element => {
  const navigate = useNavigate()
  const logoSrc = useColorModeValue(logoLight, logoDark)

  const onGoReunioes = () => navigate('/reunioes')
  const onGoProntuarios = () => navigate('/prontuarios')
  const navigateWithAnim = (path: string) => {
    sessionStorage.setItem('transitionFromHome', '1')
    navigate(path)
  }

  return (
    <Flex
      position="fixed"
      inset={0}
      w="100vw"
      h="100vh"
      bg="bg"
      align="center"
      justify="center"
      p={{ base: 6, md: 10 }}
      overflow="hidden"
    >
      <Box position="absolute" inset={0} pointerEvents="none" opacity={0.25}>
        <Image src={wavyLines} alt="" w="120%" maxW="none" transform="translateX(-10%)" />
      </Box>
      <Stack w="100%" maxW="960px" gap={{ base:8, md: 12 }} align="center">
        <Box as="header" textAlign="center">
          <Image
            src={logoSrc}
            alt="Logo do projeto"
            w={{ base: '180px', md: '240px' }}
            h="auto"
            mx="auto"
            draggable={false}
            style={{ userSelect: 'none' }}
          />
          <Text mt={4} color="fg.muted">
            Gestão eficiente de reuniões e prontuários
          </Text>
        </Box>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 6, md: 8 }}
          w="100%"
          align="stretch"
        >
          <Card.Root
            role="region"
            aria-label="Card de Reuniões"
            p={6}
            flex={1}
            bg="white"
            _dark={{ bg: 'gray.800' }}
            borderRadius="lg"
            borderWidth={0}
            boxShadow="sm"
            transition="transform 240ms cubic-bezier(.4,0,.2,1), box-shadow 240ms cubic-bezier(.4,0,.2,1)"
            _hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}
          >
            <Card.Body>
              <Flex align="center" gap={4} mb={4}>
                <Box bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="full" p={3}>
                  <Icon
                    as={FiCalendar}
                    color="blue.600"
                    _dark={{ color: 'blue.300' }}
                    aria-hidden
                  />
                </Box>
                <Heading size="lg" color="blue.700" _dark={{ color: 'blue.300' }}>
                  Reuniões
                </Heading>
              </Flex>
              <Text color="fg.muted" mb={6}>
                Planeje, acompanhe e registre decisões com clareza.
              </Text>
              <Button
                onClick={() => navigateWithAnim('/reunioes')}
                colorPalette="blue"
                variant="solid"
                borderRadius="md"
                aria-label="Acessar Reuniões"
              >
                Acessar Reuniões
              </Button>
            </Card.Body>
          </Card.Root>

          <Card.Root
            role="region"
            aria-label="Card de Prontuários"
            p={6}
            flex={1}
            bg="white"
            _dark={{ bg: 'gray.800' }}
            borderRadius="lg"
            borderWidth={0}
            boxShadow="sm"
            transition="transform 240ms cubic-bezier(.4,0,.2,1), box-shadow 240ms cubic-bezier(.4,0,.2,1)"
            _hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}
          >
            <Card.Body>
              <Flex align="center" gap={4} mb={4}>
                <Box bg="teal.50" _dark={{ bg: 'teal.900' }} borderRadius="full" p={3}>
                  <Icon
                    as={FiFileText}
                    color="teal.600"
                    _dark={{ color: 'teal.300' }}
                    aria-hidden
                  />
                </Box>
                <Heading size="lg" color="teal.700" _dark={{ color: 'teal.300' }}>
                  Prontuários
                </Heading>
              </Flex>
              <Text color="fg.muted" mb={6}>
                Documente atendimentos com segurança e conformidade.
              </Text>
              <Button
                onClick={() => navigateWithAnim('/prontuarios')}
                colorPalette="teal"
                variant="solid"
                borderRadius="md"
                aria-label="Acessar Prontuários"
              >
                Acessar Prontuários
              </Button>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Stack>
    </Flex>
  )
}
