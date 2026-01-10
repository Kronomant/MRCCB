import { useState, useCallback, useRef } from 'react';
import { UseSearchOptions, SearchState } from './types';

export function useSearch({ debounceTime = 300, onSearch }: UseSearchOptions) {
  const [state, setState] = useState<SearchState>({
    query: '',
    isSearching: false,
    hasResults: false,
    error: null
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((query: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({ ...prev, query, isSearching: true }));

    timeoutRef.current = setTimeout(() => {
      try {
        onSearch(query);
        setState(prev => ({ ...prev, isSearching: false, hasResults: true }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isSearching: false, 
          error: error instanceof Error ? error.message : 'Erro na pesquisa' 
        }));
      }
    }, debounceTime);
  }, [debounceTime, onSearch]);

  const clearSearch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setState({
      query: '',
      isSearching: false,
      hasResults: false,
      error: null
    });
    
    onSearch('');
  }, [onSearch]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    ...state,
    handleInputChange,
    clearSearch
  };
}