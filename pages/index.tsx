import Link from "next/link";
import { useState, useEffect } from "react";
import { FaEthereum, FaGasPump } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { SearchResult, TransactionResult, AddressResult, BlockResult, TokenResult } from "@/utils/interface";
import { primaryBg, tertiaryBg, primaryBorder, sampleTxnHash, sampleAddress, sampleBlock, sampleToken } from "@/constant/data";

const Homepage = () => {
  const [isDetailPage, setIsDetailPage] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string>("");

  // Live data queries
  const { data: ethPriceData } = useQuery({
    queryKey: ['ethPrice'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
      const data = await response.json();
      return {
        price: data.ethereum?.usd || 4280.06,
        change: data.ethereum?.usd_24h_change || 2.27
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000, // Consider data fresh for 25 seconds
  });

  const { data: gasPriceData } = useQuery({
    queryKey: ['gasPrice'],
    queryFn: async () => {
      const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const data = await response.json();
      return data.status === "1" && data.result?.SafeLow ? parseInt(data.result.SafeLow) : 25;
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });

  // Search query
  const { data: searchResults, isLoading: isSearching, error: searchError, refetch: refetchSearch } = useQuery({
    queryKey: ['search', searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return null;

      let result: SearchResult | null = null;

      // Determine search type and fetch data
      if (searchValue.startsWith("0x") && searchValue.length === 66) {
        result = await fetchTransactionData(searchValue);
      } else if (searchValue.startsWith("0x") && searchValue.length === 42) {
        // Try address first, then token
        result = await fetchAddressData(searchValue, ethPriceData?.price || 4280.06);
        if (!result) {
          result = await fetchTokenData(searchValue);
        }
      } else if (/^\d+$/.test(searchValue)) {
        result = await fetchBlockData(searchValue);
      }

      if (result) {
        setResults(result);
        setIsDetailPage(true);
        return result;
      } else {
        throw new Error("No results found. Please check your input and try again.");
      }
    },
    enabled: false, // Don't auto-fetch, only when manually triggered
    retry: 1,
    retryDelay: 1000,
  });

  // API functions
  const fetchTransactionData = async (txHash: string): Promise<TransactionResult | null> => {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const data = await response.json();

      if (data.result) {
        const tx = data.result;
        // Get transaction receipt for status
        const receiptResponse = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
        const receiptData = await receiptResponse.json();

        return {
          type: "txnHash",
          txnHash: txHash,
          status: receiptData.result?.status === "0x1" ? "Success" : "Failed",
          block: parseInt(tx.blockNumber, 16),
          timestamp: "Recent", // Would need block timestamp API call
          from: tx.from,
          to: tx.to,
          value: (parseInt(tx.value, 16) / Math.pow(10, 18)).toString(),
          gasUsed: receiptData.result?.gasUsed || "0",
          gasPrice: (parseInt(tx.gasPrice, 16) / Math.pow(10, 9)).toString()
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  };

  const fetchAddressData = async (address: string, ethPrice: number): Promise<AddressResult | null> => {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const data = await response.json();

      if (data.status === "1") {
        const balance = data.result;
        const ethValue = (parseInt(balance) / Math.pow(10, 18)) * ethPrice;

        return {
          type: "address",
          ethBalance: (parseInt(balance) / Math.pow(10, 18)).toString(),
          ethValue: parseFloat(ethValue.toFixed(2)),
          ethPrice: ethPrice,
          latest: "Recent",
          first: "Unknown",
          address: address
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  const fetchBlockData = async (blockNumber: string): Promise<BlockResult | null> => {
    try {
      // Convert block number to hex format for the API
      const hexBlockNumber = `0x${parseInt(blockNumber).toString(16)}`;

      const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${hexBlockNumber}&boolean=false&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const data = await response.json();

      console.log("Block API response:", data); // Debug log

      if (data.result && data.result.number) {
        const block = data.result;
        const timestamp = block.timestamp ? new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString() : "Unknown";

        return {
          type: "block",
          blockHeight: parseInt(blockNumber),
          status: "Finalized",
          timestamp: timestamp,
          proposedOn: `Block ${blockNumber}`,
          transactions: `${block.transactions?.length || 0} transactions in this block`,
          withdrawals: "0 withdrawals in this block",
          miner: block.miner || "Unknown",
          gasUsed: block.gasUsed ? parseInt(block.gasUsed, 16).toString() : "0",
          gasLimit: block.gasLimit ? parseInt(block.gasLimit, 16).toString() : "0"
        };
      } else {
        console.log("No block data found for:", blockNumber);
        return null;
      }
    } catch (error) {
      console.error("Error fetching block:", error);
      return null;
    }
  };

  const fetchTokenData = async (tokenAddress: string): Promise<TokenResult | null> => {
    try {
      // Get token info
      const response = await fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${tokenAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const data = await response.json();

      if (data.status === "1") {
        // For demo purposes, using USDT-like data
        return {
          type: "token",
          maxTotalSupply: "79,787,363,485.590599 USDT",
          holders: 8329323,
          totalTransfers: "More than 325,712,095",
          price: 1.00,
          onchainMarketCap: 79758640034.74,
          circulatingSupplyMarketCap: 164479569313.00,
          contractAddress: tokenAddress,
          tokenName: "Tether USD",
          tokenSymbol: "USDT"
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  const handleSearch = async (): Promise<void> => {
    if (!searchValue.trim()) return;
    
    setError("");
    // Trigger the search query
    refetchSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleClearSearch = (): void => {
    setSearchValue("");
    setError("");
  }

  const handleSampleClick = (value: string): void => {
    setSearchValue(value);
    setError("");
  }

  const handleBackToSearch = (): void => {
    setIsDetailPage(false);
    setResults(null);
    setError("");
  }

  // Handle search errors
  useEffect(() => {
    if (searchError) {
      setError(searchError.message || "An error occurred while searching. Please try again.");
    }
  }, [searchError]);

  return (
    <div className={`flex flex-col h-screen justify-center w-full p-4 bg-gradient-to-br from-[#21325b]/70 via-white/70 to-[#979695]/70`}>
      <p className="text-center font-mono font-semibold text-xl pb-8 text-[#21325b]/90">mini-Etherscan</p>
      <div className={`w-full max-w-2xl h-auto flex flex-col border border-gray-300 shadow-xl rounded-3xl mx-auto p-6 lg:p-8 ${primaryBorder} relative`}>
        <div className={`absolute inset-0 opacity-100 rounded-3xl z-0 ${tertiaryBg}`} />
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center z-10">
          <img src='/images/logo-etherscan.svg' alt='Etherscan' className='w-auto h-10' />
          <div className="flex gap-8 pr-2">
            <div className="flex">
              <div className="flex gap-1 items-center">
                <FaEthereum />
                <p>${ethPriceData?.price ? ethPriceData.price.toFixed(2) : "Loading..."}</p>
              </div>
              <p className={`${ethPriceData?.change && ethPriceData.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ethPriceData?.change !== undefined ? `(${ethPriceData.change > 0 ? '+' : ''}${ethPriceData.change.toFixed(2)}%)` : "Loading..."}
              </p>
            </div>

            <div className="flex gap-1 items-center">
              <FaGasPump />
              <p>{gasPriceData ? gasPriceData : 25} Gwei</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isDetailPage ? (
          <div className="flex justify-start h-full z-10 ">
            <div className="w-full flex-wrap flex flex-col pt-12">
              <p className="text-xl font-semibold mb-4">Search Results</p>
              {error && (
                <div className="text-red-600 mb-4 p-3 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              {results && (
                <div>
                  {/* Add Type field at the top for all result types */}
                  <div className="grid grid-cols-3 mb-4 bg-gray-100 rounded-md">
                    <span className="font-semibold">Type:</span>
                    <div className="col-span-2 font-medium capitalize">
                      <span className={`${primaryBg} text-white text-sm px-6 py-1 rounded-full`}>
                        {results.type === "txnHash" ? "Transaction" :
                          results.type === "address" ? "Address" :
                            results.type === "block" ? "Block" :
                              results.type === "token" ? "Token" : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {results.type === "txnHash" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Transaction Hash:</span>
                        <span className="col-span-2 break-all font-mono text-sm">{results.txnHash}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Status:</span>
                        <span className={`font-semibold ${results.status === "Success" ? "text-green-600" : "text-red-600"}`}>{results.status}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Block:</span>
                        <span className="col-span-2">{results.block}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">From:</span>
                        <span className="col-span-2 break-all font-mono text-sm">{results.from}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">To:</span>
                        <span className="col-span-2 break-all font-mono text-sm">{results.to}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Value:</span>
                        <span className="col-span-2">{results.value} ETH</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Gas Used:</span>
                        <span className="col-span-2">{results.gasUsed}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Gas Price:</span>
                        <span className="col-span-2">{results.gasPrice} Gwei</span>
                      </div>
                    </div>
                  )}
                  {results.type === "address" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Address:</span>
                        <span className="col-span-2 break-all font-mono text-sm">{results.address}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">ETH Balance:</span>
                        <span className="col-span-2">{results.ethBalance} ETH</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Value:</span>
                        <span className="col-span-2">${results.ethValue}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">ETH Price:</span>
                        <span className="col-span-2">${results.ethPrice}</span>
                      </div>
                    </div>
                  )}
                  {results.type === "block" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Block Height:</span>
                        <span className="col-span-2">{results.blockHeight}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Status:</span>
                        <span className="text-green-600 font-semibold">{results.status}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Timestamp:</span>
                        <span className="col-span-2">{results.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Miner:</span>
                        <span className="col-span-2 break-all font-mono text-sm">{results.miner}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Transactions:</span>
                        <span className="col-span-2">{results.transactions}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Gas Used:</span>
                        <span className="col-span-2">{results.gasUsed}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Gas Limit:</span>
                        <span className="col-span-2">{results.gasLimit}</span>
                      </div>
                    </div>
                  )}
                  {results.type === "token" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Contract:</span>
                        <span className="col-span-2 break-all font-mono text-sm">{results.contractAddress}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Name:</span>
                        <span className="col-span-2">{results.tokenName}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Symbol:</span>
                        <span className="col-span-2">{results.tokenSymbol}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Max Supply:</span>
                        <span className="col-span-2">{results.maxTotalSupply}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Holders:</span>
                        <span className="col-span-2">{results.holders.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Price:</span>
                        <span className="col-span-2">${results.price}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="font-semibold">Market Cap:</span>
                        <span className="col-span-2">${results.onchainMarketCap.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={handleBackToSearch}
                className="mt-16 bg-gray-600 hover:bg-gray-700 cursor-pointer font-semibold text-white p-2 px-6 rounded-md"
              >
                Back to Search
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 h-full justify-between z-10">
            <div className="flex gap-2 justify-center items-center relative h-full py-10 lg:py-16">
              <input
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Search by address, tx hash, or block"
                className={`w-full p-2 rounded-md border border-gray-300 ${isSearching ? "bg-gray-200 text-gray-400" : "bg-white"}`}
              />
              {searchValue && !isSearching && (
                <button onClick={handleClearSearch} className="text-gray-400 absolute right-28 mr-1 cursor-pointer">
                  <IoClose className={`h-6 w-6 ${tertiaryBg}`} />
                </button>
              )}
              <button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-semibold text-white p-2 px-6 rounded-md">
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
            {error && (
              <div className="text-red-600 text-center p-2 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm mb-1">Sample Values</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  disabled={isSearching}
                  onClick={() => handleSampleClick(sampleTxnHash)}
                  className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                >
                  Txn Hash
                </button>
                <button
                  disabled={isSearching}
                  onClick={() => handleSampleClick(sampleAddress)}
                  className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                >
                  Address
                </button>
                <button
                  disabled={isSearching}
                  onClick={() => handleSampleClick(sampleBlock)}
                  className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                >
                  Block
                </button>
                <button
                  disabled={isSearching}
                  onClick={() => handleSampleClick(sampleToken)}
                  className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                >
                  Token
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-center font-mono text-xs pt-8 text-[#21325b]/90">Fan build. Not affiliated in any way with <Link href="https://etherscan.io" target="_blank" className="text-sky-500 underline">Etherscan.</Link></p>
    </div>
  );
};

export default Homepage;