
import { setMessages } from "@/redux/chatSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


const getUserMessages= (userId)=>{
    const dispatch = useDispatch()
    const {selectedUser} = useSelector(store=> store.auth)
    useEffect(()=>{
        const fetchUserMessages = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true})
            if (response.data.success) {
                dispatch(setMessages(response.data.message))
            }
        } catch (error) {
                console.log(error)
        }}
        fetchUserMessages()
    },[selectedUser])
}

export default getUserMessages