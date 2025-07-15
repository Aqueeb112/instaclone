import getUserProfile from '@/hooks/usegetuserProfile'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { AtSign, Heart, MessageCircle } from 'lucide-react'
import { Badge } from './ui/badge'
import axios from 'axios'
import { toast } from 'sonner'
import { setAuthUser, setuserProfile } from '@/redux/authSlice'

const Profile = () => {
  const { id } = useParams()
  getUserProfile(id)
  const { userProfile, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
  const data = userProfile
  const [isFollowing,setIsFollowing]  = useState(false)
    useEffect(()=>{
      setIsFollowing(user.following.includes(data?._id))
    },[user,data?._id])

      console.log(isFollowing)

  const isLoggedInUserProfile = user?._id === userProfile?._id
  // const isFollowing = false
  const [activeTab, setActiveTab] = useState("posts")

  const handleActive = (text) => {
    setActiveTab(text)
  }


  const handlefollowunfollow = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/user/followunfollow/${userId}`,{withCredentials: true});
      console.log(response)
      if (response.data.success) {
           // Toggle local follow state for button
      setIsFollowing((prev) => !prev);

     // Update Redux auth user
      const updatedFollowing = user.following.includes(userId)
        ? user.following.filter(id => id !== userId)
        : [...user.following, userId];
      dispatch(setAuthUser({ ...user, following: updatedFollowing }));

      // Update the followers list in userProfile too
      const updatedFollowers = isFollowing
        ? userProfile.followers.filter(id => id !== user._id)
        : [...userProfile.followers, user._id];

      dispatch(setuserProfile({ ...userProfile, followers: updatedFollowers }));
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const displayPost = activeTab === "posts" ? data?.posts : data.bookmarks
  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={data?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{data?.username}</span>

                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button>
                    </Link>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
                  </>
                ) : (
                  isFollowing ?
                    <>
                      <Button onClick={() => handlefollowunfollow(data._id)} variant='secondary' className='h-8'>Unfollow</Button>
                      <Button variant='secondary' className='h-8'>Message</Button>
                    </>
                    :
                    <Button onClick={() => handlefollowunfollow(data._id)} className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                )


                }

              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{data?.posts?.length} </span>posts</p>
                <p><span className='font-semibold'>{data?.followers?.length} </span>followers</p>
                <p><span className='font-semibold'>{data?.following?.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{data?.bio}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign />
                  <span className='pl-1'>{data?.username}</span>
                </Badge>
                <span>🤯Learn code with aqueeb mernstack style</span>
                <span>🤯Turing code into fun</span>
              </div>
            </div>
          </section>
        </div>

        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3  cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`} onClick={() => handleActive("posts")}>POSTS</span>
            <span className={`py-3  cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`} onClick={() => handleActive("saved")}>SAVED</span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>

          <div className='grid grid-cols-3 gap-1'>
            {displayPost && displayPost.map((item) => (
              <div key={item._id} className='relative group cursor-pointer'>
                <img src={item?.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex items-center text-white space-x-4'>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <Heart />
                      <span>{item.likes.length}</span>
                    </button>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <MessageCircle />
                      <span>{item.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Profile