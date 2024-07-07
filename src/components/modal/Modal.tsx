import { useEffect, useState } from "react";
import { FaRegWindowClose } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../utils/reducer";
import { modalClose } from "../../reducer/modal";
import { RootState } from "../../reducer/store";


interface ModalProps {
    defaultOpened?: boolean;
}

const Modal = ({ defaultOpened = false }: ModalProps) => {
    const modalState = useAppSelector((state: RootState) => state.modal);
    const [open, setOpen] = useState<boolean>(defaultOpened);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setOpen(modalState.isOpened);
    }, [modalState]);

    if (!open) {
        return null;
    }

    const onCloseHandler = () => {
        dispatch(modalClose());
    }

    return <>
        <div className={"bg-gray-900 fixed w-full h-screen opacity-[0.66]"}></div>
        <div
            className={"z-[999] max-h-[calc(100vh-4rem)] fixed max-w-xl w-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-md py-opacity-95 border-2 border-gray-700 bg-gray-900"}>
            {/* HEADER */}
            <div className={"flex justify-between items-center bg-gray-800 h-12 py-4 px-2"}>
                <h2 className={"font-medium"}>{modalState.payload.title}</h2>
                <button onClick={onCloseHandler} className={"font-light w-8 h-8"}>
                    <FaRegWindowClose className={"text-red-400 w-full h-full"} />
                </button>
            </div>

            {/* CONTENT */}
            <div className={"overflow-y-auto max-h-[calc(100vh-12em)] p-4"}>
                {modalState.payload.children}
            </div>
        </div>
    </>
}

export default Modal;
