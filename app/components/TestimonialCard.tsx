import Image from 'next/image';
import { Card, CardContent } from '@/app/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
}

const TestimonialCard = ({ quote, name, company }: TestimonialCardProps) => {
  return (
    <Card className="shadow-md mx-2 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Image src="/testimonials/user-stroke-rounded.svg" alt="User icon" width={40} height={40} />
          </div>
          <div className="ml-4">
            <p className="text-lg text-muted-foreground italic">"{quote}"</p>
            <div className="mt-4">
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground">{company}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard; 