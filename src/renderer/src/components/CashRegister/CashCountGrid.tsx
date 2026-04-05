import React, { useState } from 'react'
import {
  Box,
  Text,
  Stack,
  Flex,
  Heading,
} from '@chakra-ui/react'
import { Input } from '../Input'

interface Denomination {
  value: number
  label: string
  type: 'note' | 'coin'
}

const DENOMINATIONS: Denomination[] = [
  { value: 200, label: 'R$ 200', type: 'note' },
  { value: 100, label: 'R$ 100', type: 'note' },
  { value: 50, label: 'R$ 50', type: 'note' },
  { value: 20, label: 'R$ 20', type: 'note' },
  { value: 10, label: 'R$ 10', type: 'note' },
  { value: 5, label: 'R$ 5', type: 'note' },
  { value: 2, label: 'R$ 2', type: 'note' },
  { value: 1, label: 'R$ 1', type: 'coin' },
  { value: 0.5, label: 'R$ 0,50', type: 'coin' },
  { value: 0.25, label: 'R$ 0,25', type: 'coin' },
  { value: 0.1, label: 'R$ 0,10', type: 'coin' },
  { value: 0.05, label: 'R$ 0,05', type: 'coin' }
]

interface CashCountGridProps {
  onTotalChange: (total: number) => void
}

export const CashCountGrid: React.FC<CashCountGridProps> = ({ onTotalChange }) => {
  const [counts, setCounts] = useState<Record<number, number>>({})

  const handleCountChange = (value: number, countInput: string) => {
    const count = countInput === '' ? 0 : parseInt(countInput, 10)
    const newCounts = { ...counts, [value]: count }
    setCounts(newCounts)
    
    const total = Object.entries(newCounts).reduce((acc, [val, cnt]) => {
      return acc + Number(val) * cnt
    }, 0)
    
    onTotalChange(total)
  }

  const renderDenominationRow = (denom: Denomination) => {
    const countValue = counts[denom.value]
    const countDisplay = countValue === undefined || countValue === 0 ? '' : countValue.toString()
    const subtotal = denom.value * (countValue || 0)

    return (
      <Flex key={denom.value} align="center" justify="space-between" py={1}>
        <Text fontWeight="medium" w="80px">{denom.label}</Text>
        <Box w="80px">
          <Input
            type="number"
            value={countDisplay}
            onChange={(e) => handleCountChange(denom.value, e.target.value)}
            placeholder="0"
            size="sm"
            onFocus={(e) => e.target.select()}
          />
        </Box>
        <Text w="120px" textAlign="right" color="fg.muted" fontSize="sm">
          = R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </Flex>
    )
  }

  return (
    <Box bg="bg.subtle" p={5} rounded="md" border="1px solid" borderColor="border">
      <Heading size="sm" mb={4}>Calculadora de Notas e Moedas</Heading>
      <Stack gap={3}>
        <Box>
          <Text fontWeight="bold" fontSize="xs" color="blue.500" mb={1} textTransform="uppercase">Cédulas</Text>
          {DENOMINATIONS.filter(d => d.type === 'note').map(renderDenominationRow)}
        </Box>
        <Box pt={2} borderTop="1px solid" borderColor="border">
          <Text fontWeight="bold" fontSize="xs" color="orange.500" mb={1} textTransform="uppercase">Moedas</Text>
          {DENOMINATIONS.filter(d => d.type === 'coin').map(renderDenominationRow)}
        </Box>
      </Stack>
    </Box>
  )
}
