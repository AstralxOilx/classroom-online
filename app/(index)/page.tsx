"use client"
import React, { useState } from 'react';
import InputField from '@/components/ui/input-field';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { LogIn, Eye, EyeOff } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';


export default function SignUp() {

    const router = useRouter();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [message, setMessage] = useState<string[]>(Array(6).fill(''));
    const [notificationBox, setNotificationBox] = useState('');

    const updateItemAtIndex = (index: number, value: string) => {
        if (index < 0 || index >= message.length) {
            console.error('Index out of bounds');
            return;
        }

        setMessage(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[index] = value;
            return newMessages;
        });
    };

    const isValidEmail = (email: string): boolean => {
        // ใช้ regular expression ตรวจสอบรูปแบบอีเมล
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string): boolean => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return regex.test(password);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                if (isValidEmail(value)) {
                    setEmail(value);
                    updateItemAtIndex(0, '');
                } else {
                    updateItemAtIndex(0, 'Please provide a valid email format. example(example@Email.com).');
                }
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.warn(`email :${email} password : ${password}`);

      
        if (email && password) {
            try {
                const response = await axios.post('/api/sign_in', {
                    email: email,
                    password: password,
                });
                router.push("/");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const statusAPI = error.response?.status;
                    const messageAPI = error.response?.data?.error || 'An unexpected error occurred';


                    updateItemAtIndex(1, `Error ${statusAPI}: ${messageAPI}`);
                    setNotificationBox('text-md text-rose-600 bg-primary/20 p-5 rounded-md font-bold');
                    updateItemAtIndex(0,'');

                } else {

                    updateItemAtIndex(1, 'An unexpected error occurred');
                    setNotificationBox('text-md text-rose-600 bg-primary/20 p-5 rounded-md font-bold');

                }
            }
        } else {
            setIsModalOpen(false);
            updateItemAtIndex(1, 'Please fill in the information correctly.');
            setNotificationBox('text-md text-rose-600 bg-primary/20 p-5 rounded-md font-bold');
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
              <p className={notificationBox}>{message[1]}</p>
              <form method="post">
                <InputField onChange={handleChange} type='email' label='email' variant='floating' name='email' id='email' icon='mail' />
                <p className={'text-sm text-rose-600 font-bold'}>{message[0]}</p>
                <div className='relative'>
                                <InputField
                                    onChange={handleChange}
                                    type={isShowPassword ? 'text' : 'password'}
                                    label='Password'
                                    variant='floating'
                                    name='password'
                                    id='password'
                                    icon='password'
                                />
                                <button
                                    type="button"
                                    onClick={() => { isShowPassword ? setIsShowPassword(false) : setIsShowPassword(true); }}
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
