
import React from 'react';
import { Bell, Search, Logs, CalendarDays } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
export default function page() {

    return (
        <>
            <div>
                <div className='flex justify-between items-center '>
                    <div className='grid justify-items-center content-center'>
                        <Bell size={40} strokeWidth={3} className='bg-primary/90 p-1 text-white/90 rounded-lg ' />
                        <h1 className='text-md font-bold text-primary'>Notification</h1>
                    </div>
                    <div className='flex content-center items-center'>
                        <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

                        </div>
                        <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

                        </div>
                    </div>
                </div>

                <div className='my-2'>
                    <h1 className='my-2'>Notification PAGE</h1>
                    <div className='grid'>
                        <div className='flex bg-primary/5 w-full h-[3rem] px-3 mb-2 rounded-md border border-primary/10 content-center items-center
                        
                        '>
                            <div className='flex'>
                                <Select>
                                    <SelectTrigger className="w-[130px] mr-1 border border-primary/20">
                                        <Logs size={24} strokeWidth={1} className="text-primary" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="dv">All Category</SelectItem>
                                            <SelectItem value="apple">Post</SelectItem>
                                            <SelectItem value="n">Assignment</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-[120px] mr-1 border border-primary/20 ">
                                        <CalendarDays size={24} strokeWidth={1} className="text-primary" />
                                        <SelectValue placeholder="Date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="dc">Last hour</SelectItem>
                                            <SelectItem value="r">Today</SelectItem>
                                            <SelectItem value="d">This week</SelectItem>
                                            <SelectItem value="banana">This month</SelectItem>
                                            <SelectItem value="dd">This year</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant='default'
                                    size='icon'
                                    className='mr-1'
                                ><Search size={28} strokeWidth={3} /></Button>
                            </div>
                        </div>
                        <div className='grid w-full h-[5rem] p-2 mb-2 bg-primary/15 rounded-md border border-primary/20 space-x-3 transition ease-in-out delay-50  
                        hover:bg-primary/30 hover:cursor-pointer'>
                            <div className='flex justify-between'>
                                <div className='flex justify-center items-center h-[1.5rem]'>
                                    <div className='w-[2rem] h-[2rem] bg-background rounded-full mr-2'></div>
                                    <p className='text-sm text-primary'>User1</p>
                                </div>
                                <div className='flex justify-center items-center h-[1.5rem]'>
                                    <p className='text-sm mr-2'>Post</p>
                                    <p className='text-sm text-primary mr-2'>to day</p>
                                </div>

                            </div>

                            <div className='flex justify-start overflow-hidden'>
                                <p className='text-sm p-2 '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt reprehenderit perspiciatis alias aliquam dolor, temporibus magnam odio dolorum! Dolores, tempora!</p>
                            </div>
                        </div>

                        <div className='grid w-full h-[5rem] p-2 mb-2 bg-primary/15 rounded-md border border-primary/20 space-x-3 transition ease-in-out delay-50  
                        hover:bg-primary/30 hover:cursor-pointer'>
                            <div className='flex justify-between'>
                                <div className='flex justify-center items-center h-[1.5rem]'>
                                    <div className='w-[2rem] h-[2rem] bg-background rounded-full mr-2'></div>
                                    <p className='text-sm text-primary'>User2</p>
                                </div>
                                <div className='flex justify-center items-center h-[1.5rem]'>
                                    <p className='text-sm mr-2'>Assignment</p>
                                    <p className='text-sm text-primary mr-2'>this week</p>
                                </div>

                            </div>

                            <div className='flex justify-start overflow-hidden'>
                                <p className='text-sm p-2 '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt reprehenderit perspiciatis alias aliquam dolor, temporibus magnam odio dolorum! Dolores, tempora!</p>
                            </div>
                        </div>
                    </div>
                </div>



            </div>

        </>
    )
}
