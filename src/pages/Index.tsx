
import React, { useState } from 'react';
import { PowerBIUploader } from '../components/PowerBIUploader';
import { PowerBIReport } from '../components/PowerBIReport';
import { Header } from '../components/Header';

export interface DataRow {
  [key: string]: string | number;
}

const Index = () => {
  const [reportUrl, setReportUrl] = useState<string>('');
  const [reportName, setReportName] = useState<string>('');
  const [data, setData] = useState<DataRow[]>([]);

  const handleReportGenerated = (url: string, name: string, csvData: DataRow[]) => {
    setReportUrl(url);
    setReportName(name);
    setData(csvData);
  };

  const handleReset = () => {
    setReportUrl('');
    setReportName('');
    setData([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!reportUrl ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Power BI Report Generator
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload your CSV file and generate interactive Power BI reports instantly
              </p>
            </div>
            <PowerBIUploader onReportGenerated={handleReportGenerated} />
          </div>
        ) : (
          <PowerBIReport 
            reportUrl={reportUrl}
            reportName={reportName}
            data={data}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
