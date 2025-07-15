import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
      const post = useSelector(state => state.post.posts)
  return (
    <div>
        {
           post && post?.map((post)=> <Post post={post} key={post._id}/>)
        }
    </div>
  )
}

export default Posts