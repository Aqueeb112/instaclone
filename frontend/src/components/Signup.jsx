import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const {user} = useSelector(store=> store.auth)
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loader, setLoader] = useState(false);

  const onchange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN_URL}/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setInput({
        username: "",
        email: "",
        password: "",
      });
      toast(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    } finally {
      setLoader(false);
    }
  };
   useEffect(() => {
          if (user) {
              navigate("/")
          }
      }, [])
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={submithandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={onchange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={onchange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={onchange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loader ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}


        <span className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
