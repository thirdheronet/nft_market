import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        sections: [],
        myNFT: false,
    },
    reducers: {
        filterCategories: (state, action) => {
            state.sections = action.payload;
        },
        filterMyNFT: (state, action) => {
            state.myNFT = action.payload;
        }
    }
});

export const { filterCategories, filterMyNFT } = filterSlice.actions

export default filterSlice.reducer;

