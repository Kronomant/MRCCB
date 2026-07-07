import { Portal, Select as ChakraSelect, createListCollection } from '@chakra-ui/react'

interface ISelect {
  options: {
    label: string
    value: string
  }[]
  placeholder: string
  value: string
  onChange: (value: string) => void
  label?: string
}

export const Select: React.FC<ISelect> = ({ options, placeholder, value, onChange, label }) => {
  return (
    <ChakraSelect.Root
      collection={createListCollection({ items: [...options] })}
      size="sm"
      width="100%"
      value={[value]}
      onValueChange={(d) => onChange(d.value[0])}
    >
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Label>{label}</ChakraSelect.Label>
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText placeholder={placeholder} />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content>
            {options.map((framework) => (
              <ChakraSelect.Item key={framework.value} item={framework}>
                {framework.label}
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  )
}
