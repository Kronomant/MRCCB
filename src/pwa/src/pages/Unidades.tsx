import { Box, Heading, Text, Spinner, VStack, Card, Flex } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function Unidades() {
  const { data: unidades, isLoading } = useQuery({
    queryKey: ['unities'],
    queryFn: () => api.unities.list()
  })

  return (
    <Box p={4}>
      <Heading size="md" mb={4} color="blue.700">
        Unidades
      </Heading>

      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner color="blue.500" />
        </Flex>
      )}

      <VStack gap={2} align="stretch">
        {(unidades ?? []).map((u) => (
          <Card.Root key={u.id} bg="white" shadow="sm" borderWidth="1px">
            <Card.Body p={3}>
              <Text fontWeight="medium" fontSize="sm">{u.name}</Text>
            </Card.Body>
          </Card.Root>
        ))}

        {!isLoading && (unidades ?? []).length === 0 && (
          <Text color="gray.400" textAlign="center" py={8}>
            Nenhuma unidade cadastrada
          </Text>
        )}
      </VStack>
    </Box>
  )
}
