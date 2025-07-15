import React from 'react'

const AuthLayout = ({
    children
} : { children: React.ReactNode }) => {
  return (
    <section className="flex justify-center items-center h-screen bg-[url('/images/bg/1.jpg')] bg-cover bg-center">
        {children}
    </section>
  )
}

export default AuthLayout