import { create } from "zustand";
import { SearchResult } from "./interface";

interface AppState {
  // State
  isDetailPage: boolean;
  searchValue: string;
  results: SearchResult | null;
  error: string;
  
  // Actions
  setIsDetailPage: (value: boolean) => void;
  setSearchValue: (value: string) => void;
  setResults: (results: SearchResult | null) => void;
  setError: (error: string) => void;
  clearError: () => void;
  resetSearch: () => void;
  
  // Search actions
  handleClearSearch: () => void;
  handleSampleClick: (value: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isDetailPage: false,
  searchValue: "",
  results: null,
  error: "",
  
  // Actions
  setIsDetailPage: (value) => set({ isDetailPage: value }),
  setSearchValue: (value) => set({ searchValue: value }),
  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: "" }),
  resetSearch: () => set({ 
    isDetailPage: false, 
    results: null, 
    error: "" 
  }),
  
  // Search actions
  handleClearSearch: () => {
    const { setSearchValue, clearError } = get();
    setSearchValue("");
    clearError();
  },
  
  handleSampleClick: (value: string) => {
    const { setSearchValue, clearError } = get();
    setSearchValue(value);
    clearError();
  }
}));