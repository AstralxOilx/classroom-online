"use client"
import React, { useState } from 'react';
import InputField from '@/components/ui/input-field';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { LogIn, Eye, EyeOff } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');


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

    const isValidName = (name: string): boolean => {
        const regex = /^.{1,30}$/;
        return regex.test(name);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                if (isValidName(value)) {
                    setUsername(value);
                    updateItemAtIndex(0, '');
                } else {
                    updateItemAtIndex(0, 'Name must be between 1 and 30 characters long.');
                }
            case 'email':
                if (isValidEmail(value)) {
                    setEmail(value);
                    updateItemAtIndex(1, '');
                } else {
                    updateItemAtIndex(1, 'Please provide a valid email format. example(example@Email.com).');
                }
            case 'password':
                if (isValidPassword(value)) {
                    setPassword(value);
                    updateItemAtIndex(2, '');
                } else {
                    updateItemAtIndex(2, 'Must contain 8 characters (A-Z),(a-z),(0-9) special characters(e.g. !, @, #, $) example(MySecure@123).');
                }
            case 'confirmPassword':
                setConfirmPassword(value);
        }
    }
    const handleSelectChange = (value: string) => {
        setRole(value);
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.warn(`userName :${username} email :${email} password : ${password} confirmPassword :${confirmPassword} role :${role}`);

        confirmPassword === password ? updateItemAtIndex(3, '') : updateItemAtIndex(3, 'Passwords do not match.');
        role ? updateItemAtIndex(4, '') : updateItemAtIndex(4, 'Please specify role.');

        if (username && email && password && role) {
            try {
                const response = await axios.post('/api/sign_up', {
                    username: username,
                    email: email,
                    password: password,
                    role: role
                });
                router.push("/");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const statusAPI = error.response?.status;
                    const messageAPI = error.response?.data?.error || 'An unexpected error occurred';


                    updateItemAtIndex(5, `Error ${statusAPI}: ${messageAPI}`);
                    setNotificationBox('text-md text-rose-600 bg-primary/20 p-5 rounded-md font-bold');
                    updateItemAtIndex(0,'');
                    updateItemAtIndex(1,'');
                    updateItemAtIndex(2,'');
                    updateItemAtIndex(3,'');
                    updateItemAtIndex(4,'');

                } else {

                    updateItemAtIndex(5, 'An unexpected error occurred');
                    setNotificationBox('text-md text-rose-600 bg-primary/20 p-5 rounded-md font-bold');

                }
            }
        } else {
            setIsModalOpen(false);
            updateItemAtIndex(5, 'Please fill in the information correctly.');
            setNotificationBox('text-md text-rose-600 bg-primary/20 p-5 rounded-md font-bold');
        }
    };

    return (
        <>
            <div className='p-10'>
                <div className='w-full h-full grid justify-center items-center'>
                    <div className='grid 2xl:w-[50rem] xl:w-[40rem] lg:w-[35rem] md:w-[30rem] sm:w-[20rem] w-[23rem] h-full items-start p-3'>
                        <div className='bg-primary/5 p-3 rounded-md'>
                            <div className='bg-primary/10 w-[100%] h-[15rem] grid justify-center items-center mb-5'>
                                <div className='bg-primary/10 w-[20rem] h-[100%]'></div>
                            </div>
                            <p className={notificationBox}>{message[5]}</p>

                            <InputField onChange={handleChange} type='text' label='username' variant='floating' name='username' id='username' />
                            <p className={'text-sm text-rose-600 font-bold'}>{message[0]}</p>
                            <InputField onChange={handleChange} type='email' label='email' variant='floating' name='email' id='email' icon='mail' />
                            <p className={'text-sm text-rose-600 font-bold'}>{message[1]}</p>
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
                                <p className={'text-sm text-rose-600 font-bold'}>{message[2]}</p>
                                <button
                                    type="button"
                                    onClick={() => { isShowPassword ? setIsShowPassword(false) : setIsShowPassword(true); }}
                                    className='absolute right-2 top-2'
                                >
                                    {isShowPassword ? <Eye size={24} className='text-primary/50' /> : <EyeOff size={24} className='text-primary/50' />}
                                </button>
                            </div>
                            <div className='relative'>
                                <InputField
                                    onChange={handleChange}
                                    type={isShowConfirmPassword ? 'text' : 'password'}
                                    label='confirmPassword'
                                    variant='floating'
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    icon='password'
                                />

                                <p className={'text-sm text-rose-600 font-bold'}>{message[3]}</p>
                                <button
                                    type="button"
                                    onClick={() => { isShowConfirmPassword ? setIsShowConfirmPassword(false) : setIsShowConfirmPassword(true); }}
                                    className='absolute right-2 top-2'
                                >
                                    {isShowConfirmPassword ? <Eye size={24} className='text-primary/50' /> : <EyeOff size={24} className='text-primary/50' />}
                                </button>
                            </div>

                            <div className='flex mt-5'>
                                <Select onValueChange={handleSelectChange} name='role'>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className={'text-sm text-rose-600 font-bold'}>{message[4]}</p>


                            <div>
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <div className='flex justify-center items-center w-[9rem] py-[6px] text-white rounded-sm bg-primary hover:bg-primary/90 hover:cursor-pointer my-5'>
                                            <LogIn />
                                            Sign up
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
                            </div>

                            <p className='text-md mt-1'>You already have an account. <Link href={"/"} className='text-primary/80 underline'>signed in</Link> now.</p>




                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
