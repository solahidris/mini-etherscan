import { FaEthereum, FaGasPump } from "react-icons/fa";

interface HeaderProps {
    ethPriceData: { price: number; change: number } | undefined;
    gasPriceData: number | undefined;
}

const Header = ({ ethPriceData, gasPriceData }: HeaderProps) => {
    return (
        <div className="flex flex-wrap gap-4 justify-between items-center z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
    )
};

export default Header;