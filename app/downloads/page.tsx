"use client"
import { Button } from '@/components/ui/button'
import { DownloadCloudIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DownloadsPage = () => {

    const appsLink = [
        {
            id: 1,
            name: "ExPa Customer App",
            image: "/icons/downloads/customer.png",
            url: "https://drive.google.com/file/d/1pajufkjzS412U7DvNDA1gQspm2ZDZiV6/view?usp=sharing",
        },
        {
            id: 2,
            name: "ExPa Partner App",
            image: "/icons/downloads/rider.png",
            url: "https://drive.google.com/file/d/1zmX6kMNgeekGBVSOKTLGyGJ4wfMnyXxL/view?usp=drive_link",
        },
        {
            id: 3,
            name: "ExPa Driver App",
            image: "/icons/downloads/driver.png",
            url: "https://drive.google.com/file/d/15kXmnE7LjSAHpCpifl6lSQqCc_3EiLXf/view?usp=drive_link",
        }
    ]

    return (
        <section className="relative flex flex-col justify-center items-center min-h-screen bg-[url('/images/bg/1.jpg')] bg-cover bg-center">
            
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10">
                <div className='pb-8'>
                    <Link href="/">
                        <Image src="/logo.png" alt="" width={200} height={100} className="mx-auto" />
                    </Link>
                    
                    <h1 className='text-center font-extrabold text-orange-400 text-2xl'>ExPa Limited Apps</h1>
                    <p className="text-white text-center">Please download our apps according to your interests.</p>
                </div>

                <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
                    {appsLink.map((app) => (
                        <div key={app.id} className="flex flex-col items-center justify-center shadow-lg p-10 rounded-2xl space-y-5 bg-white">
                            <Image src={app.image} alt='' width={90} height={90} />
                            <h2 className='font-semibold'>{app.name}</h2>
                            <a href="/downloads/expa_customer.apk">
                                <Button className='cursor-pointer'>Click to Download <DownloadCloudIcon /></Button>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            
            
        </section>
    )
}

export default DownloadsPage