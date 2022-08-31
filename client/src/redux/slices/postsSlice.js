import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instanceApi from '../api';

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading'
    },
    sortType: 1
};

export const getPosts = createAsyncThunk('posts/getPosts', async (type) => {
    const {data} = await instanceApi.get(`/posts`, {
        params: {type}
    });
    return data;
});

export const getTags = createAsyncThunk('posts/getTags', async () => {
    const {data} = await instanceApi.get('/tags');
    return data
});

export const removePost = createAsyncThunk('posts/removePost', async (id) => {
    instanceApi.delete(`/posts/${id}`);
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        sortPosts(state, action) {
            state.sortType = action.payload
        }
    },
    extraReducers: {
        // Posts
        [getPosts.pending]: (state = initialState) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [getPosts.fulfilled]: (state = initialState, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [getPosts.rejected]: (state = initialState) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        // Tags
        [getTags.pending]: (state = initialState) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [getTags.fulfilled]: (state = initialState, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [getTags.rejected]: (state = initialState) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
        // Remove post
        [removePost.pending]: (state = initialState, action) => {
            state.posts.items = state.posts.items.filter(item => item._id !== action.meta.arg);
        },
    }
})

export const postsReducer = postsSlice.reducer;
export const {sortPosts} = postsSlice.actions