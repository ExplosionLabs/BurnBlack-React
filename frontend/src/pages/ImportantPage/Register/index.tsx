import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useNavigate } from "react-router-dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest, registerSuccess, registerFailure,googleLoginRequest, googleLoginSuccess, googleLoginFailure } from '../../../stores/userSlice';
import { registerUser, registerUserWithGoogle } from '../../../api/userApi';
import { RootState } from '../../../stores/store';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

function Main() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirmation) {
      alert("Passwords don't match!");
      return;
    }

    const userData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    };

    dispatch(registerRequest());

    try {
      const response = await registerUser(userData);
      dispatch(registerSuccess(response));
      alert('Registration successful!');
      navigate("/fileITR")
    } catch (error: any) {
      dispatch(registerFailure(error));
      alert('Registration failed. Please try again.');
    }
  };

  function decodeJwt(token: string) {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT (the second part)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL-safe base64
    const decoded = atob(base64); // Decode the Base64 string
    return JSON.parse(decoded); // Parse and return the JSON payload
  }
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      alert('Google Sign-In failed! No credential received.');
      return;
    }

    dispatch(googleLoginRequest());
    try {
      const response = await registerUserWithGoogle({ token: credentialResponse.credential });
      dispatch(googleLoginSuccess(response));
      alert('Login successful!');
      setTimeout(() => {
        navigate("/fileITR");
      }, 2000);
    } catch (error) {
      console.error("Error during Google login:", error);
      dispatch(googleLoginFailure(error instanceof Error ? error.message : 'Unknown error'));
      alert('Google Sign-In failed!');
    }
  };


  const handleGoogleLoginFailure = () => {
    dispatch(googleLoginFailure('Google Sign-In was unsuccessful.'));
    alert('Google Sign-In failed!');
  };

  return (
    <>
      <div
        className={clsx([
          "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <ThemeSwitcher />
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Register Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="ml-3 text-lg text-white"> BurnBlack </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  A few more clicks to <br />
                  sign up to your account.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div>
              </div>
            </div>
            {/* END: Register Info */}
            {/* BEGIN: Register Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Sign Up
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                  A few more clicks to sign in to your account. Manage all your
                  e-commerce accounts in one place
                </div>
                <div className="mt-8 intro-x">
                  <FormInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                    placeholder="Name"
                  />
                  <FormInput
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                    placeholder="Phone No"
                  />
                  <FormInput
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                    placeholder="Email"
                  />
                  <FormInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                    placeholder="Password"
                  />
                  <div className="grid w-full h-1 grid-cols-12 gap-4 mt-3 intro-x">
                    <div className="h-full col-span-3 rounded bg-success"></div>
                    <div className="h-full col-span-3 rounded bg-success"></div>
                    <div className="h-full col-span-3 rounded bg-success"></div>
                    <div className="h-full col-span-3 rounded bg-slate-100 dark:bg-darkmode-800"></div>
                  </div>
                  <FormInput
                    type="password"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleInputChange}
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                    placeholder="Password Confirmation"
                  />
                </div>
                <div className="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                  <FormCheck.Input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border"
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    I agree to the Envato
                  </label>
                  <a className="ml-1 text-primary dark:text-slate-200" href="">
                    Privacy Policy
                  </a>
                  .
                </div>
                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button
                    variant="primary"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                  <Button
                  onClick={()=>{
                    navigate("/login")
                  }}
                    variant="outline-secondary"
                    className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            </div>
            <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          useOneTap
        />
            {/* END: Register Form */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
