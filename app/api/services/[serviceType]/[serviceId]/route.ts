import { NextResponse } from 'next/server'
import { trainings, nonTechnicalTrainings } from '../../../../data/trainings'
import { consultingServices } from '../../../../data/consulting'

export async function GET(
  request: Request,
  { params }: { params: { serviceType: string; serviceId: string } }
) {
  const { serviceType, serviceId } = params

  if (serviceType === 'training') {
    const service = [...trainings, ...nonTechnicalTrainings]
      .find(t => t.id.toString() === serviceId)
    if (!service) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 })
    }
    return NextResponse.json(service)
  }

  if (serviceType === 'consulting') {
    const service = consultingServices.find(c => c.id === serviceId)
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    return NextResponse.json(service)
  }

  return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
} 