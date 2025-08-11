import Link from "next/link";
import { useEffect } from "react";
import { useAppStore } from "../utils/appStore";
import { tertiaryBg, primaryBorder } from "../utils/constant";
import { useEthPrice, useGasPrice, useSearch } from "../utils/hooks";
import Header from "../components/Header";
import InputSection from "@/components/InputSection";
import ResultsSection from "@/components/ResultsSection";

const Homepage = () => {
  // Get state and actions from Zustand
  const {
    isDetailPage,
    searchValue,
    results,
    error,
    setIsDetailPage,
    setResults,
    setError,
    clearError,
    resetSearch,
  } = useAppStore();

  // Live data queries using custom hooks
  const { data: ethPriceData } = useEthPrice();
  const { data: gasPriceData } = useGasPrice();

  // Search query using custom hook
  const { isLoading: isSearching, error: searchError, refetch: refetchSearch } = useSearch(
    searchValue,
    (result) => {
      setResults(result);
      setIsDetailPage(true);
    }
  );

  const handleSearch = async (): Promise<void> => {
    if (!searchValue.trim()) return;

    clearError();
    // Trigger the search query
    refetchSearch();
  };

  const handleBackToSearch = (): void => {
    resetSearch();
  }

  // Handle search errors
  useEffect(() => {
    if (searchError) {
      setError(searchError.message || "An error occurred while searching. Please try again.");
    }
  }, [searchError, setError]);

  return (
    <div className={`flex flex-col h-[100vh] justify-center w-full p-4 bg-gradient-to-br from-[#21325b]/70 via-white/70 to-[#979695]/70`}>
      <p className="text-center font-mono font-semibold text-xl pb-8 text-[#21325b]/90">mini--Etherscan</p>
      <div className={`w-full max-w-2xl h-auto flex flex-col border border-gray-300 shadow-xl rounded-3xl mx-auto p-6 lg:p-8 ${primaryBorder} relative`}>
        <div className={`absolute inset-0 opacity-100 rounded-3xl z-0 ${tertiaryBg}`} />
          {/* Header */}
          <Header ethPriceData={ethPriceData} gasPriceData={gasPriceData} />

          {/* Content */}
          {isDetailPage ? (
            <ResultsSection
              results={results!}
              error={error}
              onBackToSearch={handleBackToSearch}
            />
          ) : (
            <InputSection onSearch={handleSearch} isSearching={isSearching} />
          )}
        </div>
        <p className="text-center font-mono text-xs pt-8 text-[#21325b]/90">Fan build. Not affiliated in any way with <Link href="https://etherscan.io" target="_blank" className="text-sky-500 underline">Etherscan.</Link></p>
    </div>
  );
};

export default Homepage;