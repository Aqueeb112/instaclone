import { createSlice } from "@reduxjs/toolkit"; 
import { act } from "react";

const  PostSlice = createSlice({
    name:"post",
    initialState:{
        posts:[],
        selectedPost:null
    },
    reducers:{
        // action
        setPosts:(state,action)=>{
            state.posts = action.payload
        },
        setSelectedPost:(state,action)=>{
            state.selectedPost = action.payload
        }
    }
})

export const {setPosts,setSelectedPost} = PostSlice.actions
export default PostSlice.reducer