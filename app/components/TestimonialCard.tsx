import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
}

const TestimonialCard = ({ quote, name, company }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md p-8 mx-2 border border-theme">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Image src="/testimonials/user-stroke-rounded.svg" alt="User icon" width={40} height={40} />
        </div>
        <div className="ml-4">
          <p className="text-lg text-secondary italic">"{quote}"</p>
          <div className="mt-4">
            <p className="font-semibold text-primary">{name}</p>
            <p className="text-sm text-secondary">{company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 