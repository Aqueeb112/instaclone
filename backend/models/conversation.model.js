import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Messages"
    }]
})

export const  ConversationModel = mongoose.model("Conversation",conversationSchema)