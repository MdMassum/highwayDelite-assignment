import React, { useState, useEffect } from "react";
import bgImg from "../../assets/bgImg.jpg";
import logo from "../../assets/icon.png";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../../redux/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async() => {
    if (!otpSent) {
      sendOtp();
    } else {
      if(!email || !otp){
        toast.error("Email or Otp cannote be empty!!");
        return;
      }
      setLoading(true);
      try {
        dispatch(signInStart());

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/verify-otp/signup`,
          {
            email,
            otp,
          },
          { withCredentials: true }
        );

        if (response.data.success === false) {
          dispatch(signInFailure(response.data.message));
          toast.error(response.data.message);
          return;
        }
        dispatch(signInSuccess(response.data.user));
        toast.success("Signup Success");
        navigate("/home");
      } catch (err: any) {
        console.error("Login Error:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "An error occurred");
        dispatch(signInFailure(err.response?.data?.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const sendOtp = async() => {
    if(!name || !email || !dob){
      toast.error("Name, Email or Dob cannote be empty!!");
      return;
    }
    setOtpSent(true);
    setTimer(60); 

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/request-otp/signup`, {
        name,
        email,
        dob
      },{withCredentials:true});

      if(response.data.success === false){
        toast.error(response.data.message);
        return;
      }
      console.log("Otp Sent Success:", response.data);
      toast.success("Otp Sent Successfully");

    } catch (err:any) {
      console.error("Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");

    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      sendOtp();
    }
  };

  useEffect(() => {
    let countdown: ReturnType<typeof setTimeout>;

    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: form */}
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex gap-2 p-6 items-center justify-center md:justify-start">
          <img src={logo} alt="logo" className="h-5 w-5" />
          <p className="font-semibold text-lg">HD</p>
        </div>
        <div className="w-full max-w-full justify-center items-center px-6 md:px-20">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            Sign Up
          </h1>
          <p className="mb-6 text-gray-500 text-center md:text-left">
            Sign up to enjoy the feature of HD.
          </p>

          {/* Name input */}
          <Input
            label="Your Name"
            type="text"
            placeholder="Jonas Kahnwald"
            disabled={otpSent || loading}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* DOB input */}
          <Input
            label="Date of Birth"
            type="date"
            disabled={otpSent || loading}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          {/* Email input */}
          <Input
            label="Email"
            type="email"
            placeholder="jonas_kahnwald@gmail.com"
            disabled={otpSent || loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* OTP input (after OTP sent) */}
          {otpSent && (
            <>
              <Input
                label="OTP"
                type="password"
                placeholder="Enter OTP"
                value={otp}
                disabled={loading}
                onChange={(e) => setOtp(e.target.value)}
              />

              {/* Resend OTP section */}
              <div className="mb-4 text-sm text-gray-600">
                {timer > 0 ? (
                  <span className="text-gray-400">Resend OTP in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          <Button type="button" fullWidth={true} onClick={handleSignup} disabled={loading}>
            {otpSent ? "Sign Up" : "Get OTP"}
          </Button>

          {/* Redirect to login */}
          <p className="text-sm mt-4 text-center md:text-left">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src={bgImg}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Signup;
