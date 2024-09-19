import React from 'react'
import { LayoutDashboard } from "lucide-react";
import { Search, Logs, CalendarDays } from "lucide-react";
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
                        <LayoutDashboard size={40} strokeWidth={3} className='bg-primary/90 p-1 text-white/90 rounded-lg ' />
                        <h1 className='text-md font-bold text-primary'>Dashboard</h1>

                    </div>
                    <div className='flex content-center items-center'>
                        <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

                        </div>
                        <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

                        </div>
                    </div>
                </div>
                <div className='my-2'>
                    <h1 className='my-2'>Dashboard PAGE</h1>

                    <div className='flex w-full bg-primary/5 p-2 rounded-md border border-primary/10'>
                        <Select>
                            <SelectTrigger className="w-[130px] mr-1 border border-primary/20">
                                <Logs size={24} strokeWidth={1} className="text-primary" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="allCategory">All Category</SelectItem>
                                    <SelectItem value="apple">Post</SelectItem>
                                    <SelectItem value="banana">Assignment</SelectItem>
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
                                    <SelectItem value="allCategory">Last hour</SelectItem>
                                    <SelectItem value="apple">Today</SelectItem>
                                    <SelectItem value="d">This week</SelectItem>
                                    <SelectItem value="banana">This month</SelectItem>
                                    <SelectItem value="banana">This year</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            variant='default'
                            size='icon'
                            className='mr-1'
                        ><Search size={28} strokeWidth={3} /></Button>
                    </div>

                    <div className='flex justify-around items-start'>

                    </div>
                </div>



            </div>
        </>
    )
}
