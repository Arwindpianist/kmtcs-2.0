export interface Training {
  id: number;
  title: string;
  description: string;
  duration: string;
  date?: string;
  price: number;
  priceId: string; // Stripe price ID
  details?: string[];
  level?: string;
  prerequisites?: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  priceId: string; // Stripe price ID
  details?: string[];
  benefits?: string[];
  deliverables?: string[];
}
