import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/animation";
import { authWithGoogle } from "../common/firebase";
import googleIcon from "../../images/google.png";
import Navbar from "../components/Navbar/Navbar";
import Button from "../components/Input/Button";
import { emailRegex, passwordRegex } from "../common/regex";
import { useAppContext } from "../contexts/useAppContext";

const Signin = () => {
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  interface SignInData {
    email?: string;
    password?: string;
  }

  interface ExtendedSignInData extends SignInData {
    access_token: string;
  }

  const {user, login} = useAppContext()

  //const auth = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (
    e: FormEvent,
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
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase",
      );
    }
    const signinData = { email, password } as SignInData;
    sendAuthenticationRequest(`${apiRoute}/signin`, signinData);
  };

  const handleGoogleAuth = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (await authWithGoogle()) as any;
      if (user) {
        const requestData: ExtendedSignInData = {
          access_token: user.accessToken,
        };
        sendAuthenticationRequest(apiRoute + "/google-auth", requestData);
        console.log(user);
      }
    } catch {
      toast.error("There is trouble with google");
    }
  };

  const sendAuthenticationRequest = (
    apiRoute: string,
    requestData: SignInData,
  ) => {
    axios
      .post(apiRoute, { requestData }, { withCredentials: true })
      .then((res) => {
        //auth.login(res.data);
        login(res.data)
      })
      .catch((e) => {
        toast.error(e.response.data.error);
      });
  };

  useEffect(()=>{
    console.log(user)
  }, [user])

  return user !== null ? (
    <Navigate to="/" />
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
            </div>
            <a className="text-xs mt-4 w-full px-1 text-right underline cursor-pointer">
              Forgot your password?
            </a>
            <Button type="submit" dark={true}>
              Sign In
            </Button>
            <div className="mt-5 flex justify-between gap-3 items-center w-full">
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
                Don't have an account?
                <Link to="/signup" className="underline cursor-pointer ml-2">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default Signin;
