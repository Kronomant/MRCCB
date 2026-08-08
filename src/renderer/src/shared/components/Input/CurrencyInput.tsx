import {
  Box,
  Field,
  Input as ChakraInput,
  defineStyle,
  type InputProps as ChakraInputProps
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import style from './input.module.scss'

const floatingStyles = defineStyle({
  pos: 'absolute',
  bg: 'bg',
  px: '0.5',
  top: '-3',
  insetStart: '2',
  color: 'fg.muted',
  fontWeight: 'normal',
  pointerEvents: 'none',
  transition: 'position',
  _peerPlaceholderShown: {
    color: 'fg.muted',
    top: '2.5',
    insetStart: '3'
  },
  _peerFocusVisible: {
    color: 'fg',
    top: '-3',
    insetStart: '2'
  }
})

export interface CurrencyInputProps extends Omit<ChakraInputProps, 'onChange' | 'value'> {
  label?: string
  error?: string
  width?: string
  value?: number
  onChange?: (value: number) => void
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, width, value, onChange, ...props }, ref) => {
    const { mb, ...rest } = props as any
    const [displayValue, setDisplayValue] = useState('')

    const formatCurrency = (val: number | string) => {
      const numberValue = typeof val === 'string' ? parseFloat(val.replace(/\D/g, '')) / 100 : val
      if (isNaN(numberValue)) return ''
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numberValue)
    }

    useEffect(() => {
      if (value !== undefined) {
        const formatted = formatCurrency(value)
        if (formatted !== displayValue) {
          setDisplayValue(formatted)
        }
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '')
      const numberValue = parseFloat(rawValue) / 100
      
      if (!isNaN(numberValue)) {
        setDisplayValue(formatCurrency(numberValue))
        onChange?.(numberValue)
      } else {
        setDisplayValue('')
        onChange?.(0)
      }
    }

    return (
      <Field.Root w={width || 'full'} invalid={!!error} mb={mb}>
        <Box className={style['chakra-input-container']} pos="relative" w={width || 'full'}>
          <ChakraInput
            ref={ref}
            className={style['chakra-input']}
            color="fg"
            placeholder={props.placeholder || 'R$ 0,00'}
            value={displayValue}
            onChange={handleChange}
            {...rest}
          />
          <Field.Label {...floatingStyles}>{label}</Field.Label>
          {error && (
            <Field.ErrorText color="red.500" fontSize="sm" mt="0.5">
              {error}
            </Field.ErrorText>
          )}
        </Box>
      </Field.Root>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'
