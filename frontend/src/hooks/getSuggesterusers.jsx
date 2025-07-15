
import { setSuggestedUsers } from "@/redux/authSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const getsuggesterusers= ()=>{
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchsuggesteduser = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/user/suggested`,{withCredentials:true})
            if (response.data.success) {
                dispatch(setSuggestedUsers(response.data.users))
            }
        } catch (error) {
                console.log(error)
        }}
        fetchsuggesteduser()
    },[])
}

export default getsuggesterusers