import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice.js'

const Login = () => {
    const [input,setInput] = useState({
        email:"",
        password:""
    })
    const {user} = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [loader,setLoader] = useState(false)
    const navigate = useNavigate()

      useEffect(() => {
          if (user) {
              navigate("/")
          }
      }, [])
      

    const onchange = (e)=>{
        const {name,value} = e.target
        setInput({...input,[name]:value})
    }
    
    const submithandler = async (e)=>{
        e.preventDefault()
            try {
                setLoader(true)
                let response = await axios.post(`https://instaclone-11n5.onrender.com/api/v1/user/login`, input, {
                    headers:{
                          "Content-Type": "application/json",
                    } ,
                    withCredentials:true
                })
                toast(response.data.message)
                navigate("/")
                dispatch(setAuthUser(response.data.user))
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message)
            }finally{
                setLoader(false)
            }
    }
  return (
       <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={submithandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={onchange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={onchange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loader ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}


        <span className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            SignUp
          </Link>
        </span>
      </form>
    </div>
  )
}

export default Login