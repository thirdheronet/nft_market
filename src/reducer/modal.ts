import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isOpened: false,
        payload: {},
    },
    reducers: {
        modalOpen: (state, action) => {
            state.isOpened = true;
            state.payload = action.payload;
        },
        modalClose: (state) => {
            state.isOpened = false;
            state.payload = {};
        }
    }
});

export const { modalOpen, modalClose } = modalSlice.actions

export default modalSlice.reducer;

