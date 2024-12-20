import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Article } from '../../types/article';

const articlesDirectory = path.join(process.cwd(), 'app/articles');

function parseArticleContent(content: string, fileName: string): Article {
  const sections = content.split(/\d\.\d:?\s+/);
  const titleMatch = content.match(/1\.0:?\s*Title\s*\n+([^\n]+)/);
  const hrdCorpMatch = content.match(/HRDCorp.*No:?\s*([^\n]+)/);
  const introMatch = content.match(/Introduction\s*\n+([^#]+?)(?=\d|\n\s*\n)/);
  const objectivesMatch = content.match(/(?:Objectives?|Learning Outcome)[^]*?(?=\d\.\d|Course Contents)/);
  const contentsMatch = content.match(/Course Contents[^]*?(?=\d\.\d|Who should attend|Target Audience)/);
  const audienceMatch = content.match(/(?:Who should attend|Target Audience)[^]*?(?=\d\.\d|Training Methodology)/);
  const priceMatch = content.match(/Price:\s*RM\s*(\d+)/i);

  return {
    id: fileName
      .replace(/\.txt$/, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''),
    title: titleMatch?.[1]?.trim() || '',
    description: introMatch?.[1]?.trim()?.split('\n')?.[0] || '',
    content: {
      introduction: introMatch?.[1]?.trim() || '',
      hrdCorpNo: hrdCorpMatch?.[1]?.trim() || '',
      objectives:
        objectivesMatch?.[0]
          ?.split('\n')
          ?.filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
          ?.map((line) => line.replace(/^[•-]\s*/, '').trim()) || [],
      courseContents: {
        day1:
          contentsMatch?.[0]
            ?.match(/Day 1[^]*?(?=Day 2|\d\.\d|$)/)?.[0]
            ?.split('\n')
            ?.filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
            ?.map((line) => line.replace(/^[•-]\s*/, '').trim()) || [],
        day2:
          contentsMatch?.[0]
            ?.match(/Day 2[^]*?(?=Day 3|\d\.\d|$)/)?.[0]
            ?.split('\n')
            ?.filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
            ?.map((line) => line.replace(/^[•-]\s*/, '').trim()) || [],
      },
      targetAudience:
        audienceMatch?.[0]
          ?.split('\n')
          ?.filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
          ?.map((line) => line.replace(/^[•-]\s*/, '').trim()) || [],
      duration: content.toLowerCase().includes('two-day')
        ? '2 days'
        : content.toLowerCase().includes('three-day')
        ? '3 days'
        : undefined,
      price: priceMatch ? parseInt(priceMatch[1]) : 1500,
      priceId: `price_${fileName.replace(/\.txt$/, '').toLowerCase()}`,
    },
  };
}

export async function GET() {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.txt'))
      .map((fileName) => {
        const filePath = path.join(articlesDirectory, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return parseArticleContent(fileContent, fileName);
      });

    return NextResponse.json(articles); // Corrected to use NextResponse.json
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
