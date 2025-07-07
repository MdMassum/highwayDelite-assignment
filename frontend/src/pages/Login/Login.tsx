import React, { useState, useEffect } from 'react';
import bgImg from '../../assets/bgImg.jpg';
import logo from '../../assets/icon.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../../redux/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login: React.FC = () => {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // verify otp and login
  const handleLogin = async() => {
    
    if(!email || !otp){
      toast.error("Email or Otp cannote be empty!!");
      return;
    }
    setLoading(true);
    try {
      dispatch(signInStart());

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/verify-otp/login`, {
        email,
        otp,
      },{withCredentials:true});

      if(response.data.success === false){
        dispatch(signInFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      dispatch(signInSuccess(response.data.user))
      console.log("Login Success:", response.data);
      toast.success("Login Success");
      navigate('/home')

    } catch (err:any) {
      console.error("Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
      dispatch(signInFailure(err.response?.data?.message))
    } finally {
      setLoading(false);
    }
  };

  // send otp
  const handleSendOtp = async() => {

    if(!email){
      toast.error("Email cannot be empty!!");
      return;
    }
    setOtpSent(true);
    setTimer(60);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/request-otp/login`, {
        email,
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
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Sign in</h1>
          <p className="mb-6 text-gray-500 text-center md:text-left">
            Please login to continue to your account.
          </p>

          {/* Email input */}
          <Input
            label="Email"
            type="email"
            placeholder="jonas_kahnwald@gmail.com"
            disabled={otpSent || loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* OTP input */}
          {otpSent && (
            <Input
              label="OTP"
              type="password"
              placeholder="Enter OTP"
              value={otp}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}

          {/* Send/Resend OTP button */}
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!email || timer > 0 || loading}
            className={`text-sm mb-4 ${
              timer > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:underline'
            }`}
          >
            {otpSent ? (timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP') : 'Send OTP'}
          </button>

          {/* Remember me & Submit */}
          <div className="flex items-center mb-4">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm">
              Keep me logged in
            </label>
          </div>

          <Button type="button" fullWidth={true} onClick={handleLogin} disabled={loading}>
            Sign In
          </Button>

          {/* Create Account */}
          <p className="text-sm mt-4 text-center md:text-left">
            Need an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img src={bgImg} alt="background" className="object-cover w-full h-full" />
      </div>
    </div>
  );
};

export default Login;
