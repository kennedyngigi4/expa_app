"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';

const ManagerHome = () => {
  return (
    <section className='flex flex-col'>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold text-amber-600"></h1>
          </CardHeader>
          <CardContent>
            Unassigned Orders
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold text-amber-600"></h1>
          </CardHeader>
          <CardContent>
            My Orders
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold text-amber-600"></h1>
          </CardHeader>
          <CardContent>
            Invoices
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h1 className="text-4xl font-bold text-amber-600"></h1>
          </CardHeader>
          <CardContent>
            Shipments
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ManagerHome