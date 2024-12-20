import { NextResponse } from 'next/server'
import { getConsultingById } from '../../../data/consulting'

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const id = await context.params.id
    const service = getConsultingById(id)
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
} 