import React from 'react'
import { University } from "lucide-react";

import { Button } from '@/components/ui/button';


export default function Page({ params }: { params: { slug: string } }) {
  // My Room: {params.slug}
  return (
    <>

      <div>
        <div className='flex justify-between items-center '>
          <div className='grid justify-items-center content-center'>
            <University size={40} strokeWidth={3} className='bg-primary/90 p-1 text-white/90 rounded-lg ' />
            <h1 className='text-md font-bold text-primary'> Class Room </h1>
            
          </div>
          <div className='flex content-center items-center'>
            <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

            </div>
            <div className='flex content-center items-center bg-primary/25 p-1 rounded-xl mr-1'>

            </div>
          </div>
        </div>
        <div className='my-2'>
          <h1 className='my-2'> My Room: {params.slug}</h1>

          <div className='flex w-full bg-primary/5 p-2 rounded-md border-4 border-secondary/100'>

          </div>

          <div className='flex justify-around items-start'>

          </div>
        </div>



      </div>

    </>
  )
}