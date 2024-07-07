import { configureStore } from '@reduxjs/toolkit'
import { ReactElement } from "react";
import { SectionCheckbox } from '../components/filter/Filter';
import { modalSlice } from './modal';
import { filterSlice } from './filter';

export interface RootState {
    modal: { isOpened: boolean, payload: { children: ReactElement, title: string } }
    filter: { sections: SectionCheckbox[], myNFT: boolean }
}

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        filter: filterSlice.reducer,
    },
})

export type AppDispatch = typeof store.dispatch
export default store;