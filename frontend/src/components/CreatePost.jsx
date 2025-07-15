import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { readFileAsDataURL } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";


const CreatePost = ({ open, setOpen }) => {
  const {posts} = useSelector((store) => store.post);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loader, setLoader] = useState(false);
const dispatch = useDispatch()
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUri = await readFileAsDataURL(file);
      setImagePreview(dataUri);
    }
  };
  const createPostHandler = async (e) => {
    // e.preventDefault()
    let formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", file);
    }
    try {
      setLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...posts]));
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              className="w-7 h-7 rounded-[50%]"
              src={user?.profilePicture}
              alt="img"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs"></h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Select from computer
        </Button>
        {loader ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button onClick={createPostHandler} type="submit" className="w-full">
            Post
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
