
"use client"
import { ReactNode } from 'react';
import { ThemeColorToggle } from '@/components/theme-color-toggle';
import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, 
    Users, 
    Bell, 
    ListPlus,
 } from "lucide-react";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    DialogTitle,
  } from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetTrigger,

} from "@/components/ui/sheet"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import Image from 'next/image';
// import Logo from "@/image/tesla_logo.png";

export default function LoginAndRegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const {data: session} = useSession();
    console.log(session);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // ตรวจสอบว่าหน้าจอเป็นมือถือหรือไม่
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // เรียกใช้ทันทีเมื่อโหลดครั้งแรก

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className="flex h-screen ">

            {!isMobile ? (
                <div className='h-full w-[8rem] relative grid content-start justify-items-center '>
                    <div className='w-[4rem] h-[4rem] p-2 bg-primary/50 rounded-xl mt-20 relative'>
                        {/* <Image
                            src={Logo}
                            alt="LOGO"
                            layout="fill"   // ทำให้ภาพเต็ม div
                            // objectFit="cover"  // ให้ภาพคงสัดส่วนและครอบคลุมพื้นที่
                            className="rounded-3xl absolute"  // ถ้าต้องการให้ขอบของภาพโค้งตาม div
                        /> */}
                    </div>
                    <div className='p-3  sticky top-[10rem] left-0 z-40  grid content-evenly h-[15rem]'>
                        <div className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                            <Link href={"/classroom/dashboard"} className='grid content-start justify-items-center'>
                                <LayoutDashboard size={45} strokeWidth={3} className='bg-primary/90 p-2 text-white/90 rounded-lg border-4 border-secondary/100' />
                                <p className='text-[12px] text-primary font-bold'>Dashboard</p>
                            </Link>
                        </div>
                        <div className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                            <Link href={"/classroom/group"} className='grid content-start justify-items-center'>
                                <Users size={45} strokeWidth={3} className='bg-primary/90 p-2 text-white/90 rounded-lg border-4 border-secondary/100' />
                                <p className='text-[12px] text-primary font-bold'>Group</p>
                            </Link>

                        </div>
                        <div className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                            <Link href={"/classroom/notification"} className='grid content-start justify-items-center'>
                                <Bell size={45} strokeWidth={3} className='bg-primary/90 p-2 text-white/90 rounded-lg border-4 border-secondary/100' />
                                <p className='text-[12px] text-primary font-bold'>Notification</p>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-2 w-[2.1rem]">
                    <div className="grid grid-cols-2 gap-2">
                        <Sheet>
                            <SheetTrigger asChild >
                                <Button variant="outline" size="icon" className='text-primary'>
                                    <ListPlus size={24} strokeWidth={2} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='left' className="w-[150px] sm:w-full">
                                <VisuallyHidden>
                                    <DialogTitle>Title</DialogTitle>
                                </VisuallyHidden>
                                <div className=" p-5  rounded-r-[0.5rem]  shadow-primary/15 ">
                                    <div className='h-full grid content-start justify-items-start'>
                                        <div className='w-[4rem] h-[4rem] p-5 mt-5 bg-primary/50 rounded-xl relative'>
                                            {/* <Image
                                                src={Logo}
                                                alt="LOGO"
                                                layout="fill"   // ทำให้ภาพเต็ม div
                                                // objectFit="cover"  // ให้ภาพคงสัดส่วนและครอบคลุมพื้นที่
                                                className="rounded-3xl absolute "  // ถ้าต้องการให้ขอบของภาพโค้งตาม div
                                            /> */}
                                        </div>
                                        <div className='grid content-evenly h-[15rem]'>
                                            <div className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                                                <Link href={"/classroom/dashboard"} className='grid content-start justify-items-center '>
                                                    <LayoutDashboard size={45} strokeWidth={3} className='bg-primary/90 p-2 text-white/90 rounded-lg border-4 border-secondary/100' />
                                                    <p className='text-[12px] font-bold  p-[1px] mt-1 rounded-sm'>Dashboard</p>
                                                </Link>
                                            </div>
                                            <div className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                                                <Link href={"/classroom/group"} className='grid content-start justify-items-center'>
                                                    <Users size={45} strokeWidth={3} className='bg-primary/90 p-2 text-white/90 rounded-lg border-4 border-secondary/100' />
                                                    <p className='text-[12px] font-bold  p-[1px] mt-1 rounded-sm'>Group</p>
                                                </Link>

                                            </div>
                                            <div className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                                                <Link href={"/classroom/notification"} className='grid content-start justify-items-center'>
                                                    <Bell size={45} strokeWidth={3} className='bg-primary/90 p-2 text-white/90 rounded-lg border-4 border-secondary/100' />
                                                    <p className='text-[12px] font-bold  p-[1px] mt-1 rounded-sm'>Notification</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>


            )}
            <div className='h-[90%] w-[100%] relative '>
                <div className='p-3 flex justify-end sticky top-0 right-0 z-40'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100'>
                            <Avatar>
                                <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Oa1h93KQBASHslY1BS1lvb1h-9pLy4c1Dw&s" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Name</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className='flex mx-2 '>
                        <ThemeColorToggle />
                        <ThemeModeToggle />
                    </div>

                </div>

                <div className='h-full w-[100%] rounded-l-[2rem] bg-primary/5 py-1 px-4 shadow-primary/15 
                overflow-auto touch-auto border-4  border-secondary/20'>
                    {children}
                </div>
            </div>

        </div>

    );
}

