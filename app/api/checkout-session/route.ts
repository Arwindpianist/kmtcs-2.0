import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  try {
    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const metadata = session.metadata

    return NextResponse.json({
      serviceType: metadata?.serviceType,
      serviceId: metadata?.serviceId,
      title: metadata?.title,
      price: session.amount_total ? session.amount_total / 100 : 0
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch session' },
      { status: 500 }
    )
  }
} 