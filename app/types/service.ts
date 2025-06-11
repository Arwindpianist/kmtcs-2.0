export type ServiceType = 'consulting' | 'training' | 'certification' | 'assessment';

export interface Service {
    id: string;
    title: string;
    short_description: string;
    full_description: string;
    duration: string;
    service_type: ServiceType;
    price: number;
    status: boolean;
    created_at: string;
    updated_at: string;
}