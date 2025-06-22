import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  price: number | null;
  duration: string;
  category: string;
  target_audience: string;
  prerequisites: string;
  course_outline: string;
  status: boolean;
  image_url: string;
}

async function getCourse(id: string): Promise<TrainingCourse | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('technical_trainings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function TechnicalTrainingPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  const handlePayment = async () => {
    'use server';
    if (!course.price) return;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'myr',
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: course.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'auto',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/services/technical-trainings/${course.id}`,
    });

    if (session.url) {
      redirect(session.url);
    }
  };

  const handleInquiry = async (formData: FormData) => {
    'use server';

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    const inquiryMessage = `
      Training Inquiry: ${course.title}
      ---------------------------------
      ${message}
    `;
    
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('contact_submissions').insert([
      { name, email, phone, message: inquiryMessage, status: 'new' },
    ]);

    if (!error) {
      redirect('/thank-you');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {course.image_url && (
          <img src={course.image_url} alt={course.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {course.duration && (
              <div className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-4 py-2 rounded-full">
                Duration: {course.duration}
              </div>
            )}
            {course.price && (
              <div className="bg-green-100 text-green-800 text-sm font-semibold mr-2 px-4 py-2 rounded-full">
                Price: RM {course.price.toFixed(2)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800">Target Audience:</h3>
              <p>{course.target_audience}</p>
            </div>
            {course.prerequisites && (
              <div>
                <h3 className="font-semibold text-gray-800">Prerequisites:</h3>
                <p>{course.prerequisites}</p>
              </div>
            )}
          </div>

          {course.course_outline && (
            <div className="prose max-w-none mb-8">
              <h3 className="font-semibold text-gray-800 text-xl mb-2">Course Outline</h3>
              <div dangerouslySetInnerHTML={{ __html: course.course_outline }} />
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg">
            {course.price && (
              <form action={handlePayment} className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">RM {course.price.toFixed(2)}</h3>
                <button type="submit" className="w-full bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </form>
            )}

            <form action={handleInquiry} className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {course.price ? 'Have a Question?' : 'Request a Quote'}
              </h3>
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input type="text" name="name" id="name" required className="w-full p-3 border border-gray-300 rounded-md" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" name="email" id="email" required className="w-full p-3 border border-gray-300 rounded-md" placeholder="Your Email" />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Phone</label>
                <input type="tel" name="phone" id="phone" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Your Phone (Optional)" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea name="message" id="message" rows={4} required className="w-full p-3 border border-gray-300 rounded-md" placeholder="Your Message"></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 