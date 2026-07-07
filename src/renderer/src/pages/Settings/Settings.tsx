import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  Flex,
  Alert,
  Spinner
} from '@chakra-ui/react'
import { PageHeader, PageContainer } from '../../components'
import { useColorModeValue } from '../../components/ui/color-mode'
import { useEffect, useState } from 'react'
import { useTutorialContext } from '../../contexts/TutorialContext'
import { QRCodeSVG } from 'qrcode.react'

interface SettingsConfig {
  dbPath?: string
}

interface SaveResult {
  success: boolean
  error?: string
}

export const Settings = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const [currentPath, setCurrentPath] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [serverUrl, setServerUrl] = useState<string | null>(null)
  const { startTutorial, hasSeenTutorial } = useTutorialContext()

  useEffect(() => {
    loadSettings()
    loadServerUrl()
    if (!hasSeenTutorial('settings')) {
      startTutorial('settings')
    }
  }, [])

  const loadSettings = async () => {
    try {
      const config = (await window.electron.ipcRenderer.invoke('settings:get')) as SettingsConfig
      if (config && config.dbPath) {
        setCurrentPath(config.dbPath)
      }
    } catch (error) {
      console.error('Failed to load settings', error)
    }
  }

  const loadServerUrl = async () => {
    try {
      const url = (await window.electron.ipcRenderer.invoke('server:getUrl')) as string
      setServerUrl(url)
    } catch {
      // server not available
    }
  }

  const handleSelectFolder = async () => {
    try {
      setIsLoading(true)
      const folder = await window.electron.ipcRenderer.invoke('settings:select-db-folder')
      if (folder) {
        const result = (await window.electron.ipcRenderer.invoke(
          'settings:save-db-path',
          folder
        )) as SaveResult
        if (result.success) {
          const newConfig = (await window.electron.ipcRenderer.invoke(
            'settings:get'
          )) as SettingsConfig
          setCurrentPath(newConfig.dbPath || '')
          alert(
            'Pasta do banco de dados atualizada! Por favor, feche e abra o aplicativo novamente para usar o novo banco de dados.'
          )
        } else {
          alert('Erro ao salvar configuração: ' + result.error)
        }
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
      alert('Erro ao selecionar pasta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <Box id="settings-header">
        <PageHeader title="Configurações" />
      </Box>

      <Box bg={bg} p={6} borderRadius="lg" shadow="sm" borderWidth="1px" mt={6}>
        <VStack align="start" gap={6}>
          <Box id="settings-db-path" w="100%">
            <Heading size="md" mb={4}>
              Armazenamento de Dados
            </Heading>
            <Text mb={2}>Local atual do banco de dados:</Text>
            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <Input value={currentPath} readOnly placeholder="Carregando..." flex={1} />
              <Button onClick={handleSelectFolder} disabled={isLoading} colorPalette="blue">
                {isLoading ? <Spinner size="sm" /> : 'Alterar Pasta'}
              </Button>
            </Flex>
            <Text fontSize="sm" color="gray.500" mt={2}>
              O arquivo <code>database.sqlite</code> será salvo nesta pasta.
            </Text>
          </Box>

          <Alert.Root status="info" variant="subtle">
            <Alert.Indicator />
            <Box>
              <Alert.Title>Sincronização Segura Ativada</Alert.Title>
              <Alert.Description fontSize="sm">
                O sistema agora possui um mecanismo de trava de segurança.
                <br />
                Se outro computador estiver utilizando o banco de dados nesta pasta, você será
                impedido de abrir o sistema para evitar conflitos.
              </Alert.Description>
            </Box>
          </Alert.Root>
        </VStack>
      </Box>

      {serverUrl && (
        <Box bg={bg} p={6} borderRadius="lg" shadow="sm" borderWidth="1px" mt={4}>
          <Heading size="md" mb={4}>
            Acesso Mobile (PWA)
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Usuários na mesma rede Wi-Fi podem escanear o QR Code abaixo para visualizar os dados
            em tempo real pelo celular.
          </Text>
          <Flex gap={6} align="start" direction={{ base: 'column', md: 'row' }}>
            <Box p={3} bg="white" borderRadius="md" borderWidth="1px" borderColor="gray.200" flexShrink={0}>
              <QRCodeSVG value={serverUrl} size={160} />
            </Box>
            <VStack align="start" gap={3}>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  URL do servidor:
                </Text>
                <Input
                  value={serverUrl}
                  readOnly
                  size="sm"
                  fontFamily="mono"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </Box>
              <Alert.Root status="warning" variant="subtle" size="sm">
                <Alert.Indicator />
                <Alert.Description fontSize="xs">
                  O celular deve estar conectado à mesma rede Wi-Fi que este computador.
                </Alert.Description>
              </Alert.Root>
            </VStack>
          </Flex>
        </Box>
      )}
    </PageContainer>
  )
}
