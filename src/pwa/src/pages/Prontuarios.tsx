import { Box, Heading, Text, Badge, Spinner, Input, VStack, Card, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { useProntuarios } from '../hooks/useProntuarios'

export function Prontuarios() {
  const [search, setSearch] = useState('')
  const { data: prontuarios, isLoading } = useProntuarios()

  const filtered = (prontuarios ?? []).filter(
    (p) =>
      String(p.number).includes(search) ||
      String(p.unityId).includes(search)
  )

  return (
    <Box p={4}>
      <Heading size="md" mb={4} color="blue.700">
        Prontuários
      </Heading>

      <Input
        placeholder="Buscar por número..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        bg="white"
        mb={4}
        size="sm"
      />

      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner color="blue.500" />
        </Flex>
      )}

      <VStack gap={2} align="stretch">
        {filtered.map((p) => (
          <Card.Root key={p.id} bg="white" shadow="sm" borderWidth="1px">
            <Card.Body p={3}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="semibold" fontSize="sm">
                    Prontuário #{p.number}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Unidade ID: {p.unityId} · Ministério: {p.ministry}
                  </Text>
                </Box>
                <Badge
                  colorPalette={p.status === 'active' ? 'green' : 'gray'}
                  size="sm"
                >
                  {p.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}

        {!isLoading && filtered.length === 0 && (
          <Text color="gray.400" textAlign="center" py={8}>
            Nenhum prontuário encontrado
          </Text>
        )}
      </VStack>
    </Box>
  )
}
