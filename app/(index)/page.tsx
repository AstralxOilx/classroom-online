"use client"
import React, { useState } from 'react';
import InputField from '@/components/ui/input-field';
import Link from 'next/link';
import { LogIn, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';


export default function Page() {

  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [mailValue, setMailValue] = useState('');
  const [userPasswordValue, setUserPasswordValue] = useState('');
  const [mailError, setMailError] = useState('');
  const [userPasswordError, setUserPasswordError] = useState('');
  const [messageInputEmailClass, setMessageInputEmailClass] = useState('');
  const [messageInputPasswordClass, setMessageInputPasswordClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');

  const toggleShowPassword = () => {
    setIsShowPassword(prev => !prev);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'email') {
      setMailValue(value);
      validateEmail(value) ? handleEmailValid() : handleEmailInvalid();
    }
    if (name === 'password') {
      setUserPasswordValue(value);
      validatePassword(value) ? handlePasswordValid() : handlePasswordInvalid();
    }
  };

  const handleEmailValid = () => {
    setMailError('It works.');
    setMessageInputEmailClass('text-sm text-green-500 mb-6');
  };

  const handleEmailInvalid = () => {
    setMailError('Please provide a valid email format.');
    setMessageInputEmailClass('text-sm text-rose-500 mb-6');
  };

  const handlePasswordValid = () => {
    setMessageInputPasswordClass('text-sm text-green-500 mb-6');
    setUserPasswordError('It works.');
  };

  const handlePasswordInvalid = () => {
    setMessageInputPasswordClass('text-sm text-rose-500 mb-6');
    setUserPasswordError('Please provide a valid password format. example(Password58) Minimum 6 characters.');
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const isEmailValid = validateEmail(mailValue);
    const isPasswordValid = validatePassword(userPasswordValue);

    if (!isEmailValid) {
      handleEmailInvalid();
    }

    if (!isPasswordValid) {
      handlePasswordInvalid();
    }

    // หากทั้งอีเมลและรหัสผ่านถูกต้อง
    if (isEmailValid && isPasswordValid) {

      try {
        const response = await axios.post('/api/sign_in', {
          email: mailValue,
          password: userPasswordValue,
        });
        
        router.push("/classroom/dashboard")
        setIsModalOpen(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // ตรวจสอบว่าเป็นข้อผิดพลาดจาก Axios
          if (error.response) {
            // ข้อผิดพลาดที่เกิดจากการตอบสนองของเซิร์ฟเวอร์
            if (error.response.status === 404) {
              setMailError('Conflict error: Email not found  exists.');
              setMessageInputEmailClass('text-sm text-rose-500 mb-6');
            }
            else if (error.response.status === 400) {
              setMessage('Conflict error:Missing required fields.');
              setMessageClass('text-md text-rose-500 mb-6 p-1 bg-primary/20');
            } else if (error.response.status === 401) {
              setUserPasswordError('Invalid password.');
              setMessageInputPasswordClass('text-sm text-rose-500 mb-6');
            } else {
              // setSignStatus(`Server responded with status ${error.response.status}: ${error.response.data}`);
              setMessage('Error.');
              setMessageClass('text-md text-rose-500 mb-6 p-1 bg-primary/20');
            }
          } else if (error.request) {
            // ข้อผิดพลาดที่เกิดจากการร้องขอ (Request) 
            setMessage('No response received from server.');
            setMessageClass('text-md text-rose-500 mb-6 p-1 bg-primary/20');
          } else {
            // ข้อผิดพลาดที่เกิดจากการตั้งค่าหรือการทำงานของ Axios เอง
            // setSignStatus(`Axios error: ${error.message}`);
            setMessage('Error.');
            setMessageClass('text-md text-rose-500 mb-6 p-1 bg-primary/20');
          }
        } else {
          // ข้อผิดพลาดทั่วไปที่ไม่เกี่ยวข้องกับ Axios
          // setSignStatus(`Error: ${error}`);

          setMessage('Error.');
          setMessageClass('text-md text-rose-500 mb-6 p-1 bg-primary/20');
        }

        // setSignStatusClass('text-md p-1 text-rose-500 mb-6 bg-primary/20 w-full h-10 grid justify-items-start content-center rounded-md');
        setIsModalOpen(false);
      }

    } else {
      
      setMessage('Form is invalid.');
      setMessageClass('text-md text-rose-500 mb-6 p-1 bg-primary/20');
      setIsModalOpen(false);
    }




  };

  return (
    <>
      <div className='p-10 '>
        <div className='w-full h-full grid justify-center items-center'>
          <div className='grid 2xl:w-[50rem] xl:w-[40rem] lg:w-[35rem] md:w-[30rem] sm:w-[20rem] w-[23rem] h-full items-start p-3'>
            <div className='bg-primary/5 p-3 rounded-md'>
              <div className='bg-primary/10 w-[100%] h-[15rem] grid justify-center items-center mb-5'>
                <div className='bg-primary/10 w-[20rem] h-[100%]'></div>
              </div>
              <form method="post">
                <InputField onChange={handleChange} type='email' label='email' variant='floating' name='email' id='email' icon='mail' />
                <p className={messageInputEmailClass}>{mailError}</p>
                <div className='relative'>
                  <InputField
                    onChange={handleChange}
                    type={isShowPassword ? 'text' : 'password'}
                    label='Password'
                    variant='floating'
                    name='password'
                    id='password'
                  />
                  <p className={messageInputPasswordClass}>{userPasswordError}</p>
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className='absolute right-2 top-2'
                  >
                    {isShowPassword ? <Eye size={24} className='text-primary/50' /> : <EyeOff size={24} className='text-primary/50' />}
                  </button>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <div className='flex justify-center items-center w-[9rem] py-[6px] text-white mt-5
                    rounded-sm bg-primary hover:bg-primary/90 hover:cursor-pointer
                    '>
                      <LogIn />
                      Sign in
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        <Button variant='default' size='default' onClick={handleSubmit} className='ml-3 my-3'>OK</Button>
                        <Button variant='outline' onClick={() => setIsModalOpen(false)} className='ml-3 my-3'>Cancel</Button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <p className='text-md mt-1'>You haven't <Link href={"/sign_up"} className='text-primary/80 underline'>signed up</Link> yet, right?</p>

              </form>


            </div>
          </div>
        </div>
      </div>
    </>
  );
}
