import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import Tokens from "../tokensList/components/Tokens";
import { TokenInterface } from "../tokensList/components/Token";
import { useAppSelector } from "../../utils/reducer";
import { wagmiConfig } from "../../context/Web3Provider";
import { SectionCheckbox } from "../filter/Filter";
import { COLLECTION_TOKEN_ABI } from "../tokensList/constants/abi";

export default function Market() {
    const [tokens, setTokens] = useState<TokenInterface[]>([]);
    const { address } = useAccount();
    const filterState = useAppSelector((state) => state.filter);

    useEffect(() => {
        const fetchTokens = async () => {
            let newTokens = await readContract(wagmiConfig, {
                address: import.meta.env.VITE_PUBLIC_ITEMS_CONTRACT_ADDRESS as Address,
                abi: COLLECTION_TOKEN_ABI,
                functionName: 'getFilteredItems',
                args: [false, Object.values(filterState.sections.map((item: SectionCheckbox) => item.name as Address))]
            });
            console.log("newTokens", newTokens);
            // sections filter
            newTokens = newTokens?.filter((item) => Number(item.id) !== 0);

            // my NFT filter
            if (address !== undefined && filterState.myNFT) {
                newTokens = newTokens?.filter((item) => item.owner === address)
            } else {
                newTokens = newTokens?.filter((item) => Number(item.salePrice) !== 0 || item.owner === address)
            }

            setTokens(newTokens as unknown as TokenInterface[]);
        }

        fetchTokens();
    }, [filterState]);

    return <>
        <div className={"grid grid-cols-5 gap-2 max-lg:grid-cols-4 max-sm:grid-cols-2"}>
            <Tokens tokens={tokens} />
        </div>
    </>
}