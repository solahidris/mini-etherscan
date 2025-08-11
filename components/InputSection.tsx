import { IoClose } from "react-icons/io5";
import { useAppStore } from "../utils/appStore";
import { primaryBg, sampleAddress, sampleBlock, sampleToken, sampleTxnHash } from "../utils/constant";

interface InputSectionProps {
  onSearch: () => void;
  isSearching: boolean;
}

const InputSection = ({ onSearch, isSearching }: InputSectionProps) => {
    // Get state and actions directly from Zustand
    const { 
        searchValue, 
        error, 
        handleClearSearch,
        handleSampleClick
    } = useAppStore();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            onSearch();
        }
    }

    return (
        <div className="flex flex-col gap-2 h-full justify-between z-10">
            <div className="flex gap-2 justify-center items-center relative h-full py-10 lg:py-16">
                <input
                    value={searchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => useAppStore.getState().setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Search by address, tx hash, or block"
                    className={`w-full p-2 rounded-md border border-gray-300 ${isSearching ? "bg-gray-200 text-gray-400" : "bg-white"}`}
                />
                {searchValue && !isSearching && (
                    <button onClick={handleClearSearch} className="text-gray-400 absolute right-28 mr-1 cursor-pointer bg-white">
                        <IoClose className="h-6 w-6" />
                    </button>
                )}
                <button onClick={onSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-semibold text-white p-2 px-6 rounded-md">
                    {isSearching ? "Searching..." : "Search"}
                </button>
            </div>
            {error && (
                <div className="text-red-600 text-center p-2 bg-red-100 rounded-md">
                    {error}
                </div>
            )}
            <div className="flex flex-col">
                <p className="text-gray-500 text-sm mb-1">Sample Values</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <button
                        onClick={() => handleSampleClick(sampleTxnHash)}
                        className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                    >
                        Txn Hash
                    </button>
                    <button
                        onClick={() => handleSampleClick(sampleAddress)}
                        className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                    >
                        Address
                    </button>
                    <button
                        onClick={() => handleSampleClick(sampleBlock)}
                        className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                    >
                        Block
                    </button>
                    <button
                        onClick={() => handleSampleClick(sampleToken)}
                        className={`${primaryBg} hover:bg-[#21325b]/90 cursor-pointer font-semibold text-white p-2 px-6 rounded-md`}
                    >
                        Token
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InputSection;