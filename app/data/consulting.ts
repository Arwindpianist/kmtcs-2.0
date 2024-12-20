export interface ConsultingService {
  id: string;
  title: string;
  category: 'Consulting';
  description: string;
  details: string[];
  price: number;
  priceId: string;
}

export const consultingServices: ConsultingService[] = [
  {
    id: 'c1',
    category: 'Consulting',
    title: 'Engineering Projects Consultancy',
    description: 'Professional engineering consultancy services delivered by experienced Registered Professional Engineers.',
    details: [
      'Provides mechanical and electrical projects consultancy',
      'Staffed by Registered Professional Engineers with over 30 years of experience',
      'Offers expertise in project management, quality, and safety'
    ],
    price: 2000,
    priceId: 'price_engineering_consulting'
  },
  {
    id: 'c2',
    category: 'Consulting',
    title: 'Project Management',
    description: 'Professional project management services focused on timely delivery and quality results.',
    details: [
      'Utilizes skilled and experienced project managers',
      'Aims to complete projects on time, within budget, and with high-quality standards',
      'Focuses on realizing business benefits through effective project management'
    ],
    price: 2500,
    priceId: 'price_project_management_consulting'
  },
  {
    id: 'c3',
    category: 'Consulting',
    title: 'Productivity Improvements',
    description: 'Lean methodology implementation for enhanced production processes.',
    details: [
      'Introduces lean methodologies to improve production processes',
      'Concentrates efforts in valuable areas of the business',
      'Uses lean tools strategically based on organization\'s capacity and strategy'
    ],
    price: 2000,
    priceId: 'price_productivity_consulting'
  },
  {
    id: 'c4',
    category: 'Consulting',
    title: 'Quality and Process Improvements',
    description: 'Comprehensive quality enhancement services using proven methodologies.',
    details: [
      'Utilizes various techniques, including DMAIC, process mapping, and value stream analysis',
      'Aims to enhance the quality of products and services',
      'Recognizes the importance of quality for both internal and external customers'
    ],
    price: 2200,
    priceId: 'price_quality_consulting'
  },
  {
    id: 'c5',
    category: 'Consulting',
    title: 'OSHE Improvements',
    description: 'Occupational safety, health, and environmental program development.',
    details: [
      'Prioritizes workplace safety to increase performance and company reputation',
      'Assists in developing occupational safety, health, and environmental programs',
      'Aims to keep workers injury-free and show value for their safety and health'
    ],
    price: 2300,
    priceId: 'price_oshe_consulting'
  }
];

export const getConsultingById = (id: string) => 
  consultingServices.find(service => service.id === id); 