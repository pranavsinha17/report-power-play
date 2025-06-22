
import React, { useState } from 'react';
import { CSVUploader } from '../components/CSVUploader';
import { Dashboard } from '../components/Dashboard';
import { Header } from '../components/Header';

export interface DataRow {
  [key: string]: string | number;
}

const Index = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleDataUpload = (uploadedData: DataRow[], uploadedColumns: string[], name: string) => {
    setData(uploadedData);
    setColumns(uploadedColumns);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {data.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                CSV Dashboard Generator
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload your CSV file and generate beautiful, interactive dashboards instantly
              </p>
            </div>
            <CSVUploader onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <Dashboard 
            data={data} 
            columns={columns} 
            fileName={fileName}
            onReset={() => {
              setData([]);
              setColumns([]);
              setFileName('');
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
