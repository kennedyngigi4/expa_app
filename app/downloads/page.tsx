"use client"
import { Button } from '@/components/ui/button'
import React from 'react'

const DownloadsPage = () => {
  return (
    <section className='flex flex-col justify-center items-center min-h-screen'>
        <h1 className='text-center py-18 font-extrabold text-orange-400 text-2xl'>ExPa Limited Apps</h1>
        <section className="grid md:grid-cols-3 grid-cols-2 gap-15">
            <div className='shadow-lg p-10 rounded-2xl space-y-8'>
                <h2 className='font-semibold'>ExPa Customer App</h2>
                <a href="/downloads/expa_customer.apk">
                    <Button className='cursor-pointer'>Click to Download</Button>
                </a>
            </div>
            <div className='shadow-lg p-10 rounded-2xl space-y-8'>
                <h2 className='font-semibold'>ExPa Partner App</h2>
                <a href="/downloads/expa_partner.apk">
                    <Button className='cursor-pointer'>Click to Download</Button>
                </a>
            </div>
            <div className='shadow-lg p-10 rounded-2xl space-y-8'>
                <h2 className='font-semibold'>ExPa Driver App</h2>
                <a href="/downloads/expa_driver.apk">
                    <Button className='cursor-pointer'>Click to Download</Button>
                </a>
            </div>
            
        </section>
    </section>
  )
}

export default DownloadsPage