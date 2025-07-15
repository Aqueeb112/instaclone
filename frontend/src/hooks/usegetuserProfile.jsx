
import { setuserProfile } from "@/redux/authSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const getUserProfile= (userId)=>{
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchuserprofile = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/user/${userId}/profile`,{withCredentials:true})
            if (response.data.success) {
                dispatch(setuserProfile(response.data.user))
            }
        } catch (error) {
                console.log(error)
        }}
        fetchuserprofile()
    },[])
}

export default getUserProfile