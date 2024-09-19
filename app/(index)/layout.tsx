
import { ReactNode } from 'react';
import { ThemeColorToggle } from '@/components/theme-color-toggle';
import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginAndRegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className=''>
            <nav className=' sticky top-0 z-10 backdrop-opacity-100 backdrop-saturate-125 bg-primary/10 backdrop-blur-xl
            flex justify-between items-center h-full w-[100%] p-2 border-b-2 border-secondary/50 
            
            ' >
                <div className='w-[3rem] h-[3rem] p-2 bg-primary/50 rounded-xl relative'>
                    {/* <Image
                src={Logo}
                alt="LOGO"
                layout="fill"   // ทำให้ภาพเต็ม div
                // objectFit="cover"  // ให้ภาพคงสัดส่วนและครอบคลุมพื้นที่
                className="rounded-3xl absolute"  // ถ้าต้องการให้ขอบของภาพโค้งตาม div
            /> */}
                </div>
                <div className='flex'>
                    <div className='flex p-1'>
                        <div className='mr-1 h-[2rem] flex justify-center items-center text-sm  px-3 border-2 rounded-md space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100 
                bg-primary/90 text-white border-primary/20 '>
                            <Link href={"/"}>Sign in</Link>
                        </div>
                        <div className='flex h-[2rem] justify-center items-center text-sm  px-3 rounded-md space-x-3 transition ease-in-out delay-50  hover:scale-110  duration-100 
                 border-2 border-primary/20 '>
                            <Link href={"/sign_up"}>Sign up</Link>
                        </div>
                    </div>
                    <div className=''>
                        <ThemeColorToggle />
                    </div>
                    <div className=''>
                        <ThemeModeToggle />
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}

