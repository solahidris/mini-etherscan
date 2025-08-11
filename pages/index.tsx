import { FaEthereum, FaGasPump } from "react-icons/fa";


const Homepage = () => {

  // const primaryColor = "#21325b"
  // const secondaryColor = "#979695"
  // const tertiaryColor = "#f5f5f5"
  // const primaryBg = `bg-[#21325b]`
  // const secondaryBg = `bg-[#979695]`
  const tertiaryBg = `bg-[#f5f5f5]`
  const primaryBorder = `border-[#21325b]`
  // const secondaryBorder = `border-[#979695]`
  // const tertiaryBorder = `border-[#f5f5f5]`

  const ethPrice = 4280.06;
  const ethPriceChange = 2.27;
  const gasPrice = 0.55;

  return (
    <div className={`flex flex-col h-screen justify-center w-full p-4 ${tertiaryBg}`}>
      <div className={`w-full max-w-3xl h-80 border border-2 rounded-3xl mx-auto p-4 ${primaryBorder}`}>
        {/* Header */}
        <div className="flex justify-between items-center">
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
        <div className="flex justify-center items-center h-full -mt-6">
          <p>need to figure out what content to put here</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;