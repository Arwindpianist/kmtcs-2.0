// components/ServiceCard.tsx
import Link from 'next/link';
import type { Service } from '@/app/types/service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <CardTitle className="text-2xl font-bold leading-tight pr-2 group-hover:text-primary transition-colors break-words">
            {service.title}
          </CardTitle>
        </div>
        <CardDescription className="text-base line-clamp-3 leading-relaxed min-h-[4.5rem] break-words">
          {service.short_description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-center pb-4 mb-4 border-b">
          <span className="text-sm font-semibold text-muted-foreground break-words">
            Duration: {service.duration}
          </span>
          <Badge variant="secondary" className="uppercase tracking-wide">
            {service.service_type}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          asChild 
          className="w-full"
          variant="default"
        >
          <Link href={`/services/${service.service_type}/${service.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}