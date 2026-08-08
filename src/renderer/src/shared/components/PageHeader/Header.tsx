import { PropsWithChildren } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import './Header.style.scss'

interface IPageHeader extends PropsWithChildren {
  title: string
  onBack?: () => void
}

export const PageHeader = ({ title, onBack, children }: IPageHeader) => (
  <div className="header-container">
    <Flex gap="8" alignItems="center">
      {onBack && <Button onClick={onBack}>voltar</Button>}
      <Text textStyle="2xl" fontWeight="bold" color="gray.solid">
        {title}
      </Text>
    </Flex>
    {children}
  </div>
)
