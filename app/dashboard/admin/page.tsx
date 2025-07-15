"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, File, Bell, HandCoinsIcon, Route, Car, Boxes, Users, Warehouse } from 'lucide-react';
import React from 'react';
import { Component } from './_components/example-chart';

const AdminHome = () => {
  return (
    <section>
      <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4'>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Package className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">5</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Orders</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Users className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">9</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Employees</p>
          </CardContent>
        </Card>


        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Boxes className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">9</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Shipments</p>
          </CardContent>
        </Card>


        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Warehouse className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">509</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Offices</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Route className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">100</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Routes</p>
          </CardContent>
        </Card>


        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 right-2 opacity-6 pointer-events-none z-0">
            <Car className="w-36 h-36 text-primary" />
          </div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-primary font-medium text-xl">100</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p>Drivers</p>
          </CardContent>
        </Card>
      </div>

      <div className='py-8 w-full'>
        <div className='flex flex-col pb-8'>
          <h1 className='text-center'>Statistics</h1>
          <p className='text-slate-400 text-center'>Statistics of ongoing activities in EXPA.</p>
        </div>
        <Component />
      </div>
    </section>
  )
}

export default AdminHome