
import { setMessages } from "@/redux/chatSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


const getRTM = (userId)=>{
    const dispatch = useDispatch()
    const {messages} = useSelector(store => store.chat)
    const {socket} = useSelector(store => store.socketio)
    useEffect(()=>{
        const fetchusegetRtm = async()=>{
            socket.on('newMessage',(newMessage)=>{
                dispatch(setMessages([...messages,newMessage]))
            })

            return () =>{
                socket?.off('newMessage')
            }
    }
        fetchusegetRtm()
    },[messages,setMessages])
}

export default getRTM;