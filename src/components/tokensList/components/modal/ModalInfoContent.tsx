import { TokenInterface } from "../Token";
import { ethers } from "ethers";

const ModalInfoContent = ({ data, tokenSymbol }: { data: TokenInterface, tokenSymbol: string }) => {
    const attrsValues = Object.values(data.attributes);

    return <>
        <div>section: {data.section}</div>
        <div>owner: <a href={"#"} className={"text-sm"}>{data.owner}</a></div>
        <div>cost: {ethers.utils.formatEther(data.salePrice)} ({tokenSymbol})</div>

        <div className={"my-2"}></div>

        {Object.keys(data.attributes).map((item, key) => {
            return <div key={key}>{item}: {attrsValues[key]}</div>
        })}
    </>
};

export default ModalInfoContent;