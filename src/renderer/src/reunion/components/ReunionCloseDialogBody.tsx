import { Box, Flex, Stack, Text } from '@chakra-ui/react'

type Summary = {
  totalGasto: number
  cestas: number
  atendimentos: number
}

interface ReunionCloseDialogBodyProps {
  summary: Summary
  reunion: Reunion | undefined
}

export const ReunionCloseDialogBody = ({ summary, reunion }: ReunionCloseDialogBodyProps) => {
  const basketTotal = summary.cestas * (reunion?.basketValue || 0)
  const grandTotal = summary.totalGasto + basketTotal

  const formatBRL = (value: number) =>
    value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  return (
    <Stack gap={4}>
      <Text fontSize="md" mb={2}>
        Você está prestes a encerrar esta reunião. Confira os dados:
      </Text>

      <Box bg="bg.subtle" p={4} rounded="md">
        <Stack gap={2}>
          <Flex justify="space-between">
            <Text fontWeight="semibold">Valor Total (Atendimentos + Cestas):</Text>
            <Text>R$ {formatBRL(grandTotal)}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="semibold">Valor Atendimentos:</Text>
            <Text>R$ {formatBRL(summary.totalGasto)}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="semibold">Valor Cestas:</Text>
            <Text>R$ {formatBRL(basketTotal)}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="semibold">Cestas Associadas:</Text>
            <Text>{summary.cestas}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="semibold">Atendimentos Realizados:</Text>
            <Text>{summary.atendimentos}</Text>
          </Flex>
        </Stack>
      </Box>

      <Text fontSize="sm" color="fg.muted">
        Após encerrar, o status da reunião será alterado para "Encerrado".
      </Text>
    </Stack>
  )
}
