import { ConversationModel } from "../models/conversation.model.js";
import { MessageModel } from "../models/message.model.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const reciverId = req.params.id;
        const {testMessage:message } = req.body
            console.log(message)
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, reciverId] }
        })

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, reciverId],
                message: [], // initialize message array
            })
        }

        const newMessage = await MessageModel.create({
            senderId,
            reciverId,
            message
        })

        if (newMessage) conversation.message.push(newMessage._id)
        await Promise.all([conversation.save(), newMessage.save()])

        // implement socket io from real time data transfer

        const reciverSocketId = getReciverSocketId(reciverId)
            if(reciverSocketId){
                io.to(reciverSocketId).emit('newMessage',newMessage)
            }
            
        return res.status(200).json({ message: "Connersion add Successfully", success: true, newMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};





export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const reciverId = req.params.id;
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, reciverId] }
        }).populate('message')

        if (!conversation) return res.status(200).json({ success: true, messages: [] })

        return res.status(200).json({ success: true, message: conversation?.message })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
