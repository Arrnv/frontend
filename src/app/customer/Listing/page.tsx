'use client'
import Footer from '@/components/Footer';
import ServiceNav from '@/components/ServiceNav';
import React, { Suspense } from 'react'

const page = () => {
  return (
    <>
    <Suspense fallback={<div>Loading navigation...</div>}>
        <ServiceNav selectedCategory={null}  onSelect={function (section: 'services' | 'places', subcategoryIds: string[]):void {
            throw new Error('Function not implemented.');
        } } />
        </Suspense>
        <section className="relative px-5 mt-10 md:px-30 rounded-3xl overflow-hidden mb-5 md:mb-16 text-[#202231] ">
          <div className="flex flex-col gap-5 md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-20 md:gap-10">
            
            <div className="w-full md:w-1/2 text-center md:text-left flex flex-col gap-5">
             <p className='text-sm text-[#56575B]'>EMPOWER YOUR BUSINESS WITH PathSure</p>
             <h1 className='text-3xl md:text-5xl'>DRIVE THE FUTURE
                OF BUSINESS
                SUCCESS
             </h1>
             <p className='text-sm md:text-lg'>Become a part of an innovative and feature-rich service
                that turns every truck driver into a valuable customer</p>
             <div>
             </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-[600px] aspect-[3/2] md:aspect-auto relative rounded-xl overflow-hidden">
                <img
                  src="/main-img.webp"
                  alt="Truck Services Dashboard"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>
            </div>
          </div>
        </section>
            <section className="w-full bg-white py-16">
                <div className="max-w-5xl mx-auto text-center px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202231] mb-4">
                    WE TRANSFORM THE TRUCKING INDUSTRY
                    </h2>
                    <p className="text-gray-600 mb-12">
                    Since November 2022, PathSure has been gaining popularity among truck drivers and businesses within the trucking industry.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Rating */}
                    <div className="bg-white shadow-lg rounded-lg py-8 px-6 flex flex-col items-center">
                        <img src="/listingiocns/Component 1.png" alt="" className='w-[2rem] h-[2rem]'/>
                        <h3 className="text-xl font-semibold text-[#202231]">4.8</h3>
                        <p className="text-gray-600 mt-1 text-sm">App User Ratings</p>
                    </div>

                    {/* Search Requests */}
                    <div className="bg-white shadow-lg rounded-lg py-8 px-6 flex flex-col items-center">
                        <img src="/listingiocns/image 5.png" alt="" className='w-[2rem] h-[2rem]'/>
                        <h3 className="text-xl font-semibold text-[#202231]">2M+</h3>
                        <p className="text-gray-600 mt-1 text-sm">Monthly Search Requests</p>
                    </div>

                    {/* Downloads */}
                    <div className="bg-white shadow-lg rounded-lg py-8 px-6 flex flex-col items-center">
                        <img src="/listingiocns/image 6.png" alt="" className='w-[2rem] h-[2rem]'/>
                        <h3 className="text-xl font-semibold text-[#202231]">250K+</h3>
                        <p className="text-gray-600 mt-1 text-sm">App Downloads</p>
                    </div>
                    </div>
                </div>
            </section>
        <section className="w-screen h-auto  bg-contain bg-center mt-20">
            <div className='w-screen flex flex-col items-center px-5 h-auto justify-center gap-5 '>
                <h1 className='text-black text-4xl text-center'>CREATE A TRUCK-SAFE ROUTE WITH EFFICIENCY</h1>
                <p className='text-black text-sm text-center'>Equip yourself with a navigation tool for accurate routes and expert guidance</p>
            </div>
            <div className="relative px-5 md:px-45 rounded-3xl overflow-hidden mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="w-full flex justify-center">
                    <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                        <img
                        src="/Jla3P43tx11.png"
                        alt="Truck Services Dashboard"
                        className="w-[20rem] h-auto object-contain object-center"
                        />
                    </div>
                    </div>
                    <div className="w-full text-center md:text-left ">
                        <h1 className="text-2xl  font-bold leading-tight mb-2 text-[#0099E8]">
                        Pro Navigation With 450K+ POIs
                        </h1>
                        <p className="text-[#909198] text-sm ">
                        Navigate to key places & services or create your own route                       
                        </p>
                        <div className='flex flex-row gap-5 mt-5'>
                            <div className='md:flex-col-1 flex flex-col gap-3'>
                                <div className='text-black flex gap-2 items-center'>
                                    <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Contact info</p>
                                </div>
                                <div className='text-black flex gap-2 items-center'>
                                    <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Amenities</p>
                                </div>
                                <div className='text-black flex gap-2 items-center'>
                                    <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Working hours</p>
                                </div>
                            </div>
                            <div className='md:flex-col-2 flex flex-col gap-3'>
                                <div className='text-black flex gap-2 items-center'>
                                    <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Business details</p>
                                </div>
                                <div className='text-black flex gap-2 items-center'>
                                    <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Supported languages</p>
                                </div>
                                <div className='text-black flex gap-2 items-center'>
                                    <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Accepted payment methods</p>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                    
                </div>
            </div>
            <div className="relative px-5 md:px-45 rounded-3xl overflow-hidden mb-16">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-2">
                    <div className="w-full text-center md:text-left ">
                        <h1 className="text-2xl  font-bold leading-tight mb-2 text-[#0099E8]">
                        Real-Time Location Updates
                        </h1>
                        <p className="text-[#909198] text-sm ">
                            Stay informed on the road with updates from truckers                        
                        </p>
                        <div className='flex flex-col gap-5 mt-5'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Personalize your icon with a sponsored badge</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Get company-branded icons for enterprise locations</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Claim the leading position in search results within your region</p>
                            </div>
                        </div>
                       
                    </div>
                    <div className="w-full flex justify-center">
                        <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                            <img
                            src="/Container3.png"
                            alt="Truck Services Dashboard"
                            className="w-[20rem] h-auto object-contain object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative px-5 md:px-45 rounded-3xl overflow-hidden mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="w-full flex justify-center">
                    <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                        <img
                        src="/place.mp4.png"
                        alt="Truck Services Dashboard"
                        className="w-[20rem] h-auto object-contain object-center"
                        />
                    </div>
                    </div>
                    <div className="w-full text-center md:text-left ">
                        <h1 className="text-2xl  font-bold leading-tight mb-2 text-[#0099E8]">
                        Promote Your Business
                        </h1>
                        <p className="text-[#909198] text-sm ">
                       Increase your visibility with banners and promotional videos                      
                        </p>
                        <div className='flex flex-col gap-5 mt-5'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Spread the word about seasonal discounts</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Advertise specific services to boost your sales</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Expand your customer base with the latest special offers</p>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            <div className="relative px-5 md:px-45 rounded-3xl overflow-hidden mb-16">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-5">
                    <div className="md:w-1/3 text-center md:text-left ">
                        <h1 className="text-2xl  font-bold leading-tight mb-2 text-[#0099E8]">
                        Review Analytics
                        </h1>
                        <p className="text-[#909198] text-sm ">
                        Get valuable insights from company card
                        analytics                     
                        </p>
                        <div className='flex flex-col gap-5 mt-5'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Business card views</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Engagement with advertising</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Clicks to your website</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Calls</p>
                            </div>
                        </div>
                       
                    </div>
                    <div className="w-2/3 flex justify-center">
                        <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                            <img
                            src="/desktop.mp4.png"
                            alt="Truck Services Dashboard"
                            className="w-full h-auto object-contain object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#202231] mb-4">
            WHY JOIN OUR NETWORK?
            </h2>
            <p className="text-gray-600 mb-12">
            We connect your business to <strong>250K+</strong> highly engaged drivers through our app and website
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-lg py-6 px-4 flex items-center justify-center space-x-3">
                <img src="/listingiocns/image7.png" alt="" className='w-[2rem] h-[2rem]'/>
                <p className="text-[#202231] font-medium">Attract Customers</p>
            </div>

            <div className="bg-white shadow-lg rounded-lg py-6 px-4 flex items-center justify-center space-x-3">
            <img src="/listingiocns/image 8.png" alt="" className='w-[2rem] h-[2rem]'/>
                <p className="text-[#202231] font-medium">Boost Your Sales</p>
            </div>

            <div className="bg-white shadow-lg rounded-lg py-6 px-4 flex items-center justify-center space-x-3">
                <img src="/listingiocns/image 9.png" alt="" className='w-[2rem] h-[2rem]'/>
                <p className="text-[#202231] font-medium">Increase Visibility</p>
            </div>
            </div>

            <div className="flex justify-center space-x-4">
            <button className="bg-[#52C4FF] text-white font-semibold py-2 px-6 rounded-md transition ">
                Sign Up
            </button>
            <button className="text-[#52C4FF] border border-[#52C4FF]  font-semibold py-2 px-6 rounded-md">
                Schedule Demo
            </button>
            </div>
        </div>
        </section>
    <Footer/>
    </>
  )
}

export default page