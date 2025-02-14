export interface Service {
    id: string;
    title: string;
    shortDescription: string;
    duration: string;
    type: 'Technical' | 'Non-Technical' | 'Consulting';
  }