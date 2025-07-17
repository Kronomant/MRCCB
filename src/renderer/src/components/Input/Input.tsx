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
}

export const Input: React.FC<CustomInputProps> = ({ label, ...props }) => {
  return (
    <Field.Root>
      <Box pos="relative" w="full">
        <ChakraInput className="peer" color="fg" placeholder={props.placeholder || ''} {...props} />
        <Field.Label {...floatingStyles}>{label}</Field.Label>
      </Box>
    </Field.Root>
  )
}
