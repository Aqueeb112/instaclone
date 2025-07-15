import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { FaHeart, FaRegHeart } from "react-icons/fa"
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [openComment, setOpenComment] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const { posts } = useSelector((store) => store.post)
  const [openPostdetails, setOpenPostdetails] = useState(false)
  const [Liked, setLiked] = useState(post.likes.includes(user?._id) || false)
  const [postLiked, setPostLiked] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  const dispatch = useDispatch()
  const handlecommentchange = (e) => {
    const commtext = e.target.value
    if (commtext.trim()) {
      setText(commtext)
    } else {
      setText("")
    }
  }

  const handleBookmark = async ()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/${post._id}/bookmark`, { withCredentials: true })
        if (response.data.success) {
          toast.success(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
  }

  const handleLikeorDislike = async () => {
    try {
      const action = Liked ? "dislike" : "like"
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/${post._id}/${action}`, { withCredentials: true })
      if (response.data.success) {
        const updatedLike = Liked ? postLiked - 1 : postLiked + 1
        setPostLiked(updatedLike)
        setLiked(!Liked)
        const updatelikesdata = posts.map(p => p._id === post._id ? {
          ...p,
          likes: Liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
        } : p
        )
        dispatch(setPosts(updatelikesdata))
        toast.success(response.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleAddcomment = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/${post._id}/comment`, { text }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (response.data.success) {
        const updatedcomment = [...comment, response.data.comment]
        setComment(updatedcomment);
        const uodatepostcomment = posts.map(p => p._id === post._id ? { ...p, comments: updatedcomment } : p)
        dispatch(setPosts(uodatepostcomment))
        toast.success(response.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handledeletepost = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/delete/${post._id}`, { withCredentials: true })
      if (response.data.success) {
        let updatedPost = posts.filter((deletePost) => deletePost?._id !== post?._id)
        dispatch(setPosts(updatedPost))
        toast.success(response.data.message)
        setOpenPostdetails(false)

      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Link  to={`/profile/${post?.author?._id}`} className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage className='w-8 h-8 rounded-[50%]' src={post?.author.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-3'>
            <h1>{post?.author.username}</h1>
           {user?._id === post?.author._id && <Badge variant="secondary">Author</Badge>} 
          </div>
        </Link>


        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal onClick={() => setOpenPostdetails(true)} className='cursor-pointer' />
          </DialogTrigger>
          {openPostdetails && (<DialogContent className="flex flex-col items-center text-sm text-center">

            {post?.author?._id !== user?._id &&   <Button variant='ghost' className="text-[#ED4956] font-bold">Unfollow</Button>}
          
            <Button variant='ghost'>Add to favorites</Button>
            {user && user._id === post.author._id && <Button onClick={handledeletepost} variant='ghost'>Delete</Button>}

          </DialogContent>)
          }
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        className='rounded-sm my-2 w-full aspect-square object-cover'
        src={post?.image}
        alt="post_img"
      />

      {/* Action Buttons */}
      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-3'>
          {Liked ?
            <FaHeart onClick={handleLikeorDislike} className='cursor-pointer text-red-600' size={24} />
            :
            <FaRegHeart onClick={handleLikeorDislike} className='cursor-pointer' size={24} />
          }
          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post));
            setOpenComment(true)
          }} className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark onClick={handleBookmark} className='cursor-pointer hover:text-gray-600' />
      </div>

      {/* Likes + Caption */}
      <span className='font-medium block mb-2'>{postLiked} likes</span>
      <p>
        <span className='font-medium mr-2'>{post?.author.username}</span>
        {post?.caption}
      </p>

      {/* Comments */}
      {comment.length > 0 && (<span onClick={() => {
        dispatch(setSelectedPost(post));
        setOpenComment(true)
      }}
        className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>)}
      <CommentDialog open={openComment} setOpen={setOpenComment} />
      {/* Comment Input */}
      <div className='flex items-center justify-between mt-2 gap-2'>
        <input value={text} onChange={handlecommentchange} placeholder='Add a comment...' className="text-sm w-full outline-none" />
        {text && <span onClick={handleAddcomment} className='text-[#3BADF8] cursor-pointer'>Post</span>}

      </div>
    </div>
  )
}

export default Post