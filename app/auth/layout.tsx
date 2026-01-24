import { Button } from '@/components/ui/button'
import { DownloadCloudIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AuthLayout = ({
    children
} : { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-[url('/images/bg/1.jpg')] bg-cover bg-center">
      
      {children}
      
        
      <div className="mt-8">
        <Link href="/downloads">
          <Button className="bg-white text-orange-400 hover:bg-orange-400 hover:text-white cursor-pointer" variant="ghost"><DownloadCloudIcon /> Download App</Button>
        </Link>
        
      </div>
        
    </section>
  )
}

export default AuthLayout