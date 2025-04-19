import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from './components'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Flex>
      <Sidebar />
      <Box ml="240px" p="4" flex="1">
        batata
      </Box>
    </Flex>
  )
}

export default App
