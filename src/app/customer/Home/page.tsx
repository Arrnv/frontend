import React from 'react'
import Navbar from '@/components/Navbar'
import Image from "next/image";

const page = () => {
  return (
    <>
     <Navbar/>
     <section className='flex flex-row h-[35rem] ml-[6rem] mr-[1rem] gap-[1rem]'>
        <div className='flex flex-col gap-[3.5rem] w-2/5 justify-center px-[1rem] '>
            <h1 className='font-["Helvetica"] text-[3rem]/[3rem]'>
              <span className='text-[#e95800]'>FIND  </span>SERVICES <br/> FOR TRUCK <br/>DRIVERS & FLEETS
            </h1>
            <p className='text-sm text-gray-400'> 
            Become a part of an innovative and feature-rich service with over 450K points of interest for truckers nationwide
            </p>
        </div>
        <div className="h-full w-3/5 relative">
            <Image
                src="/main-img.webp"
                alt="Main illustrative banner or visual for TruckNav"
                fill
                className="object-contain object-center"
                priority 
            />
        </div>
     </section>  
    </>
  )
}

export default page