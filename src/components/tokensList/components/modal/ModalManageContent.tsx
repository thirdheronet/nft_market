import { useWriteContract } from "wagmi";
import { FormEvent, useEffect, useState } from "react";
import { Address, TransactionExecutionError } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { TokenInterface } from "../Token";
import { COLLECTION_TOKEN_ABI } from "../../constants/abi";
import { useAppDispatch } from "../../../../utils/reducer";
import { modalClose } from "../../../../reducer/modal";
import { wagmiConfig } from "../../../../context/Web3Provider";

const ModalManageContent = ({ data, tokenSymbol, onSalePriceChange }: {
    data: TokenInterface,
    tokenSymbol: string,
    onSalePriceChange: (newPrice: number) => void
}) => {
    const { writeContractAsync } = useWriteContract()
    const [currentPrice, setCurrentPrice] = useState<number>(Number(data.salePrice) / (10 ** 18));
    const [txState, setTxState] = useState<string>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (txState !== "success") {
            return;
        }

        onSalePriceChange(currentPrice);

        dispatch(modalClose());
        alert("Success!");
    }, [txState]);

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setTxState("waiting");

        await writeContractAsync({
            address: import.meta.env.VITE_PUBLIC_ITEMS_CONTRACT_ADDRESS as Address,
            abi: COLLECTION_TOKEN_ABI,
            functionName: 'manageOfferSale',
            args: [BigInt(data.id), BigInt(currentPrice * 10 ** 18)],
        }).then(async (res) => {
            const receipt = await waitForTransactionReceipt(wagmiConfig, {
                hash: res,
            });

            setTxState(receipt.status);
        }).catch((e: TransactionExecutionError) => {
            alert(e.details);
            setTxState("denied");
        });
    }

    if (txState === "waiting") {
        return <div className={"text-center"}>
            <div className={"font-bold"}>waiting..</div>
            <div className={"text-sm"}>(your transaction confirmation + block confirmation)</div>
        </div>;
    }

    return <>
        <form className={"flex flex-col gap-4"} onSubmit={onSubmitHandler}>
            <p className={"text-red-400 text-sm self-center uppercase font-bold"}>Cost 0 = Not for sale</p>
            <p className={"text-red-400 text-sm self-center"}>When cost/price is setted on 0 then other users cannot buy your token.</p>

            <label className={"flex gap-4 items-center uppercase font-bold"}>
                Cost:
                <input
                    className={"bg-gray-700 w-full p-2 font-bold rounded-md"}
                    required
                    value={currentPrice} type={"number"} min={0} max={999999} onChange={(e) => {
                        setCurrentPrice(Number(e.target.value));
                    }} />
                <div>{tokenSymbol}</div>
            </label>
            <button className={"bg-gray-700 p-2 rounded-md w-1/3 self-center uppercase font-bold"}>Set Cost</button>
        </form>
    </>
}

export default ModalManageContent;