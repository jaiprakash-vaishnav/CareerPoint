import { createAsyncThunk } from '@reduxjs/toolkit';
import clientServer from "../../../index.js";
export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, thunkAPI) => {
    try{
        const response = await clientServer.post('/login', {
            email : userData.email,
            password : userData.password
        });
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
        }else{
            return thunkAPI.rejectWithValue({
                message: "Login failed"
            });
        }
        
        return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, thunkAPI) => {
    try{
        const response = await clientServer.post('/register', {
            username : userData.username,
            name : userData.name,
            email : userData.email,
            password : userData.password
        });
        // if(response.data.token){
        //     localStorage.setItem('token', response.data.token);
        // }
        // return thunkAPI.fulfillWithValue(response.data);
    }   
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);