'use client';

import NewsCard from '@/app/components/NewsCard';
import BackgroundLines from '../components/BackgroundLines';

interface NewsItem {
  title: string;
  link: string;
  date: string;
  summary: string;
  image: string;
}

const hardcodedNews: NewsItem[] = [
  // Your provided news data
    {
      "title": "HRD AWARDS 2024 UNITES RISING AND REIGNING STARS OF MALAYSIA’S HUMAN CAPITAL DEVELOPMENT",
      "link": "https://hrdcorp.gov.my/hrd-awards-2024-unites-rising-and-reigning-stars-of-malaysias-human-capital-development",
      "date": "November 7, 2024",
      "summary": "The night of celebration witnessed human resources trailblazers emerging as...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/11/HRDCorp_News_HRDAwards2024_2.jpg"
    },
    {
      "title": "KESUMA AND HRD CORP BROUGHT SENIOR ASEAN LEADERS TOGETHER AT THE INAUGURAL ASEAN SKILLS FORUM",
      "link": "https://hrdcorp.gov.my/kesuma-and-hrd-corp-brought-senior-asean-leaders-together-at-the-inaugural-asf",
      "date": "October 4, 2024",
      "summary": "Minister also announced key enhancements to HRD Corp’s levy Allowable...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/10/HRDCorp_News_ASF2024_2.jpg"
    },
    {
      "title": "YB STEVEN SIM CHEE KEONG OFFICIATES THE NATIONAL HUMAN CAPITAL CONFERENCE & EXHIBITION 2024",
      "link": "https://hrdcorp.gov.my/yb-steven-sim-chee-keong-officiates-the-nhcce-2024",
      "date": "September 30, 2024",
      "summary": "Southeast Asia’s premier human capital development event, draws thought leaders,...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/09/HRDCorp_News_NHCCE2024_1.jpg"
    },
    {
      "title": "CHAIRMAN’S STATEMENT",
      "link": "https://hrdcorp.gov.my/chairmans-statement",
      "date": "July 16, 2024",
      "summary": "BUSINESS AS USUAL FOR ALL OPERATIONAL MATTERS AT HRD CORP",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/07/HRDCorp_News_Thumbnail.jpg"
    },
    {
      "title": "PRINCESS OF JOHOR GRACES NEURODIVERSITY INCLUSION IMPACT PROGRAMME",
      "link": "https://hrdcorp.gov.my/princess-of-johor-graces-neurodiversity-inclusion-impact-programme",
      "date": "June 27, 2024",
      "summary": "HRD Corp and its partners prepare free training programmes and...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/07/HRDCorp_News_Neurodiversity_3.jpg"
    },
    {
      "title": "JOHOR CHIEF MINISTER LAUNCHES NATIONAL TRAINING WEEK (NTW) 2024",
      "link": "https://hrdcorp.gov.my/johor-chief-minister-launches-national-training-week-ntw-2024",
      "date": "June 24, 2024",
      "summary": "HRD Corp organised the opening ceremony of National Training Week...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/06/HRDCorp_News_Johor_1.jpg"
    },
    {
      "title": "OFFICIAL ANNOUNCEMENT",
      "link": "https://hrdcorp.gov.my/official-announcement",
      "date": "May 29, 2024",
      "summary": "OFFICIAL ANNOUNCEMENT",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/05/DATUK-ARIF-FARHAN-ENG-600x600.jpg"
    },
    {
      "title": "PRIME MINISTER OFFICIATES THE INAUGURAL NATIONAL ANTI-CORRUPTION (NAC) SUMMIT 2024",
      "link": "https://hrdcorp.gov.my/prime-minister-officiates-the-inaugural-national-anti-corruption-nac-summit-2024",
      "date": "February 29, 2024",
      "summary": "PM commends long-term collaboration between HRD Corp and the MACC...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_NACSummit2024_2.jpg"
    },
    {
      "title": "MOHR & HRD CORP ANNOUNCES TWO KEY UPDATES TO ENHANCE ACCESS TO ONLINE AND PHYSICAL TRAINING",
      "link": "https://hrdcorp.gov.my/mohr-hrd-corp-announces-two-key-updates-to-enhance-access-to-online-and-physical-training",
      "date": "February 27, 2024",
      "summary": "MOU with 13 learning & development partners will add over...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_eLATiH2024_3.jpg"
    },
    {
      "title": "HRD CORP AND MOHR ORGANISE KARNIVAL LATIH MADANI AND PROGRAM KESUMA MADANI, PENANG",
      "link": "https://hrdcorp.gov.my/hrd-corp-and-ministry-of-human-resources-organise-karnival-latih-madani-and-program-kesuma-madani-penang",
      "date": "February 24, 2024",
      "summary": "Agency under the Ministry of Human Resources spreads festive joy...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_KLM_Penang_1.jpg"
    },
    {
      "title": "MOHR & HRD CORP SPREADS CHINESE NEW YEAR JOY",
      "link": "https://hrdcorp.gov.my/minister-of-human-resources-hrd-corp-spreads-chinese-new-year-joy",
      "date": "February 21, 2024",
      "summary": "Organisation celebrated the successes of its record-breaking year and announced...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_CNY2024_2.jpg"
    },
    {
      "title": "MINISTER OF HUMAN RESOURCES ANNOUNCES NATIONAL TRAINING WEEK (NTW) 2024",
      "link": "https://hrdcorp.gov.my/minister-of-human-resources-announces-national-training-week-ntw-2024",
      "date": "January 24, 2024",
      "summary": "Training-focused week set to inculcate lifelong learning culture among Malaysians...",
      "image": "https://hrdcorp.gov.my/wp-content/uploads/2024/01/HRDCorp_News_NTW2024_1.jpg"
    }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <BackgroundLines />
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8 md:mb-12">
          Latest HRDCorp News & Updates
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {hardcodedNews.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}