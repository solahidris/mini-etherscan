import Link from "next/link";
import { useState } from "react";
import { FaEthereum, FaGasPump } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


const Homepage = () => {

  const [isDetailPage, setIsDetailPage] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const primaryBg = `bg-[#21325b]`
  const tertiaryBg = `bg-[#f5f5f5]`
  const primaryBorder = `border-[#21325b]`

  // const primaryColor = "#21325b"
  // const secondaryColor = "#979695"
  // const tertiaryColor = "#f5f5f5"
  // const secondaryBg = `bg-[#979695]`
  // const secondaryBorder = `border-[#979695]`
  // const tertiaryBorder = `border-[#f5f5f5]`

  const chainName = "Ethereum Mainnet"
  const chainId = "1"

  const sampleWalletAddress = "0x791cbCA9ACF24ff042d85422118043891E5F183A";
  const sampleBlock = "23117430";
  const sampleTransactionHash = "0xc1866a9e00b6a2ac8a075657e92b6c8775ef32f8b55b4109082d3cd6c3806a87";
  const sampleToken = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT

  const ethPrice = 4280.06;
  const ethPriceChange = 2.27;
  const gasPrice = 0.55;


  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  }

  return (
    <div className={`flex flex-col h-screen justify-center w-full p-4 bg-gradient-to-br from-[#21325b]/70 via-white/70 to-[#979695]/70`}>
      <p className="text-center font-mono font-semibold text-xl pb-8 text-[#21325b]/90">mini-Etherscan</p>
      <div className={`w-full max-w-2xl h-auto flex flex-col border border-gray-300 shadow-xl rounded-3xl mx-auto p-6 lg:p-8 ${primaryBorder} relative`}>
        <div className={`absolute inset-0 opacity-100 rounded-3xl z-0 ${tertiaryBg}`}/>
        {/* Header */}
        <div className="flex flex-wrap gap-4 justify-between items-center z-10">
          <img src='/images/logo-etherscan.svg' alt='Etherscan' className='w-auto h-10' />
          <div className="flex gap-8 pr-2">
            <div className="flex">
              <div className="flex gap-1 items-center">
                <FaEthereum />
                <p>${ethPrice}</p>
              </div>
              <p className={`${ethPriceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>{`(${ethPriceChange > 0 ? '+' : ''}${ethPriceChange}%)`}</p>
            </div>

            <div className="flex gap-1 items-center">
              <FaGasPump />
              <p>{gasPrice} Gwei</p>
            </div>

          </div>
        </div>

        {/* Content */}
        {isDetailPage ? (
          <div className="flex justify-center items-center h-full z-10">
            <p>detail content</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 h-full justify-between z-10">
            <div className="flex gap-2 justify-center items-center relative h-full py-10 lg:py-16">
              <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" placeholder="Search by address, tx hash, or block" className={`w-full p-2 rounded-md border border-gray-300 ${isSearching ? "bg-gray-200 text-gray-400" : "bg-white"}`} />
              {searchValue && !isSearching && <button onClick={()=>setSearchValue("")} className="text-gray-400 absolute right-28 mr-1 cursor-pointer"><IoClose className={`h-6 w-6 ${tertiaryBg}`} /></button>}
              <button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-semibold text-white p-2 px-6 rounded-md">
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm mb-1">Sample Values</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <button disabled={isSearching} onClick={() => setSearchValue(sampleTransactionHash)} className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}>Txn Hash</button>
                <button disabled={isSearching} onClick={() => setSearchValue(sampleWalletAddress)} className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}>Address</button>
                <button disabled={isSearching} onClick={() => setSearchValue(sampleBlock)} className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}>Block</button>
                <button disabled={isSearching} onClick={() => setSearchValue(sampleToken)} className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}>Token</button>
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


// // DOCS
// If you're starting with V2
// Run this complete script with Node JS, node script.js

// Copy
// async function main() {

//     // query ETH balances on Arbitrum, Base and Optimism

//     const chains = [42161, 8453, 10]

//     for (const chain of chains) {

//         // endpoint accepts one chain at a time, loop for all your chains
   
//         const query = await fetch(`https://api.etherscan.io/v2/api
//            ?chainid=${chain}
//            &module=account
//            &action=balance
//            &address=0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511
//            &tag=latest&apikey=YourApiKeyToken`)
           
//         const response = await query.json()

//         const balance = response.result
//         console.log(balance)

//     }
// }

// main()