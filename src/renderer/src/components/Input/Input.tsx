import {
  Box,
  Field,
  Input as ChakraInput,
  defineStyle,
  type InputProps as ChakraInputProps
} from '@chakra-ui/react'
import React from 'react'
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

export interface CustomInputProps extends ChakraInputProps {
  label?: string
  error?: string
  width?: string
}

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, width, ...props }, ref) => {
    const { mb, ...rest } = props as any
    return (
      <Field.Root w={width || 'full'} invalid={!!error} mb={mb}>
        <Box className={style['chakra-input-container']} pos="relative" w={width || 'full'}>
          <ChakraInput
            ref={ref}
            className={style['chakra-input']}
            color="fg"
            placeholder={props.placeholder || ''}
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

Input.displayName = 'Input'
