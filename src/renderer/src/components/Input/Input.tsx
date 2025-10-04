import {
  Box,
  Field,
  Input as ChakraInput,
  defineStyle,
  type InputProps as ChakraInputProps
} from '@chakra-ui/react'
import React from 'react'

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
}

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <Field.Root invalid={!!error}>
        <Box pos="relative" w="full">
          <ChakraInput 
            ref={ref}
            className="peer" 
            color="fg" 
            placeholder={props.placeholder || ''} 
            {...props} 
          />
          <Field.Label {...floatingStyles}>{label}</Field.Label>
        </Box>
        {error && (
          <Field.ErrorText color="red.500" fontSize="sm" mt={1}>
            {error}
          </Field.ErrorText>
        )}
      </Field.Root>
    )
  }
)

Input.displayName = 'Input'
