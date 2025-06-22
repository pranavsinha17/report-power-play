
import { DataRow } from '../pages/Index';

export const parseCSV = (csvText: string): { data: DataRow[], columns: string[] } => {
  const lines = csvText.trim().split('\n');
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse header
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  
  // Parse data rows
  const data: DataRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    
    if (values.length === headers.length) {
      const row: DataRow = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to convert to number if possible
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      data.push(row);
    }
  }

  return { data, columns: headers };
};

export const analyzeData = (data: DataRow[], columns: string[]) => {
  const analysis = {
    totalRows: data.length,
    numericColumns: [] as string[],
    categoricalColumns: [] as string[],
    summary: {} as Record<string, any>
  };

  columns.forEach(column => {
    const values = data.map(row => row[column]);
    const numericValues = values.filter(val => typeof val === 'number') as number[];
    
    if (numericValues.length / values.length > 0.5) {
      analysis.numericColumns.push(column);
      analysis.summary[column] = {
        type: 'numeric',
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
        total: numericValues.reduce((sum, val) => sum + val, 0)
      };
    } else {
      analysis.categoricalColumns.push(column);
      const uniqueValues = [...new Set(values)];
      analysis.summary[column] = {
        type: 'categorical',
        uniqueCount: uniqueValues.length,
        topValues: uniqueValues.slice(0, 10)
      };
    }
  });

  return analysis;
};
