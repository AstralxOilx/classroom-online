import React from 'react'
import { UserPlus, Users, CirclePlus, Plus } from "lucide-react";
import { Search, CalendarDays } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
export default function page() {
  const items = Array.from({ length: 1 }, (_, index) => index);
  return (
    <>
      <div>
        <div className='grid justify-items-start content-center'>
          <div className='grid justify-items-center content-center'>
            <Users size={40} strokeWidth={3} className='bg-primary p-1 text-white/90 rounded-lg ' />
            <h1 className='text-md font-bold text-primary'>Group</h1>
            <h1 className='my-2'>GROUP PAGE</h1>
          </div>
        </div>
        
        <div className='grid justify-end items-between'>
          <div className='flex content-center items-center'>
            <Dialog>
              <DialogTrigger className='space-x-3 transition ease-in-out delay-50  hover:scale-110 duration-100 hover:cursor-pointer '>
                <div className='flex content-center items-center bg-primary/70 p-1 rounded-xl mr-4  border-2 border-secondary/100'>
                  <UserPlus size={28} strokeWidth={3} className='bg-secondary/90 p-1 text-primary/90 rounded-lg mr-1 ' />
                  <h1 className='text-white/90 text-sm flex'>create room <Plus size={20} strokeWidth={1} /></h1>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger className='space-x-3 transition ease-in-out delay-50  hover:scale-110 duration-100 hover:cursor-pointer'>
                <div className='flex content-center items-center bg-primary/70 p-1 rounded-xl mr-4  border-2 border-secondary/100'>
                  <CirclePlus size={28} strokeWidth={3} className='bg-secondary p-1 text-primary/90 rounded-lg mr-1 ' />
                  <h1 className='text-white/90 text-sm flex'>join room <Plus size={20} strokeWidth={1} /></h1>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

          </div>
        </div>


        <div className='my-2'>


          <div className='flex w-full bg-primary/5 p-2 rounded-md  border-2 border-secondary/100'>

            <Select>
              <SelectTrigger className="w-[120px] mr-1  border-2 border-secondary/100 ">
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
            <div className="grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-10 p-3 ">
              {items.map((item, index) => (
                <Link href={"/classroom/room/1"}>
                  <div
                    key={index}
                    className="w-[8rem] h-[8rem] bg-primary/20 rounded-md flex justify-around items-center 
                    space-x-3 transition ease-in-out delay-50  hover:scale-110 duration-100 hover:cursor-pointer
                     border-2 border-secondary/100
                    "
                  >
                    <div className='grid justify-items-center content-center '>
                      <div className='w-[4rem] h-[4rem] bg-white rounded-md'>

                      </div>
                      <p>class name</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
