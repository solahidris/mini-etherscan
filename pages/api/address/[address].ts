import type { NextApiRequest, NextApiResponse } from "next";
import { AddressResult } from "../../../utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressResult | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    // Get ETH price first
    const ethPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const ethPriceData = await ethPriceResponse.json();
    const ethPrice = ethPriceData.ethereum?.usd || 4280.06;

    const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
    const data = await response.json();

    if (data.status === "1") {
      const balance = data.result;
      const ethValue = (parseInt(balance) / Math.pow(10, 18)) * ethPrice;

      const result: AddressResult = {
        type: "address",
        ethBalance: (parseInt(balance) / Math.pow(10, 18)).toString(),
        ethValue: parseFloat(ethValue.toFixed(2)),
        ethPrice: ethPrice,
        latest: "Recent",
        first: "Unknown",
        address: address
      };

      return res.status(200).json(result);
    }
    
    return res.status(404).json({ error: "Address not found" });
  } catch (error) {
    console.error("Error fetching address:", error);
    return res.status(500).json({ error: "Failed to fetch address data" });
  }
}