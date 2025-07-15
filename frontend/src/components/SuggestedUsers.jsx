import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'

const SuggestedUsers = () => {
      const{suggestedUsers} = useSelector(state=>state.auth)
  return (
     <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
                    {suggestedUsers && suggestedUsers.map((item)=>{  
                        return <div key={item._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${item._id}`}>
                                    <Avatar>
                                        <AvatarImage src={item?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${item._id}`}></Link>{item?.username}</h1>
                                    <span className='text-gray-600 text-sm'>{item?.bio || "bio hear"}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                        </div>
                                            })}    

        </div>
  )
}

export default SuggestedUsers