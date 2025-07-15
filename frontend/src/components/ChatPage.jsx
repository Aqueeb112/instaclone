import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setselectedUser } from '../redux/authSlice'
import Messages from './Messages'
import axios from 'axios'
import { setMessages } from '../redux/chatSlice'
import { MessageCircleCode } from 'lucide-react'


const ChatPage = () => {
    const [testMessage, setTestMessage] = useState("")
    const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth)
    const { onlineUsers ,messages } = useSelector(store => store.chat)
    const dispatch = useDispatch()

    const handlesubmitmessage = async (reciverid) => {
        try {
            let response = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/message/send/${reciverid}`, {testMessage}, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            if (response.data.success) {
                dispatch(setMessages([...messages,response.data.newMessage]))
                setTestMessage("")
            }
        } catch (error) {
                console.log(error)
        }
    }

    useEffect(()=>{
        return ()=>{
            dispatch(setselectedUser(null))
        }
    },[])

    return (
        <div className="flex ml-[16%] h-screen">
            <section className="w-full md:w-1/4 my-8">
                <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
                <hr className="mb-4 border-gray-300" />
                <div className="overflow-y-auto h-[80vh]">
                    {suggestedUsers?.map((suggesteduser) => {
                        const isOnline = onlineUsers?.includes(suggesteduser._id)

                        return <div onClick={() => dispatch(setselectedUser(suggesteduser))} key={suggesteduser._id} className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src={suggesteduser?.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{suggesteduser?.username}</span>
                                <span className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"} `}>{isOnline ? "online" : "offline"}</span>
                            </div>
                        </div>
                    })}

                </div>
            </section>

            {selectedUser ? (
                <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
                    <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                        <Avatar>
                            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>

                    {/* <div className="overflow-y-auto flex-1 p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-start">
                            <div className="p-2 rounded-lg max-w-xs break-words bg-gray-200 text-black">
                                Incoming message
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="p-2 rounded-lg max-w-xs break-words bg-blue-500 text-white">
                                Outgoing message
                            </div>
                        </div>
                    </div>
                </div> */}
                    <Messages selectedUser={selectedUser} />
                    <div className="flex items-center p-4 border-t border-t-gray-300">
                        <Input value={testMessage} onChange={(e) => setTestMessage(e.target.value)} type="text" className="flex-1 mr-2 focus-visible:ring-transparent" placeholder="Messages..." />
                        <Button onClick={() => handlesubmitmessage(selectedUser?._id)}>Send</Button>
                    </div>
                </section>
            )
                :
                (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>

    )
}

export default ChatPage