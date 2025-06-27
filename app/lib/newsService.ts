export interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  summary: string;
  image?: string;
  source: 'hrdcorp' | 'mohr' | 'mef' | 'mdec' | 'mida';
  category: 'training' | 'policy' | 'industry' | 'technology' | 'employment' | 'investment';
  priority: 'high' | 'medium' | 'low';
}

export const newsSources = {
  hrdcorp: {
    name: "HRDCorp Official News",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  mohr: {
    name: "Ministry of Human Resources",
    color: "bg-green-600", 
    textColor: "text-green-600",
    bgColor: "bg-green-50"
  },
  mef: {
    name: "Malaysian Employers Federation",
    color: "bg-purple-600",
    textColor: "text-purple-600", 
    bgColor: "bg-purple-50"
  },
  mdec: {
    name: "Malaysian Digital Economy Corporation",
    color: "bg-orange-600",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  mida: {
    name: "Malaysian Investment Development Authority", 
    color: "bg-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50"
  }
};

// Real HRDCorp News with valid links
const hrdcorpNews: NewsItem[] = [
  {
    id: "hrd-1",
    title: "HRD AWARDS 2024 UNITES RISING AND REIGNING STARS OF MALAYSIA'S HUMAN CAPITAL DEVELOPMENT",
    link: "https://hrdcorp.gov.my/hrd-awards-2024-unites-rising-and-reigning-stars-of-malaysias-human-capital-development",
    date: "2024-11-07",
    summary: "The night of celebration witnessed human resources trailblazers emerging as winners of the prestigious HRD Awards 2024, recognizing excellence in human capital development across Malaysia.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/11/HRDCorp_News_HRDAwards2024_2.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "high"
  },
  {
    id: "hrd-2", 
    title: "KESUMA AND HRD CORP BROUGHT SENIOR ASEAN LEADERS TOGETHER AT THE INAUGURAL ASEAN SKILLS FORUM",
    link: "https://hrdcorp.gov.my/kesuma-and-hrd-corp-brought-senior-asean-leaders-together-at-the-inaugural-asf",
    date: "2024-10-04",
    summary: "Minister also announced key enhancements to HRD Corp's levy Allowable Training Cost (ATC) framework to support more comprehensive training programs.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/10/HRDCorp_News_ASF2024_2.jpg",
    source: "hrdcorp",
    category: "policy",
    priority: "high"
  },
  {
    id: "hrd-3",
    title: "YB STEVEN SIM CHEE KEONG OFFICIATES THE NATIONAL HUMAN CAPITAL CONFERENCE & EXHIBITION 2024",
    link: "https://hrdcorp.gov.my/yb-steven-sim-chee-keong-officiates-the-nhcce-2024",
    date: "2024-09-30",
    summary: "Southeast Asia's premier human capital development event, draws thought leaders, industry experts, and policymakers to discuss workforce transformation.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/09/HRDCorp_News_NHCCE2024_1.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "high"
  },
  {
    id: "hrd-4",
    title: "CHAIRMAN'S STATEMENT",
    link: "https://hrdcorp.gov.my/chairmans-statement",
    date: "2024-07-16",
    summary: "BUSINESS AS USUAL FOR ALL OPERATIONAL MATTERS AT HRD CORP",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/07/HRDCorp_News_Thumbnail.jpg",
    source: "hrdcorp",
    category: "policy",
    priority: "medium"
  },
  {
    id: "hrd-5",
    title: "PRINCESS OF JOHOR GRACES NEURODIVERSITY INCLUSION IMPACT PROGRAMME",
    link: "https://hrdcorp.gov.my/princess-of-johor-graces-neurodiversity-inclusion-impact-programme",
    date: "2024-06-27",
    summary: "HRD Corp and its partners prepare free training programmes and initiatives to support neurodiverse individuals in the workforce.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/07/HRDCorp_News_Neurodiversity_3.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "high"
  },
  {
    id: "hrd-6",
    title: "JOHOR CHIEF MINISTER LAUNCHES NATIONAL TRAINING WEEK (NTW) 2024",
    link: "https://hrdcorp.gov.my/johor-chief-minister-launches-national-training-week-ntw-2024",
    date: "2024-06-24",
    summary: "HRD Corp organised the opening ceremony of National Training Week (NTW) 2024, promoting lifelong learning culture among Malaysians.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/06/HRDCorp_News_Johor_1.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "high"
  },
  {
    id: "hrd-7",
    title: "OFFICIAL ANNOUNCEMENT",
    link: "https://hrdcorp.gov.my/official-announcement",
    date: "2024-05-29",
    summary: "OFFICIAL ANNOUNCEMENT",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/05/DATUK-ARIF-FARHAN-ENG-600x600.jpg",
    source: "hrdcorp",
    category: "policy",
    priority: "medium"
  },
  {
    id: "hrd-8",
    title: "PRIME MINISTER OFFICIATES THE INAUGURAL NATIONAL ANTI-CORRUPTION (NAC) SUMMIT 2024",
    link: "https://hrdcorp.gov.my/prime-minister-officiates-the-inaugural-national-anti-corruption-nac-summit-2024",
    date: "2024-02-29",
    summary: "PM commends long-term collaboration between HRD Corp and the MACC in promoting integrity and anti-corruption training.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_NACSummit2024_2.jpg",
    source: "hrdcorp",
    category: "policy",
    priority: "high"
  },
  {
    id: "hrd-9",
    title: "MOHR & HRD CORP ANNOUNCES TWO KEY UPDATES TO ENHANCE ACCESS TO ONLINE AND PHYSICAL TRAINING",
    link: "https://hrdcorp.gov.my/mohr-hrd-corp-announces-two-key-updates-to-enhance-access-to-online-and-physical-training",
    date: "2024-02-27",
    summary: "MOU with 13 learning & development partners will add over 1,000 new courses to the eLATiH platform.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_eLATiH2024_3.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "high"
  },
  {
    id: "hrd-10",
    title: "HRD CORP AND MOHR ORGANISE KARNIVAL LATIH MADANI AND PROGRAM KESUMA MADANI, PENANG",
    link: "https://hrdcorp.gov.my/hrd-corp-and-ministry-of-human-resources-organise-karnival-latih-madani-and-program-kesuma-madani-penang",
    date: "2024-02-24",
    summary: "Agency under the Ministry of Human Resources spreads festive joy and training opportunities to the community in Penang.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_KLM_Penang_1.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "medium"
  },
  {
    id: "hrd-11",
    title: "MOHR & HRD CORP SPREADS CHINESE NEW YEAR JOY",
    link: "https://hrdcorp.gov.my/minister-of-human-resources-hrd-corp-spreads-chinese-new-year-joy",
    date: "2024-02-21",
    summary: "Organisation celebrated the successes of its record-breaking year and announced new initiatives for 2024.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/02/HRDCorp_News_CNY2024_2.jpg",
    source: "hrdcorp",
    category: "policy",
    priority: "medium"
  },
  {
    id: "hrd-12",
    title: "MINISTER OF HUMAN RESOURCES ANNOUNCES NATIONAL TRAINING WEEK (NTW) 2024",
    link: "https://hrdcorp.gov.my/minister-of-human-resources-announces-national-training-week-ntw-2024",
    date: "2024-01-24",
    summary: "Training-focused week set to inculcate lifelong learning culture among Malaysians and promote skills development.",
    image: "https://hrdcorp.gov.my/wp-content/uploads/2024/01/HRDCorp_News_NTW2024_1.jpg",
    source: "hrdcorp",
    category: "training",
    priority: "high"
  }
];

// Combine all news sources (currently only HRDCorp has real links)
export const allNews: NewsItem[] = [
  ...hrdcorpNews
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Filter functions
export const filterNewsBySource = (news: NewsItem[], source?: string) => {
  if (!source) return news;
  return news.filter(item => item.source === source);
};

export const filterNewsByCategory = (news: NewsItem[], category?: string) => {
  if (!category) return news;
  return news.filter(item => item.category === category);
};

export const filterNewsByPriority = (news: NewsItem[], priority?: string) => {
  if (!priority) return news;
  return news.filter(item => item.priority === priority);
};

export const getNewsBySource = (source: string) => {
  return allNews.filter(item => item.source === source);
};

export const getLatestNews = (limit: number = 10) => {
  return allNews.slice(0, limit);
};

export const getHighPriorityNews = () => {
  return allNews.filter(item => item.priority === 'high');
}; 