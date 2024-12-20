import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query

  try {
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id as string)

    // Extracting data from the session object
    const productName = session.metadata?.productName || 'Consultation'
    const amount = session.amount_total! / 100 // Convert cents to MYR
    const currency = session.currency?.toUpperCase() || 'MYR'

    res.status(200).json({ productName, amount, currency })
  } catch (error: any) {
    console.error('Error retrieving payment details:', error.message)
    res.status(500).json({ error: error.message })
  }
}
