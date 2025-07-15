import { createSlice } from "@reduxjs/toolkit"; 


const  rtbSlice = createSlice({
    name:"rtn",
    initialState:{
        likeNotification:[]
    },
    reducers:{
        // action
        setlikeNotification:(state,action)=>{
            if(action.payload.type === "like"){
                state.likeNotification.push(action.payload)
            }else if (action.payload.type === "dislike"){
                state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId)
            }
        },
    }
})

export const {setlikeNotification} = rtbSlice.actions
export default rtbSlice.reducer