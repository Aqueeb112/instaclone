import {createSlice} from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:null,
        messages:[]
    },
    reducers:{
        //action
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setMessages:(state,action)=>{
            state.messages = action.payload
        },

    }
})
export const {setOnlineUsers,setMessages} = chatSlice.actions
export default chatSlice.reducer