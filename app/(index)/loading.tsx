
import React from 'react';
import { Loader } from "lucide-react";

export default function Loading() {

    return (
        <>
            <div className='animate-pulse'>
                <div className='flex justify-between items-center animate-pulse space-x-4'>
                    <div className='grid justify-items-center content-center'>
                        <div className='bg-primary/90 p-1 text-white/90 rounded-lg w-[40px] h-[40px] animate-pulse' ></div>
                        <h1 className='text-sm text-primary'>Loading...</h1>
                    </div>
                    <div className='flex content-center items-center animate-pulse'>
                        <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

                        </div>
                        <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

                        </div>
                    </div>
                </div>

                <div className='my-2 animate-pulse'>
                    <h1 className='my-2'></h1>
                    <div className='grid'>
                        <div className='flex bg-primary/5 w-full h-[3rem] px-3 mb-2 rounded-md border border-primary/10 content-center items-center
                        
                        '>


                            <Loader className="animate-spin h-5 w-5 mr-3 " />


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
