import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import getUserMessages from '@/hooks/usegetallmessages'
import getRTM from '@/hooks/getRealTimeMsg'

const Messages = ({selectedUser}) => {
  getRTM()
  getUserMessages()
  const {messages} = useSelector(store=> store.chat)
  const {user} = useSelector(store=> store.auth)
  return (
   <div className="overflow-y-auto flex-1 p-4">
  <div className="flex justify-center">
    <div className="flex flex-col items-center justify-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span>{selectedUser?.username}</span>
      <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2 cursor-pointer" variant="secondary">View profile</Button></Link>
    </div>
  </div>
  { messages && messages.map((msg)=>{
 return <div className="flex flex-col gap-3">
    <div className={`flex  ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}>
      <div className={`p-2 mt-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? "bg-blue-500 text-white" :"bg-gray-200 text-black"}`}>
        {msg.message}
      </div>
    </div>
    {/* <div className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}>
      <div className="p-2 rounded-lg max-w-xs break-words bg-blue-500 text-white">
        Sample outgoing message
      </div>
    </div> */}
  </div>
    })}
</div>
  )
}

export default Messages