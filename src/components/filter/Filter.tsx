import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { Address } from "viem";
import { ethers } from "ethers";
import { COLLECTION_TOKEN_ABI } from "../tokensList/constants/abi";
import { wagmiConfig } from "../../context/Web3Provider";
import { useAppDispatch } from "../../utils/reducer";
import { filterCategories } from "../../reducer/filter";

export interface SectionCheckbox {
    name: string;
    checked: boolean;
}

export default function Filter() {
    const [sections, setSections] = useState<SectionCheckbox[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        readContract(wagmiConfig, {
            address: import.meta.env.VITE_PUBLIC_ITEMS_CONTRACT_ADDRESS as Address,
            abi: COLLECTION_TOKEN_ABI,
            functionName: 'getSections',
            args: []
        }).then((res) => {
            const newSections: SectionCheckbox[] = [];

            res.map((item) => {
                newSections.push({ name: item, checked: true });
            });

            setSections(newSections);
        })
    }, []);

    useEffect(() => {
        dispatch(filterCategories(sections.filter((item) => item.checked)));
    }, [sections]);

    const onChangeFilterHandler = (key: string, value: boolean) => {
        const updatedSections = sections.map((section) => {
            return section.name === key ? { ...section, checked: !value } : section
        }
        );

        setSections(updatedSections);
    }

    return <>
        <div className={"bg-gray-700 rounded-md text-center uppercase"}>
            <b>Filter</b>
        </div>
        <div className={"flex flex-col gap-2 p-4"}>
            {sections.map((item, index) => {
                return <div key={index}>
                    <label className={"uppercase font-bold text-sm text-gray-400"} key={item.name}>
                        <input type={"checkbox"} className={"mr-1"} value={item.name} checked={item.checked}
                            disabled={item.checked && sections.filter((item) => item.checked).length === 1}
                            onChange={() => onChangeFilterHandler(item.name, item.checked)} />
                        {ethers.utils.toUtf8String(item.name.replace(/(00)+$/, ''))}
                    </label>
                </div>
            })}
        </div>
    </>
}