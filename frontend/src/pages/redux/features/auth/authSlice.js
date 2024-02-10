import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    resetToken: localStorage.getItem('resetToken') ? JSON.parse(localStorage.getItem('resetToken')) : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
            const expirationTime = new Date().getTime() + 30 * 2 * 60 * 60 * 1000;
            localStorage.setItem('expirationTime' ,expirationTime)
        },

        logout: (state) => {
            state.userInfo = null
            localStorage.clear()
        },

        getPasswordResetToken: (state, action) => {
            state.resetToken = action.payload
            localStorage.setItem('resetToken', JSON.stringify(action.payload))
        }
    }
});

export const {setCredentials, logout, getPasswordResetToken} = authSlice.actions
export default authSlice.reducer