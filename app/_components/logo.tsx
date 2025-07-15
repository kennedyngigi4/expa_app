import React from 'react'
import Image from "next/image";

const LogoImage = () => {
    return (
        <Image src="/logo.png" width={100} height={50} alt="Logo" />
    )
}

export default LogoImage