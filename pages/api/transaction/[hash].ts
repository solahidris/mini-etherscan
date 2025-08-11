import type { NextApiRequest, NextApiResponse } from "next";
import { TransactionResult } from "../../../utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransactionResult | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hash } = req.query;
  if (!hash || typeof hash !== "string") {
    return res.status(400).json({ error: "Transaction hash is required" });
  }

  try {
    const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
    const data = await response.json();

    if (data.result) {
      const tx = data.result;
      // Get transaction receipt for status
      const receiptResponse = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);
      const receiptData = await receiptResponse.json();

      const result: TransactionResult = {
        type: "txnHash",
        txnHash: hash,
        status: receiptData.result?.status === "0x1" ? "Success" : "Failed",
        block: parseInt(tx.blockNumber, 16),
        timestamp: "Recent",
        from: tx.from,
        to: tx.to,
        value: (parseInt(tx.value, 16) / Math.pow(10, 18)).toString(),
        gasUsed: receiptData.result?.gasUsed || "0",
        gasPrice: (parseInt(tx.gasPrice, 16) / Math.pow(10, 9)).toString()
      };

      return res.status(200).json(result);
    }
    
    return res.status(404).json({ error: "Transaction not found" });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({ error: "Failed to fetch transaction data" });
  }
}