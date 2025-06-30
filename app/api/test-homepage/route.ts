import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing homepage services fetching...');
    
    // Fetch all services data using API routes with relative URLs
    const [technicalTrainings, nonTechnicalTrainings, consultingServices] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://kmtcs.com.my'}/api/technical-trainings?status=true&limit=3`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://kmtcs.com.my'}/api/non-technical-trainings?status=true&limit=3`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://kmtcs.com.my'}/api/consulting-services?status=true&limit=3`)
    ]);

    // Check if responses are ok
    if (!technicalTrainings.ok) {
      console.error('Technical trainings API error:', technicalTrainings.status, technicalTrainings.statusText);
    }
    if (!nonTechnicalTrainings.ok) {
      console.error('Non-technical trainings API error:', nonTechnicalTrainings.status, nonTechnicalTrainings.statusText);
    }
    if (!consultingServices.ok) {
      console.error('Consulting services API error:', consultingServices.status, consultingServices.statusText);
    }

    const technicalData = await technicalTrainings.json();
    const nonTechnicalData = await nonTechnicalTrainings.json();
    const consultingData = await consultingServices.json();

    console.log('Technical trainings:', technicalData.data?.length || 0);
    console.log('Non-technical trainings:', nonTechnicalData.data?.length || 0);
    console.log('Consulting services:', consultingData.data?.length || 0);

    // Log any errors from the API responses
    if (technicalData.error) console.error('Technical trainings error:', technicalData.error);
    if (nonTechnicalData.error) console.error('Non-technical trainings error:', nonTechnicalData.error);
    if (consultingData.error) console.error('Consulting services error:', consultingData.error);

    // Combine and format the services
    const allServices = [
      ...(technicalData.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        duration: item.duration || '',
        category: 'Technical Training',
        serviceType: 'technical-training'
      })),
      ...(nonTechnicalData.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        duration: item.duration || '',
        category: 'Non-Technical Training',
        serviceType: 'non-technical-training'
      })),
      ...(consultingData.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        duration: item.duration || '',
        category: 'Consulting',
        serviceType: 'consulting'
      }))
    ];

    console.log('Total services found:', allServices.length);

    return NextResponse.json({ 
      success: true,
      services: allServices,
      summary: {
        technical: technicalData.data?.length || 0,
        nonTechnical: nonTechnicalData.data?.length || 0,
        consulting: consultingData.data?.length || 0,
        total: allServices.length
      }
    });

  } catch (error) {
    console.error('Error testing homepage services:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 