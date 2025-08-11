import { SearchResult, TransactionResult, AddressResult, BlockResult, TokenResult } from "./interface";

// API functions - now calling local API routes
export const fetchTransactionData = async (txHash: string): Promise<TransactionResult | null> => {
  try {
    const response = await fetch(`/api/transaction/${txHash}`);
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
};

export const fetchAddressData = async (address: string, ethPrice: number): Promise<AddressResult | null> => {
  try {
    const response = await fetch(`/api/address/${address}`);
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};

export const fetchBlockData = async (blockNumber: string): Promise<BlockResult | null> => {
  try {
    const response = await fetch(`/api/block/${blockNumber}`);
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching block:", error);
    return null;
  }
};

export const fetchTokenData = async (tokenAddress: string): Promise<TokenResult | null> => {
  try {
    const response = await fetch(`/api/token/${tokenAddress}`);
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

// Keep these as they call external APIs directly
export const fetchEthPrice = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
  const data = await response.json();
  return {
    price: data.ethereum?.usd || 4280.06,
    change: data.ethereum?.usd_24h_change || 2.27
  };
};

export const fetchGasPrice = async () => {
  const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
  const data = await response.json();
  return data.status === "1" && data.result?.SafeLow ? parseInt(data.result.SafeLow) : 25;
};
