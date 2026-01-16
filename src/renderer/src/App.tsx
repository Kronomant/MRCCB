import { Flex } from '@chakra-ui/react'
import { Sidebar } from './components'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const fromHome = typeof window !== 'undefined' && sessionStorage.getItem('transitionFromHome') === '1'
  const [animStart, setAnimStart] = useState(fromHome)

  useEffect(() => {
    if (fromHome) {
      sessionStorage.removeItem('transitionFromHome')
      setTimeout(() => setAnimStart(false), 50)
    }
  }, [])

  return (
    <Flex w="100vw" h="100vh" overflow="hidden">
      <Flex
        transition="transform 400ms cubic-bezier(.4,0,.2,1), opacity 320ms cubic-bezier(.4,0,.2,1)"
        transform={animStart ? 'translateX(-32px)' : 'translateX(0)'}
        opacity={animStart ? 0 : 1}
      >
        <Sidebar />
      </Flex>
      <Flex
        w="100%"
        h="100%"
        overflow="hidden"
        bg="bg.muted"
        transition="transform 420ms cubic-bezier(.4,0,.2,1), opacity 320ms cubic-bezier(.4,0,.2,1)"
        transform={animStart ? 'translateY(8px)' : 'translateY(0)'}
        opacity={animStart ? 0 : 1}
      >
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default App
