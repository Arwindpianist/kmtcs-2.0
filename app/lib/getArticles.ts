import fs from 'fs'
import path from 'path'

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

const articlesDirectory = path.join(process.cwd(), 'app/articles')

export function parseArticleContent(content: string): Article {
  const sections = content.split(/\d\.\d:?\s+/);
  const titleMatch = content.match(/1\.0:?\s*Title\s*\n+([^\n]+)/);
  const hrdCorpMatch = content.match(/HRDCorp.*No:?\s*([^\n]+)/);
  const introMatch = content.match(/Introduction\s*\n+([^#]+?)(?=\d|\n\s*\n)/);
  const objectivesMatch = content.match(/(?:Objectives?|Learning Outcome)[^]*?(?=\d\.\d|Course Contents)/);
  const contentsMatch = content.match(/Course Contents[^]*?(?=\d\.\d|Who should attend|Target Audience)/);
  const audienceMatch = content.match(/(?:Who should attend|Target Audience)[^]*?(?=\d\.\d|Training Methodology)/);

  const id = path.basename(content).replace(/\.[^/.]+$/, '').toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const objectives = objectivesMatch 
    ? objectivesMatch[0]
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map(line => line.replace(/^[•-]\s*/, '').trim())
    : [];

  const courseContents = {
    day1: [],
    day2: []
  };

  if (contentsMatch) {
    const dayMatches = contentsMatch[0].match(/Day \d[^]*?(?=Day \d|\d\.\d|$)/g);
    if (dayMatches) {
      dayMatches.forEach((day, index) => {
        const items = day
          .split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
          .map(line => line.replace(/^[•-]\s*/, '').trim());
        if (index === 0) courseContents.day1 = items;
        if (index === 1) courseContents.day2 = items;
      });
    }
  }

  return {
    id,
    title: titleMatch ? titleMatch[1].trim() : '',
    description: introMatch ? introMatch[1].trim().split('\n')[0] : '',
    content: {
      introduction: introMatch ? introMatch[1].trim() : '',
      hrdCorpNo: hrdCorpMatch ? hrdCorpMatch[1].trim() : '',
      objectives,
      courseContents,
      targetAudience: audienceMatch 
        ? audienceMatch[0]
            .split('\n')
            .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
            .map(line => line.replace(/^[•-]\s*/, '').trim())
        : [],
      duration: content.toLowerCase().includes('two-day') ? '2 days' : 
                content.toLowerCase().includes('three-day') ? '3 days' : undefined,
      price: 0,
      priceId: ''
    }
  };
}

export function getAllArticles(): Article[] {
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.txt'))
    .map(fileName => {
      const filePath = path.join(articlesDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return parseArticleContent(fileContent);
    });

  return articles;
}

export function getArticleById(id: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find(article => article.id === id);
} 