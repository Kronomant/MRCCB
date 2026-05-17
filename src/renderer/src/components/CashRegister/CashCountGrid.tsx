import React, { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Flex,
  Grid,
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
  onCountsChange?: (counts: Record<number, number>) => void
  initialCounts?: Record<number, number> | null
}

export const CashCountGrid: React.FC<CashCountGridProps> = ({ onTotalChange, onCountsChange, initialCounts }) => {
  const [counts, setCounts] = useState<Record<number, number>>(initialCounts ?? {})

  useEffect(() => {
    if (initialCounts && Object.keys(initialCounts).length > 0) {
      setCounts(initialCounts)
      const total = Object.entries(initialCounts).reduce((acc, [val, cnt]) => acc + Number(val) * cnt, 0)
      onTotalChange(total)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCountChange = (value: number, countInput: string) => {
    const count = countInput === '' ? 0 : parseInt(countInput, 10)
    const newCounts = { ...counts, [value]: count }
    setCounts(newCounts)

    const total = Object.entries(newCounts).reduce((acc, [val, cnt]) => {
      return acc + Number(val) * cnt
    }, 0)

    onTotalChange(total)
    onCountsChange?.(newCounts)
  }

  const renderDenominationRow = (denom: Denomination) => {
    const countValue = counts[denom.value]
    const countDisplay = countValue === undefined || countValue === 0 ? '' : countValue.toString()
    const subtotal = denom.value * (countValue || 0)

    return (
      <Flex key={denom.value} align="center" gap={1.5} py="1px">
        <Text fontWeight="medium" fontSize="xs" w="50px" flexShrink={0}>{denom.label}</Text>
        <Box w="52px" flexShrink={0}>
          <Input
            type="number"
            value={countDisplay}
            onChange={(e) => handleCountChange(denom.value, e.target.value)}
            placeholder="0"
            size="xs"
            onFocus={(e) => e.target.select()}
          />
        </Box>
        <Text flex="1" textAlign="right" color={subtotal > 0 ? 'fg' : 'fg.subtle'} fontSize="xs" fontVariantNumeric="tabular-nums">
          {subtotal > 0
            ? subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '—'}
        </Text>
      </Flex>
    )
  }

  const notes = DENOMINATIONS.filter(d => d.type === 'note')
  const coins = DENOMINATIONS.filter(d => d.type === 'coin')

  return (
    <Box bg="bg.subtle" px={3} py={2} rounded="md" border="1px solid" borderColor="border">
      <Text fontWeight="bold" fontSize="xs" color="fg.muted" mb={1.5} textTransform="uppercase" letterSpacing="wide">
        Notas e Moedas
      </Text>
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box>
          <Text fontWeight="bold" fontSize="2xs" color="blue.500" mb={1} textTransform="uppercase" letterSpacing="wide">
            Cédulas
          </Text>
          {notes.map(renderDenominationRow)}
        </Box>
        <Box borderLeft="1px solid" borderColor="border" pl={3}>
          <Text fontWeight="bold" fontSize="2xs" color="orange.500" mb={1} textTransform="uppercase" letterSpacing="wide">
            Moedas
          </Text>
          {coins.map(renderDenominationRow)}
        </Box>
      </Grid>
    </Box>
  )
}
