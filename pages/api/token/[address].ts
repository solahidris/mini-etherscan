import type { NextApiRequest, NextApiResponse } from "next";
import { TokenResult } from "../../../utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResult | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Token address is required" });
  }

  try {
    const response = await fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
    const data = await response.json();

    if (data.status === "1") {
      // For demo purposes, using USDT-like data
      const result: TokenResult = {
        type: "token",
        maxTotalSupply: "79,787,363,485.590599 USDT",
        holders: 8329323,
        totalTransfers: "More than 325,712,095",
        price: 1.00,
        onchainMarketCap: 79758640034.74,
        circulatingSupplyMarketCap: 164479569313.00,
        contractAddress: address,
        tokenName: "Tether USD",
        tokenSymbol: "USDT"
      };

      return res.status(200).json(result);
    }
    
    return res.status(404).json({ error: "Token not found" });
  } catch (error) {
    console.error("Error fetching token:", error);
    return res.status(500).json({ error: "Failed to fetch token data" });
  }
}
