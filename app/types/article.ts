export interface Article {
  id: string;
  title: string;
  description: string;
  content: {
    introduction?: string;
    objectives?: string[];
    courseContents?: {
      day1?: string[];
      day2?: string[];
    };
    targetAudience?: string[];
    methodology?: string;
    duration?: string;
    hrdCorpNo?: string;
    price: number;
    priceId: string;
  };
} 