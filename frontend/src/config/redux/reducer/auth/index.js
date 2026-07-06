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
        }
    },
    // loadingUser: async(state) =>{
    //     const request = axios.post(`/login`, {});
    //     const response = [];

    //     state.user = response.data.token;

    // },
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
            state.message = "Registration is successfull";
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export default authSlice.reducer;