import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../action/auth/index.js";

const initialState = {
    user : [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connection : [],
    connectionRequest : []
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset : ()=> initialState,
        handleLoginUser: (state) =>{
            state.message = "hello";
        },
        emptyMessage : (state) => {
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Knocking on the door...";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Login is successfull";
        })  
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Creating account...";
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = { message: "Registration is successfull, Please login"};
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const { reset, handleLoginUser, emptyMessage } = authSlice.actions;

export default authSlice.reducer;