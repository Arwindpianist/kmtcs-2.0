// app/services/googleSheetService.ts
import type { Service } from '@/app/types/service';

export async function fetchServices(): Promise<Service[]> {
  try {
    const sheetId = process.env.NEXT_PUBLIC_SERVICES_SHEET_ID;
    if (!sheetId) throw new Error('Missing SERVICES_SHEET_ID');

    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const rawData = await response.text();
    const jsonMatch = rawData.match(/google\.visualization\.Query\.setResponse\((.+?)\);/s);
    if (!jsonMatch?.[1]) throw new Error('Invalid response format');
    
    const jsonData = JSON.parse(jsonMatch[1]);
    const headerRow = jsonData.table.rows[0].c.map((cell: any) => 
      cell?.v?.toString().trim().toLowerCase() || ''
    );

    // Column indices with validation
    const getColumnIndex = (name: string) => {
      const index = headerRow.indexOf(name.toLowerCase());
      if (index === -1) throw new Error(`Missing column: ${name}`);
      return index;
    };

    const columnIndices = {
      title: getColumnIndex('Title'),
      shortDescription: getColumnIndex('Short Description'),
      duration: getColumnIndex('Duration'),
      id: getColumnIndex('ID'),
      type: getColumnIndex('Type')
    };

    return jsonData.table.rows.slice(1) // Skip header
      .map((row: any) => {
        const getValue = (index: number) => row.c[index]?.v?.toString().trim() || '';
        
        // Validate and normalize type
        const rawType = getValue(columnIndices.type);
        const typeMap: Record<string, Service['type']> = {
          'technical': 'Technical',
          'non-technical': 'Non-Technical',
          'nontechnical': 'Non-Technical',
          'consulting': 'Consulting'
        };
        
        const serviceType = typeMap[rawType.toLowerCase()] || 'Technical';

        return {
          id: getValue(columnIndices.id),
          title: getValue(columnIndices.title),
          shortDescription: getValue(columnIndices.shortDescription),
          duration: getValue(columnIndices.duration),
          type: serviceType
        };
      })
      .filter(service => 
        service.id && 
        service.title && 
        service.type && 
        !service.id.includes('#VALUE!')
      );
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}