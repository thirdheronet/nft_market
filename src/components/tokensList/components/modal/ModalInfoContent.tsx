import { TokenInterface } from "../Token";

const ModalInfoContent = ({ data, tokenSymbol }: { data: TokenInterface, tokenSymbol: string }) => {
    const attrsValues = Object.values(data.attributes);

    return <>
        <div>section: {data.section}</div>
        <div>owner: <a href={"#"} className={"text-sm"}>{data.owner}</a></div>
        <div>cost: {Number(data.salePrice).toFixed(2)} ({tokenSymbol})</div>

        <div className={"my-2"}></div>

        {Object.keys(data.attributes).map((item, key) => {
            return <div key={key}>{item}: {attrsValues[key]}</div>
        })}
    </>
};

export default ModalInfoContent;