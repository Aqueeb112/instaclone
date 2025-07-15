import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSidebar from './RightSidebar'
import fetchAllPosts from '@/hooks/fetchAllPosts'
import getsuggesterusers from '@/hooks/getSuggesterusers'

const Home = () => {
  fetchAllPosts()
  getsuggesterusers()
  return (
    <div className='flex'>
        <div className="flex-grow">
            <Feed/>
            <Outlet/>
        </div>
        <RightSidebar/>
    </div>
  )
}

export default Home