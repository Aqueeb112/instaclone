import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("")
  const { selectedPost,posts } = useSelector(state => state.post)
  const [comment,setComment] = useState([])
  const dispatch = useDispatch()

  useEffect(()=>{
      if(selectedPost){
        setComment(selectedPost.comments)
      }
  },[selectedPost])
  let handlecommentchange = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText("")
    }
  }



  const handleAddcomment = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/${selectedPost._id}/comment`, { text }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      console.log(response.data)
      if (response.data.success) {
        const updatedcomment = [...comment, response.data.comment]
        setComment(updatedcomment);
        const uodatepostcomment = posts.map(p => p._id === selectedPost._id ? { ...p, comments: updatedcomment } : p)
        dispatch(setPosts(uodatepostcomment))
        toast.success(response.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error);

    }
  }


  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className='flex flex-1'>
          {/* Left image section */}
          <div className='w-1/2'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>

          {/* Right content section */}
          <div className='w-1/2 flex flex-col justify-between'>
            {/* Header */}
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link href="#">
                  <Avatar>
                    <AvatarImage src={selectedPost?.author.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link href="#" className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                </div>
              </div>

              {/* Nested Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />

            {/* Comments area */}
            <div className='flex-1 overflow-y-auto max-h-96 p-4 space-y-3'>
              {comment && comment.map((item) => {
                return <div key={item._id} className="text-sm border-b pb-2">
                  <strong>{item?.author?.username}</strong>: {item.text}
                </div>
              })}
            </div>

            {/* Comment input */}
            <div className='p-4' >
              <div className='flex items-center gap-2'>
                <Input value={text} onChange={handlecommentchange} placeholder='Add a comment...' className='text-sm' />
                <Button onClick={handleAddcomment} disabled={!text.trim()} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default CommentDialog