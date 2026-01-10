export interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
  isLoading?: boolean;
  className?: string;
}

export interface UseSearchOptions {
  debounceTime?: number;
  onSearch: (query: string) => void;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  hasResults: boolean;
  error: string | null;
}