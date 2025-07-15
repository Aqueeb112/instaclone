import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice";
import axios from "axios";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loader, setLoader] = useState(false);
  const imageRef = useRef();
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filechangeHandle = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
    }
  };
  const selectchangeHandle = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async (e) => {
        e.preventDefault()
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
     setLoader(true);
  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/api/v1/user/profile/edit`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }
  );
      if (response.data.success) {
        const updatedData = {
          ...user,
          bio: response.data.user?.bio,
          profilePicture: response.data.user?.profilePicture,
          gender: response.data.user?.gender,
        };
        dispatch(setAuthUser(updatedData));
        navigate(`/profile/${user._id}`);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoader(false);
    }
  };
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={filechangeHandle}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Change photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectchangeHandle}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loader ? (
            <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
