"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ShipmentModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPackageIds: string[];
    offices: { id: string; name: string }[];
    couriers: any[];
    onSubmit: (params: {
        packages: string[];
        courier: string;
        shipment_type: string;
        handover_required: string;
        destination_office?: string | null;
    }) => void;
}

const ShipmentModal: React.FC<ShipmentModalProps> = ({
    isOpen,
    onOpenChange,
    selectedPackageIds,
    offices,
    couriers,
    onSubmit
}) => {
    const [shipmentPurpose, setShipmentPurpose] = useState<string>('');
    const [destinationOffice, setDestinationOffice] = useState<string | null>(null);
    const [selectedDriver, setSelectedDriver ] = useState<string>("");
    const [handoverOption, setHandoverOption] = useState("");

    const handleCreateShipment = () => {
        onSubmit({
            packages: selectedPackageIds,
            courier: selectedDriver,
            shipment_type: shipmentPurpose,
            handover_required: handoverOption,
            destination_office: shipmentPurpose === 'transfer' ? destinationOffice : null
        });
        onOpenChange(false); 
        setShipmentPurpose('');
        setDestinationOffice(null);
        setSelectedDriver("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Shipment</DialogTitle>
                    <DialogDescription>
                        Group selected packages into a shipment.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">

                    <div>
                        <Label>Driver/ Rider</Label>
                        <Select onValueChange={setSelectedDriver} value={selectedDriver || ''}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Choose Driver" />
                            </SelectTrigger>
                            <SelectContent>
                                {couriers.map((courier: any) => (
                                    <SelectItem key={courier.id} value={courier.id}>
                                        {courier.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <Label>Purpose</Label>
                    <Select onValueChange={setShipmentPurpose} value={shipmentPurpose}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Select Purpose" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                            <SelectItem value="pickup">Pickup</SelectItem>
                        </SelectContent>
                    </Select>

                    {shipmentPurpose === "transfer" && (
                        <>
                            <Label>Destination Office</Label>
                            <Select onValueChange={setDestinationOffice} value={destinationOffice || ''}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Choose Office" />
                                </SelectTrigger>
                                <SelectContent>
                                    {offices.map((office) => (
                                        <SelectItem key={office.id} value={office.id}>
                                            {office.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}


                    <div>
                        <Label>Is handover required?</Label>
                        <Select onValueChange={setHandoverOption} value={handoverOption || ""}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Choose handover option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="False">No</SelectItem>
                                <SelectItem value="True">Yes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleCreateShipment}
                        disabled={
                            !shipmentPurpose ||
                            (shipmentPurpose === "transfer" && !destinationOffice)
                        }
                    >
                        Submit Shipment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShipmentModal;
