export interface EnquiryPayload {
  name: string;
  email: string;
  company?: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
}

export async function createEnquiry(enquiry: EnquiryPayload) {
  const response = await fetch('/api/contact-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enquiry),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create enquiry');
  }

  const result = await response.json();
  return result.data;
}
