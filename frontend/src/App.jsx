import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Home from "./components/Home";
import EditProfile from "./components/editProfile";
import ChatPage from "./components/ChatPage";
import {io} from "socket.io-client"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setlikeNotification } from "./redux/rtnSlice";
import ProctedLayout from "./components/ProctedLayout";
function App() {
  const {socket} = useSelector(store => store.socketio)

  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <ProctedLayout><MainLayout/></ProctedLayout> ,
      children: [
        {
          path: "/",
          element: <ProctedLayout><Home /></ProctedLayout> ,
        },
        {
          path: "/profile/:id",
          element:  <Profile />,
        },
        {
          path: "/account/edit",
          element: <EditProfile />,
        },
        {
          path: "/chat",
          element: <ChatPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  const {user} =  useSelector(store => store.auth)
  const dispatch = useDispatch()
  useEffect(()=>{
    if (user) {
      const socketio = io('http://localhost:3000',{
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });
      dispatch(setSocket(socketio))

      socketio.on('getOnlineUser',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      })
      socketio.on('notification',(notification)=>{
        dispatch(setlikeNotification(notification))
    })
      

    return ()=>{
      socketio.close()
      dispatch(setSocket(null))
    }
    }else if(socket){
         socket.close()
      dispatch(setSocket(null))
    }
  },[user,dispatch])

  return (
    
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
