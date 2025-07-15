
import { setPosts } from "@/redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const fetchAllPosts= ()=>{
    const dispatch = useDispatch()
    useEffect(()=>{
        const getallpost = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/all`,{withCredentials:true})
            if (response.data.success) {
                dispatch(setPosts(response.data.posts))
            }
        } catch (error) {
                console.log(error)
        }}
        getallpost()
    },[])
}

export default fetchAllPosts