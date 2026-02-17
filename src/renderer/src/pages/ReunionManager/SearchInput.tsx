import React from 'react'
import { InputGroup, Input, Icon, Spinner, Box, Text } from '@chakra-ui/react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useSearch } from './useSearch'
import { SearchProps } from './types'

const SearchInput: React.FC<SearchProps> = ({
  onSearch,
  placeholder = 'Pesquisar reuniões...',
  debounceTime = 300,
  isLoading = false,
  className
}) => {
  const { query, isSearching, error, handleInputChange, clearSearch } = useSearch({
    debounceTime,
    onSearch
  })

  const showClearButton = query.length > 0
  const isProcessing = isSearching || isLoading

  return (
    <Box className={className} position="relative" width="100%">
      <Icon
        position="absolute"
        left="3"
        top="50%"
        transform="translateY(-50%)"
        color="gray.400"
        zIndex="1"
        aria-hidden="true"
      >
        <FiSearch size="16" />
      </Icon>

      <InputGroup width="100%">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          pl="10"
          pr={showClearButton ? '10' : '3'}
          borderRadius="3xl"
          borderColor="gray.300"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--blue-500)'
          }}
          aria-label="Pesquisar reuniões"
          aria-describedby={error ? 'search-error' : undefined}
          aria-busy={isProcessing}
        />
      </InputGroup>

      {showClearButton && (
        <Icon
          position="absolute"
          right="3"
          top="50%"
          transform="translateY(-50%)"
          color="gray.400"
          cursor="pointer"
          onClick={clearSearch}
          _hover={{ color: 'gray.600' }}
          aria-label="Limpar pesquisa"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              clearSearch()
            }
          }}
        >
          <FiX size="16" />
        </Icon>
      )}

      {isProcessing && (
        <Spinner
          position="absolute"
          right={showClearButton ? '10' : '3'}
          top="50%"
          transform="translateY(-50%)"
          size="sm"
          color="blue.500"
          aria-label="Pesquisando"
        />
      )}

      {error && (
        <Text
          id="search-error"
          color="red.500"
          fontSize="sm"
          mt="1"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Text>
      )}
    </Box>
  )
}

export default SearchInput
