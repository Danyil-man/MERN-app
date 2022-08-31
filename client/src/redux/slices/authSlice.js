import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instanceApi from '../api';

const initialState = {
    data: null,
    status: 'loading',
    isAuth: false
}

export const authUser = createAsyncThunk('auth/getUser', async (params) => {
    const {data} = await instanceApi.post("/auth/login", params);
    return data;
});

export const regUser = createAsyncThunk('auth/regUser', async (params) => {
    const {data} = await instanceApi.post("/auth/register", params);
    return data;
});

export const checkAuth = createAsyncThunk('auth/getMe', async () => {
    const {data} = await instanceApi.get("/auth/me");
    return data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.isAuth = false;
        }
    },
    extraReducers:{
        // Login
        [authUser.pending]: (state = initialState) => {
            state.data = null;
            state.status = 'loading';
            state.isAuth = false;
        },
        [authUser.fulfilled]: (state = initialState, action) => {
            state.data = action.payload;
            state.status = 'loaded';
            state.isAuth = true;
        },
        [authUser.rejected]: (state = initialState) => {
            state.data = null;
            state.posts.status = 'error';
            state.isAuth = false;
        },
        // CheckAuth
        [checkAuth.pending]: (state = initialState) => {
            state.data = null;
            state.status = 'loading';
            state.isAuth = false;
        },
        [checkAuth.fulfilled]: (state = initialState, action) => {
            state.data = action.payload;
            state.status = 'loaded';
            state.isAuth = true;
        },
        [checkAuth.rejected]: (state = initialState) => {
            state.data = null;
            state.posts.status = 'error';
            state.isAuth = false;
        },
        // Register
        [regUser.pending]: (state = initialState) => {
            state.data = null;
            state.status = 'loading';
            state.isAuth = false;
        },
        [regUser.fulfilled]: (state = initialState, action) => {
            state.data = action.payload;
            state.status = 'loaded';
            state.isAuth = true;
        },
        [regUser.rejected]: (state = initialState) => {
            state.data = null;
            state.posts.status = 'error';
            state.isAuth = false;
        },
    }
});

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions;