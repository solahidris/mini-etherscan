// Define types for the search results
export interface TransactionResult {
    type: "txnHash";
    txnHash: string;
    status: string;
    block: number;
    timestamp: string;
    from: string;
    to: string;
    value: string;
    gasUsed: string;
    gasPrice: string;
}

export interface AddressResult {
    type: "address";
    ethBalance: string;
    ethValue: number;
    ethPrice: number;
    latest: string;
    first: string;
    address: string;
}

export interface BlockResult {
    type: "block";
    blockHeight: number;
    status: string;
    timestamp: string;
    proposedOn: string;
    transactions: string;
    withdrawals: string;
    miner: string;
    gasUsed: string;
    gasLimit: string;
}

export interface TokenResult {
    type: "token";
    maxTotalSupply: string;
    holders: number;
    totalTransfers: string;
    price: number;
    onchainMarketCap: number;
    circulatingSupplyMarketCap: number;
    contractAddress: string;
    tokenName: string;
    tokenSymbol: string;
}

export type SearchResult = TransactionResult | AddressResult | BlockResult | TokenResult;
