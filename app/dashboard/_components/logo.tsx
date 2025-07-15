"use client"

import React from 'react';
import Image from 'next/image';

const Logo = () => {
    return (
        <Image src="/logo.png" width={150} height={50} alt="Logo" />
    )
}

export default Logo