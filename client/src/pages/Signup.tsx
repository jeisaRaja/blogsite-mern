import axios from "axios";
import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/animation";
import { authWithGoogle } from "../common/firebase";
import googleIcon from "../../images/google.png";
import Navbar from "../components/Navbar/Navbar";
import Button from "../components/Input/Button";
import {emailRegex, passwordRegex} from "../common/regex"
import { useAppContext } from "../contexts/useAppContext";

const Signup = () => {
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  const {user, login} = useAppContext()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [passwordRepeat, setpasswordRepeat] = useState("");

  interface SignUpData {
    email?: string;
    password?: string;
    fullname?: string;
    passwordRepeat?: string;
  }

  interface ExtendedSignUpData extends SignUpData {
    access_token: string;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
    e: FormEvent
  ) => {
    e.preventDefault();
    if (!email.length) {
      return toast.error("Please provide a valid email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Please provide a valid email");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase"
      );
    }
    if (!fullname) {
      return toast.error("Fullname must be provided");
    }
    if (fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters");
    }
    if (!passwordRepeat) {
      return toast.error("Repeat password must be provided");
    }
    if (passwordRepeat !== password) {
      return toast.error("Password and repeat password is different");
    }

    const signUpData = {
      email,
      password,
      fullname,
      passwordRepeat,
    } as SignUpData;
    sendAuthenticationRequest(`${apiRoute}/signup`, signUpData);
  };

  const sendAuthenticationRequest = (
    apiRoute: string,
    requestData: SignUpData
  ) => {
    axios
      .post(apiRoute, { requestData }, {withCredentials: true})
      .then((res) => {
        login(res.data);
        console.log(res.data)
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data.error);
      });
  };
  const handleGoogleAuth = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const usergoogle = (await authWithGoogle()) as any;
      if (usergoogle) {
        const requestData: ExtendedSignUpData = {
          access_token: usergoogle.accessToken,
        };
        sendAuthenticationRequest(apiRoute + "/google-auth", requestData);
        console.log(usergoogle);
      }
    } catch {
      toast.error("There is trouble with google");
    }
  };
  return user !== null? (
    <Navigate to="/editor" />
  ) : (
    <>
      <Navbar />
      <AnimationWrapper>
        <Toaster />
        <section className="h-cover flex justify-center items-center  ">
          <form
            className="w-[80%] max-w-[400px] mt-20 mx-auto flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4 w-full">
              <input
                type="text"
                placeholder="Fullname"
                className="py-3 px-3 rounded-md w-full bg-slate-100 border-2"
                name="fullname"
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
              ></input>
              <input
                type="email"
                placeholder="Email"
                className="py-3 px-3 rounded-md w-full bg-slate-100 border-2"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></input>
              <input
                type="password"
                placeholder="Password"
                className="py-3 px-3 rounded-md w-full bg-slate-100 border-2"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></input>
              <input
                type="password"
                placeholder="Repeat your password"
                className="py-3 px-3 rounded-md w-full bg-slate-100 border-2"
                name="passwordRepeat"
                onChange={(e) => {
                  setpasswordRepeat(e.target.value);
                }}
              ></input>
            </div>
            <Button type="submit" dark={true}>
              Sign Up
            </Button>
            <div className="mt-5 flex justify-between gap-5 items-center w-full">
              <hr className="w-[40%]" />
              <p>Or</p>
              <hr className="w-[40%]" />
            </div>
            <div className="w-full">
              <Button type="submit" onclick={handleGoogleAuth}>
                <div className="relative flex w-full justify-center gap-2 items-center">
                  <img src={googleIcon} alt="" className="left-2 w-[20px]" />
                  Continue with Google
                </div>
              </Button>

              <p className="mt-5 text-center">
                Already have an account?
                <Link to="/signin" className="underline cursor-pointer ml-2">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default Signup;
