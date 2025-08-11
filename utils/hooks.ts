import { useQuery } from "@tanstack/react-query";
import { fetchEthPrice, fetchGasPrice, fetchTransactionData, fetchAddressData, fetchBlockData, fetchTokenData } from "./api";
import { SearchResult } from "./interface";

// Custom hook for ETH price
export const useEthPrice = () => {
  return useQuery({
    queryKey: ['ethPrice'],
    queryFn: fetchEthPrice,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000, // Consider data fresh for 25 seconds
  });
};

// Custom hook for gas price
export const useGasPrice = () => {
  return useQuery({
    queryKey: ['gasPrice'],
    queryFn: fetchGasPrice,
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

// Custom hook for search
export const useSearch = (searchValue: string, onSuccess: (result: SearchResult) => void) => {
  return useQuery({
    queryKey: ['search', searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return null;

      let result: SearchResult | null = null;

      // Determine search type and fetch data
      if (searchValue.startsWith("0x") && searchValue.length === 66) {
        result = await fetchTransactionData(searchValue);
      } else if (searchValue.startsWith("0x") && searchValue.length === 42) {
        // Try address first, then token
        result = await fetchAddressData(searchValue, 4280.06); // Default price, will be updated
        if (!result) {
          result = await fetchTokenData(searchValue);
        }
      } else if (/^\d+$/.test(searchValue)) {
        result = await fetchBlockData(searchValue);
      }

      if (result) {
        onSuccess(result);
        return result;
      } else {
        throw new Error("No results found. Please check your input and try again.");
      }
    },
    enabled: false, // Don't auto-fetch, only when manually triggered
    retry: 1,
    retryDelay: 1000,
  });
};
