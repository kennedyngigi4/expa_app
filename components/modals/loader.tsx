"use client"

import Image from 'next/image'
import React from 'react'

const Loader = () => {
    return (
        <section className="flex flex-col justify-center items-center h-screen w-full">
            <Image src="/icons/loader.gif" alt="EXPA COURIER" width={100} height={100} priority />
        </section>
    )
}

export default Loader