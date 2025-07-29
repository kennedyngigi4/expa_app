
export type OfficeModel = {
    id: string;
    name: string;
    email: string;
    address: string;
    geo_lat: string;
    geo_lng: string;
    description: string;
}


export type UrgencyModel = {
    id: string;
    name: string;
}




export type PackageTypeModel = {
    id: string;
    name: string;
}




export type PackageModel  = {
    id: string;
    slug: string;
    name: string;
    package_type: string;
    package_type_name: string; 
    package_id: string; 
    size_category: string;
    size_category_name: string;
    delivery_type: string;
    is_fragile: boolean;
    urgency: string;
    urgency_name: string;
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
    pickup_date: string;
    description?: string;
    sender_name: string;
    sender_phone: string;
    sender_address: string;
    sender_latLng: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    recipient_latLng: string;
    status: string;
    is_paid: boolean;
    created_by_role: string;
    created_at: string;
}




export type RouteModel = {
    origins: any;
    destinations: any;
    size_category: any;
    base_weight_limit: any;
    base_price: any;
    
}



export type ShipmentModel = {
    id: string;
    shipment_id: string;
    shipment_type: string; 
    origin_office: string;
    originoffice?: string;
    destination_office: string;
    destinationoffice?: string;
    status: string;
    qrcode_svg: string;
    summary: string;
    assigned_at: string;
    packages: PackageModel;
}




export type InvoiceModel = {
    invoice_id: string; 
    package: string;
    package_name: string;
    amount: string;
    status: string;
    issued_at: string;
}



export type NotificationModel = {
    title: string;
    message: string;
    notification_type: string;
    package?: string;
    shipment?: string;
    is_read: boolean;
    created_at: string;
}




