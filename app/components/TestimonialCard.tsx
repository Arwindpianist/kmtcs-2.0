import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
}

const TestimonialCard = ({ quote, name, company }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-2">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Image src="/testimonials/user-stroke-rounded.svg" alt="User icon" width={40} height={40} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-gray-700 italic">"{quote}"</p>
          <div className="mt-4">
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 