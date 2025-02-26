import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  testimonial: string;
  image: string;
}

const TestimonialCard = ({ name, role, company, testimonial, image }: TestimonialCardProps) => {
  return (
    <div className="mx-4 h-full">
      <div className="bg-gradient-to-br from-blue-300 via-teal-100 to-blue-300 border border-blue-400 rounded-lg shadow-lg p-8 flex flex-col justify-between min-h-[300px] max-h-[400px]">
        <div className="mb-8 flex-grow">
          <p className="text-blue-800 italic text-lg md:text-xl lg:text-2xl">{testimonial}</p>
        </div>
        <div className="flex items-center mt-auto">
          <div className="relative w-12 h-12 mr-4 flex-shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-blue-800 font-semibold">{name}</h4>
            <p className="text-blue-700 text-sm">{role}</p>
            <p className="text-blue-600 text-sm">{company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 