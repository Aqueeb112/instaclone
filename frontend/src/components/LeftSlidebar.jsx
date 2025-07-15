import { setAuthUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  LogOutIcon,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import store from "@/redux/store";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSlidebar = () => {
  const { user } = useSelector((store) => store.auth)
  const { likeNotification } = useSelector(store => store.rtn)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 ">
          <AvatarImage className="rounded-[50%]" src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOutIcon />, text: "Logout" },
  ];


  const Logouthandler = async () => {
    try {
      let response = await axios.get(`${import.meta.env.VITE_DOMAIN_URL}/api/v1/user/logout`, { withCredentials: true })
      navigate("/login")
      dispatch(setAuthUser(null))
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const sliderhindler = (type) => {
    if (type === "Logout") {
      Logouthandler()
    }
    else if (type === "Create") {
      setOpen(true)
    } else if (type === "Profile") {
      navigate(`profile/${user._id}`)
    }
    else if (type === "Home") {
      navigate("/")
    }
    else if (type === "Messages") {
      navigate("/chat")
    }
  }



  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>

        <div>
          {sidebarItems.map((item, index) => {
            return <div key={index} onClick={() => sliderhindler(item.text)} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
              {item.icon}
              <span>{item.text}</span>
              {
                item.text === "Notifications" && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {
                          likeNotification.length === 0 ? (<p>No new notification</p>) : (
                            likeNotification.map((notification) => {
                              return (
                                <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                  <Avatar>
                                    <AvatarImage src={notification.userDetails?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                </div>
                              )
                            })
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              }

            </div>;
          })}

          <CreatePost open={open} setOpen={setOpen} />


          {/* Example Sidebar Item 3 */}
          <div className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
            <span>Profile</span>
          </div>
        </div>
      </div>

      {/* CreatePost component placeholder */}
      <div>{/* <CreatePost open={open} setOpen={setOpen} /> */}</div>
    </div>
  );
};

export default LeftSlidebar;
