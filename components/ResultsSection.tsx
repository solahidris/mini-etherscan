import { SearchResult } from "../utils/interface";
import { primaryBg } from "../utils/constant";

interface ResultsSectionProps {
  results: SearchResult;
  error?: string;
  onBackToSearch: () => void;
}

const ResultsSection = ({ results, error, onBackToSearch }: ResultsSectionProps) => {
  return (
    <div className="flex justify-start h-full z-10">
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
          onClick={onBackToSearch}
          className="mt-16 bg-gray-600 hover:bg-gray-700 cursor-pointer font-semibold text-white p-2 px-6 rounded-md"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;
