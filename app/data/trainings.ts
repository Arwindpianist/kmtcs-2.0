export interface Training {
  id: number;
  title: string;
  category: string;
  description: string;
  priceId: string;
  content: {
    introduction: string;
    objectives?: string[];
    duration: string;
    price: number;
  };
}

export const trainings: Training[] = [
  {
    id: 1,
    category: 'Technical',
    title: 'Principles of Project Management',
    description: 'Master project planning, execution, monitoring, and closure methodologies.',
    priceId: 'price_project_management',
    content: {
      introduction: 'Comprehensive training on project management principles and practices.',
      duration: '3 days',
      price: 1500
    }
  },
  {
    id: 2,
    category: 'Technical',
    title: 'Total Quality Management (TQM)',
    description: 'Learn comprehensive quality management approaches for continuous improvement.',
    priceId: 'price_tqm',
    content: {
      introduction: 'In-depth training on TQM principles and implementation.',
      duration: '3 days',
      price: 1500
    }
  },
  {
    id: 3,
    category: 'Technical',
    title: 'Seven Quality Control (7QC) Tools and 5S',
    description: 'Essential quality control tools and workplace organization methods.',
    priceId: 'price_7qc_5s',
    content: {
      introduction: 'Learn essential quality control tools and 5S methodology.',
      duration: '2 days',
      price: 1200
    }
  },
  {
    id: 4,
    category: 'Technical',
    title: 'Total Productive Maintenance (TPM)',
    description: 'Comprehensive maintenance program for maximizing equipment effectiveness.',
    priceId: 'price_tpm',
    content: {
      introduction: 'Learn TPM principles and implementation strategies.',
      duration: '3 days',
      price: 1500
    }
  },
  {
    id: 5,
    category: 'Technical',
    title: 'Root Cause Analysis (RCA) Using Tripod Beta Method',
    description: 'Advanced problem-solving methodology for identifying root causes.',
    priceId: 'price_rca_tripod',
    content: {
      introduction: 'Master the Tripod Beta methodology for effective RCA.',
      duration: '2 days',
      price: 1400
    }
  },
  {
    id: 6,
    category: 'Technical',
    title: 'Advanced Maintenance Management and Methods',
    description: 'Advanced techniques for maintenance management and optimization.',
    priceId: 'price_adv_maintenance',
    content: {
      introduction: 'Learn advanced maintenance management strategies.',
      duration: '3 days',
      price: 1600
    }
  },
  {
    id: 7,
    category: 'Technical',
    title: 'QA and QC Inspectors in Action',
    description: 'Practical training for quality assurance and control inspection.',
    priceId: 'price_qa_qc',
    content: {
      introduction: 'Hands-on training for QA/QC inspectors.',
      duration: '2 days',
      price: 1300
    }
  },
  {
    id: 8,
    category: 'Technical',
    title: 'Mechanical Integrity in Petrochemical & Process Plants',
    description: 'Ensuring mechanical integrity in process plant operations.',
    priceId: 'price_mechanical_integrity',
    content: {
      introduction: 'Comprehensive coverage of mechanical integrity principles.',
      duration: '3 days',
      price: 1800
    }
  },
  {
    id: 9,
    category: 'Technical',
    title: 'Process Safety Management',
    description: 'Comprehensive approach to managing process safety in industrial operations.',
    priceId: 'price_process_safety',
    content: {
      introduction: 'Learn essential process safety management principles.',
      duration: '3 days',
      price: 1800
    }
  },
  {
    id: 10,
    category: 'Technical',
    title: 'Principles of Engineering Contract Management',
    description: 'Essential principles for managing engineering contracts effectively.',
    priceId: 'price_contract_management',
    content: {
      introduction: 'Master engineering contract management principles.',
      duration: '2 days',
      price: 1600
    }
  },
  {
    id: 11,
    category: 'Technical',
    title: 'Compressors and Pumps: Operations, Diagnostics, and Maintenance',
    description: 'Detailed training on industrial compressor and pump systems.',
    priceId: 'price_compressors_pumps',
    content: {
      introduction: 'Comprehensive coverage of compressor and pump systems.',
      duration: '3 days',
      price: 1900
    }
  },
  // ... continue with all technical trainings
];

export const nonTechnicalTrainings: Training[] = [
  {
    id: 101,
    category: 'Non-Technical',
    title: 'Advanced Leadership and Management Skills',
    description: 'Develop essential leadership competencies and management skills.',
    priceId: 'price_leadership',
    content: {
      introduction: 'Comprehensive leadership development program.',
      duration: '3 days',
      price: 1500
    }
  },
  {
    id: 102,
    category: 'Non-Technical',
    title: 'Skills for Effective Communication',
    description: 'Enhance your communication abilities for better workplace collaboration.',
    priceId: 'price_communication',
    content: {
      introduction: 'Develop effective communication skills.',
      duration: '2 days',
      price: 1200
    }
  },
  // Add all non-technical trainings from trainings.md
];

export const getTrainingById = (id: number) => 
  [...trainings, ...nonTechnicalTrainings].find(training => training.id === id);