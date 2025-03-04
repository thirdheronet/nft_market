import { useCallback, useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/scaffold-react";
import { FaInfo, FaShoppingBasket } from "react-icons/fa";
import { readContract, signTypedData } from "@wagmi/core";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import { COLLECTION_TOKEN_ABI, PAYMENT_TOKEN_ABI } from "../constants/abi";
import ModalInfoContent from "./modal/ModalInfoContent";
import ModalManageContent from "./modal/ModalManageContent";
import { wagmiConfig } from "../../../context/Web3Provider";
import { useAppDispatch } from "../../../utils/reducer";
import { modalOpen } from "../../../reducer/modal";
import fetchJsonData from "../../../utils/fetchJsonData";
import { Address } from "viem";

export interface TokenBase {
    id: bigint;
    salePrice: bigint;

    equipped: boolean;

    metadata: string;
    section: string;
    owner: string;
    saciPath: string;
}

export interface TokenMetaData {
    name: string;
    image: string;
    attributes: {
        intelligence: number,
        agility: number,
        strength: number;
    };
}

export interface TokenInterface extends TokenBase, TokenMetaData {

}

export interface TokenProps {
    data: TokenInterface
    tokenSymbol: string;
}

const getNonce = async (owner: Address) => {
    return await readContract(wagmiConfig, {
        address: import.meta.env.VITE_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS as Address,
        abi: PAYMENT_TOKEN_ABI,
        functionName: 'nonces',
        args: [owner]
    });
};

const getSignature = async (cost: bigint, owner: Address, deadline: bigint) => {
    try {
        const signature = await signTypedData(wagmiConfig, {
            domain: {
                name: import.meta.env.VITE_TOKEN_SHORTCUT || "",
                version: import.meta.env.VITE_TOKEN_VERSION || "",
                chainId: BigInt(import.meta.env.VITE_DAPP_CHAIN_ID || ""),
                verifyingContract: import.meta.env.VITE_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS as Address
            },
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                Permit: [
                    { name: 'owner', type: 'address' },
                    { name: 'spender', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' },
                ],
            },
            primaryType: 'Permit',
            message: {
                owner: owner,
                spender: import.meta.env.VITE_PUBLIC_ITEMS_CONTRACT_ADDRESS as Address,
                value: cost,
                nonce: await getNonce(owner),
                deadline: deadline,
            }
        });

        return ethers.utils.splitSignature(signature);
    } catch (error) {
        console.error(error);
    }
};

export default function Token({ data, tokenSymbol }: TokenProps) {
    const [token, setToken] = useState<TokenInterface>(data);
    const { isDisconnected, address } = useAccount();
    const dispatch = useAppDispatch()
    const { open } = useWeb3Modal();
    const { writeContractAsync } = useWriteContract()

    const onSalePriceChangeHandler = useCallback((newPrice: number) => {
        setToken({ ...token, ...{ salePrice: BigInt(newPrice * 10 ** 18) } })
    }, [token]);

    const onBuyHandler = useCallback(async (tokenId: number) => {
        if (isDisconnected) {
            open();

            return;
        }

        const deadline = BigInt(Date.now() + 24 * 60 * 60 * 1000);

        await getSignature(token.salePrice, address as Address, deadline).then(async (res) => {
            if (res === undefined) {
                return;
            }

            await writeContractAsync({
                address: import.meta.env.VITE_PUBLIC_ITEMS_CONTRACT_ADDRESS as Address,
                abi: COLLECTION_TOKEN_ABI,
                functionName: 'acceptOfferSale',
                args: [
                    BigInt(tokenId),
                    deadline,
                    res.v,
                    res.r as Address,
                    res.s as Address
                ],
            }).then((_res) => {
                // console.log(res);
            }).catch((e) => {
                console.log("error: ", e.message);
            })
        }).catch((e) => {
            console.log("error:", e);
        })

    }, [isDisconnected]);

    const onClickInfoHandler = async () => {
        dispatch(modalOpen({
            title: token.name,
            children: <ModalInfoContent data={token} tokenSymbol={tokenSymbol} />,
        }));
    }

    const onClickManageHandler = async () => {
        dispatch(modalOpen({
            title: token.name + " (" + token.id + ")",
            children: <ModalManageContent data={token} tokenSymbol={tokenSymbol}
                onSalePriceChange={onSalePriceChangeHandler} />
        }));
    }

    useEffect(() => {
        fetchJsonData((token.metadata).replace("ipfs://", "")).then((res: TokenMetaData) => {
            setToken({
                ...token, ...{
                    name: res.name,
                    attributes: res.attributes || [],
                    image: import.meta.env.VITE_PUBLIC_PINATA_HTTP_GATEWAY + res.image.replace("ipfs://", "")
                }
            });
        });
    }, []);

    if (!token.image) {
        return null;
    }

    return <>
        <div className={"bg-gray-800 p-1 border-2 border-gray-900 rounded-md flex items-between flex-col gap-1"}>
            {/* NFT IMAGE */}
            <div
                className={"bg-gray-700 rounded-lg flex items-center border-2 border-gray-700 px-[3px] h-full"}>
                <img src={token.image}
                    alt={"Token #" + token.id}
                    className={"rounded-lg border-2 border-gray-700 hover:border-gray-900"} />
            </div>

            <div className={"text-sm text-gray-400 min-h-4 text-center"}>
                <div><a href={"#"}>{token.owner.slice(0, 4)}...{token.owner.slice(-6)}</a></div>
            </div>

            <div className={"text-center font-bold flex justify-around"}>
                <div>
                    <span className={"mr-1 text-lime-400"}>{ethers.utils.formatEther(token.salePrice)}</span>
                    <span className={"text-yellow-400"}>{tokenSymbol}</span>
                </div>
            </div>

            <div className={"flex gap-2 items-center"}>
                {/* INFO BUTTON */}
                <button className={"bg-gray-700 w-full rounded-md p-1 border-2 border-gray-900 flex-1"}
                    onClick={onClickInfoHandler}>
                    <FaInfo className={"m-auto text-blue-200 text-xl"} />
                </button>

                {/* BUY BUTTON */}
                {token.owner !== address ? (
                    <button className={"bg-green-600 w-full rounded-md p-1 border-2 border-gray-700 flex-[1/3]"}
                        onClick={() => onBuyHandler(Number(token.id))}>
                        <FaShoppingBasket className={"m-auto text-lime-200 text-xl"} />
                    </button>
                ) : (<button
                    className={"text-red-400 bg-gray-800 w-full text-sm rounded-md p-1 border-2 border-gray-700 flex-[1/3] font-bold uppercase"}
                    onClick={() => onClickManageHandler()}>
                    manage
                </button>)}
            </div>

        </div>
    </>
}

