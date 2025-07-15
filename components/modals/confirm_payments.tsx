"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';


interface ConfirmPaymentsModalProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const ConfirmPaymentsModal = ({ children, title, subtitle }: ConfirmPaymentsModalProps) => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button className='bg-green-500 hover:bg-primary cursor-pointer' size="sm">Confirm Payments</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className='text-slate-500 py-5'>
                    Package ID: <span className='text-primary font-semibold'>{subtitle}</span>
                </DialogDescription>
            </DialogHeader>
            <div>
                {children}
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ConfirmPaymentsModal