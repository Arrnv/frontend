'use client';

import { useState, useEffect, Suspense } from 'react';
import React from 'react';
import { gsap } from 'gsap';
import ServiceNav from '@/components/ServiceNav';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: "How can I achieve fuel cost savings for truckers using the app?",
    answer: "Our free trucker GPS app is engineered to optimize fuel efficiency. By providing accurate commercial truck route GPS app guidance that avoids traffic congestion and unnecessary detours, it helps you save on fuel costs. Additionally, you can access real-time diesel prices at nearby stations, making it easier to choose the most cost-effective stops on your route. It's one of the best gps apps for big trucks.",
  },
  {
    question: "Can the app help with truck GPS bridge height information?",
    answer: "Absolutely! Our cdl truck GPS for low bridges feature is crucial for ensuring safe travel. The app provides detailed commercial truck navigation app height information, helping you avoid low bridges and restricted routes, ensuring a smooth and secure journey. This is essential in any GPS app for commercial trucks.",
  },
  {
    question: "Is there a truck route GPS online feature available?",
    answer: "Yes, the app includes a comprehensive CDL GPS app online feature. Whether you’re planning from your desktop or on the go with your mobile device, you can access real-time updates and make adjustments to your route with ease. It’s a reliable free GPS app for truck drivers.",
  },
  {
    question: "Does the app offer GPS for truck routes?",
    answer: "Yes, our app is a reliable commercial truck GPS for iPhone and Android. It’s tailored to the specific needs of the trucking industry, offering precise truck GPS directions that account for vehicle size, weight restrictions, and traffic conditions—ensuring you’re always on the best route.",
  },
  {
    question: "How can the app help with load planning and scheduling stops?",
    answer: "Efficient load planning is critical for truck drivers, and our app is equipped with tools that assist in scheduling your stops strategically. You can easily find truck-friendly parking, check the status of weigh stations, and ensure that you’re making the most of your time on the road. It's a feature often missing in apps like Apple Maps or Waze.",
  },
  {
    question: "Can the app be used for semi trucks?",
    answer: "Yes, our free semi truck GPS app is designed to meet the unique demands of larger vehicles. It provides truck-safe navigation, including routes optimized for semi trucks, helping you avoid low bridges and other hazards that could disrupt your journey. It also includes truck GPS navigation software that’s updated regularly.",
  },
  {
    question: "What devices are supported by the app?",
    answer: "The trucker GPS app is compatible with both Android and iPhone devices, ensuring you have access to free GPS for truck drivers regardless of your preferred platform. The app is designed to be user-friendly and is also available as a trucker GPS app for iPad, supporting flexible use across multiple devices.",
  },
];

const Page = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    gsap.from(".glass-card", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  return (
    < >
    <Suspense fallback={<div>Loading navigation...</div>}>
      <ServiceNav selectedCategory={null}  onSelect={function (section: 'services' | 'places', subcategoryIds: string[]):void {
        throw new Error('Function not implemented.');
      } } />
    </Suspense>
        <section className="relative md:px-25 mt-5 overflow-hidden mb-16 sm:px-5 sm:mt-5 ">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between px-12 md:px-20 py-12 md:py-20 gap-10 sm:flex-col">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl md:text-4xl lg:text-6xl leading-tight font-thin text-[#202231] mb-6">
                <span className='text-[#0099E8]'>GPS</span> NAVIGATION
                FOR TRUCKING
                INDUSTRY
              </h2>
              <p className="text-[#56575B] text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-6">
                Experience a seamless solution where safety and efficiency
                align perfectly with drivers’ needs
              </p>
              {/* <div className="w-full max-w-[300px] aspect-[3/2] md:aspect-auto relative rounded-xl overflow-hidden">
                <img
                  src="/Container.png"
                  alt="Truck Navigation"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div> */}
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-[600px] aspect-[3/2] md:aspect-auto relative rounded-xl overflow-hidden">
                <img
                  src="/image5.svg"
                  alt="Truck Navigation"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className='w-screen px-5 md:px-52 text-black '>
            <div className='py-10'>
                <p className='text-[#202232]'>Truck Navigation Tool</p>
                <h1 className='text-2xl'>Advantage in Every Mile</h1>
                <p className='text-[#909198]'>Make every mile work for you — stay informed, stay safe, and keep rolling with confidence</p>
            </div>
            <div className='grid gap-5'>
                <div className='flex flex-col gap-5 md:col-1'>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Weigh Station Status <span className='text-[#50AF7D]'>Open</span> <span className='text-[#EB1D36]'>Close</span></p>
                            <p className='text-[#909198]'>Stay informed with real-tim
                                e updates on weigh stations along
                                your route</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay1.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Truck Parking Availability <span className='text-[#50AF7D]'>Open</span> <span className='text-[#FF8236]'>Some</span> <span className='text-[#EB1D36]'>Close</span></p>
                            <p className='text-[#909198]'>Find parking effortlessly with real-time updates on spot
                                availability along your route</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay2.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Working hours status <span className='text-[#50AF7D]'>Open</span> <span className='text-[#EB1D36]'>Close</span></p>
                            <p className='text-[#909198]'>Stay updated with real-time working hours for over 450,000 POIs
                            for truck drivers</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay3.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Up-to-date Fuel Prices   <span className='font-bold text-[#2E303E]'> Diesel</span> <span className='font-bold text-[#2E303E]'>DEF</span></p>
                            <p className='text-[#909198]'>Stay informed with real-tim
                                e updates on weigh stations along
                                your route</p>
                        </div>
                    </div>
                    
                </div>
                <div className='flex flex-col gap-5 md:col-2 '>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay4.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Live Traffic Cameras </p>
                            <p className='text-[#909198]'>Stay informed with real-tim
                                e updates on weigh stations along
                                your route</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay5.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Weather Forecast </p>
                            <p className='text-[#909198]'>Stay ahead with the latest weather updates and get accurate
                                forecasts for the day along your route</p>
                        </div>
                    </div>
                     <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay6.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Breakdown Services</p>
                            <p className='text-[#909198]'>Find 24/7 breakdown services whenever and wherever you need
                                them along your route</p>
                        </div>
                    </div>
                     <div className='flex flex-row gap-2'>
                        <div>
                            <img src="/svg/Overlay7.png" alt="" sizes='5rem'/>
                        </div>
                        <div >
                            <p>Hotels & Restaurants</p>
                            <p className='text-[#909198]'>Find thousands of trucker-friendly hotels and restaurants
                                conveniently located along your routee</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
        <section className="w-screen h-auto md:bg-[url('/Group1.png')] bg-contain bg-center mt-20">
            <div className='w-screen flex flex-col text-center md:items-center h-[12rem] justify-center gap-5 '>
                <h1 className='text-black text-2xl  md:text-4xl sm:text-center '>CREATE A TRUCK-SAFE ROUTE WITH EFFICIENCY</h1>
                <p className='text-black px-2 text-sm sm:text-center'>Equip yourself with a navigation tool for accurate routes and expert guidance</p>
            </div>
            <div className="relative px-5 md:px-45 rounded-3xl overflow-hidden mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="w-full flex justify-center">
                    <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                        <img
                        src="/card-1.mp4.png"
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
                        <div className='flex flex-col gap-5 mt-5 sm:items-center md:items-start'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Truck parking, fuel stations, weigh stations, truck stops, and more</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Truck-friendly locations including hotels, restaurants, Walmart stores, etc.</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Status bar providing essential updates on nearby places and services</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Real-time ETA updates based on current road conditions</p>
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
                        <div className='flex flex-col gap-5 mt-5 sm:items-center md:items-start'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Real-time updates on parking availability</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Live updates on weigh station open/close status</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Latest nationwide fuel price information</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Instant status updates for business locations (open or closed)</p>
                            </div>
                        </div>
                       
                    </div>
                    <div className="w-full flex justify-center">
                        <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                            <img
                            src="/card-1.mp4.png"
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
                        src="/card-1.mp4.png"
                        alt="Truck Services Dashboard"
                        className="w-[20rem] h-auto object-contain object-center"
                        />
                    </div>
                    </div>
                    <div className="w-full text-center md:text-left items-center md:items-start">
                        <h1 className="text-2xl  font-bold leading-tight mb-2 text-[#0099E8]">
                        Advanced Safety Features
                        </h1>
                        <p className="text-[#909198] text-sm ">
                        Avoid unsafe routes and challenging driving conditions                       
                        </p>
                        <div className='flex flex-col gap-5 mt-5'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Real-time road camera streams</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Detailed map highlighting low bridge locations</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Live updates on traffic and weather conditions</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Night-friendly dark mode for optimal driving visibility</p>
                            </div>
                        </div>
                       
                    </div> 
                </div>
            </div>
            <div className="relative px-5 md:px-45 rounded-3xl overflow-hidden mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="w-full text-center md:text-left ">
                        <h1 className="text-2xl  font-bold leading-tight mb-2 text-[#0099E8]">
                        Truck-Specific Routing
                        </h1>
                        <p className="text-[#909198] text-sm ">
                        Get truck-specific routings custom to your truck                      
                        </p>
                        <div className='flex flex-col gap-5 mt-5'>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Avoid tolls, ferries, tunnels, unpaved roads, or carpool lanes.</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Specify truck length, height, width, and weight limits.</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Customize route settings for hazardous materials.</p>
                            </div>
                            <div className='text-black flex gap-2 items-center'>
                                <img src="/Component2.png" alt="" className='h-[1rem] w-[1.5rem]'/> <p>Providing the most efficient alternative routes</p>
                            </div>
                        </div>
                       
                    </div>
                    <div className="w-full flex justify-center">
                        <div className="w-full relative rounded-xl overflow-hidden flex  justify-center">
                            <img
                            src="/card-1.mp4.png"
                            alt="Truck Services Dashboard"
                            className="w-[20rem] h-auto object-contain object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="bg-[#F7F7F9] w-screen px-5 md:px-50 py-25">
            <h2 className="text-3xl font-bold mb-6 text-[#0099E8]">
              Got Questions? We Got Answers
            </h2>
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-600 py-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <span className='text-[#0099E8]'>{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 text-black ${
                      openIndex === index ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <p className="mt-2 px-10 text-sm text-[#202231]">{faq.answer}</p>
                )}
              </div>
            ))}
        </section>
        <Footer/>
    </>
  );
};

export default Page;
