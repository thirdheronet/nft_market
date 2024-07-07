import { ChangeEvent } from "react";
import { useAppDispatch } from "../../utils/reducer";
import { filterMyNFT } from "../../reducer/filter";

export default function Inventory() {
    const dispatch = useAppDispatch()

    const onClickInfoHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(filterMyNFT(e.target.checked));
    }

    return <>
        <label className={"rounded-md p-2 bg-lime-300 text-black font-bold flex gap-1 justify-center"}>
            <div><input type={"checkbox"} onChange={onClickInfoHandler} /></div>
            <div>My NFT</div>
        </label>
    </>
}
