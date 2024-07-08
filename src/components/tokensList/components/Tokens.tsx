import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import Token, { TokenInterface } from "./Token";
import { PAYMENT_TOKEN_ABI } from "../constants/abi";
import { wagmiConfig } from "../../../context/Web3Provider";

interface TokensProps {
    tokens: TokenInterface[];
}

export default function Tokens({ tokens }: TokensProps) {
    const [tokenSymbol, setTokenSymbol] = useState<string>("");
   
    useEffect(() => {
        const fetchSymbol = async () => {
            let symbol = await readContract(wagmiConfig, {
                address: import.meta.env.VITE_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS as Address,
                abi: PAYMENT_TOKEN_ABI,
                functionName: 'symbol',
                args: []
            })

            setTokenSymbol(symbol);
        }

        fetchSymbol();
    }, []);


    if (tokens === undefined) {
        return <></>;
    }

    return tokens.map((item) => {
        return <Token data={item} key={item.id} tokenSymbol={tokenSymbol} />
    })
}