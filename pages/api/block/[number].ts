import type { NextApiRequest, NextApiResponse } from "next";
import { BlockResult } from "../../../utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlockResult | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { number } = req.query;
  if (!number || typeof number !== "string") {
    return res.status(400).json({ error: "Block number is required" });
  }

  try {
    const hexBlockNumber = `0x${parseInt(number).toString(16)}`;

    const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${hexBlockNumber}&boolean=false&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
    const data = await response.json();

    if (data.result && data.result.number) {
      const block = data.result;
      const timestamp = block.timestamp ? new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString() : "Unknown";

      const result: BlockResult = {
        type: "block",
        blockHeight: parseInt(number),
        status: "Finalized",
        timestamp: timestamp,
        proposedOn: `Block ${number}`,
        transactions: `${block.transactions?.length || 0} transactions in this block`,
        withdrawals: "0 withdrawals in this block",
        miner: block.miner || "Unknown",
        gasUsed: block.gasUsed ? parseInt(block.gasUsed, 16).toString() : "0",
        gasLimit: block.gasLimit ? parseInt(block.gasLimit, 16).toString() : "0"
      };

      return res.status(200).json(result);
    }
    
    return res.status(404).json({ error: "Block not found" });
  } catch (error) {
    console.error("Error fetching block:", error);
    return res.status(500).json({ error: "Failed to fetch block data" });
  }
}
