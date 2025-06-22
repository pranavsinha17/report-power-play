
import React, { useCallback, useState } from 'react';
import { Upload, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseCSV } from '../utils/csvParser';
import { DataRow } from '../pages/Index';

interface PowerBIUploaderProps {
  onReportGenerated: (reportUrl: string, reportName: string, data: DataRow[]) => void;
}

export const PowerBIUploader: React.FC<PowerBIUploaderProps> = ({ onReportGenerated }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportName, setReportName] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  // Mock Power BI processing steps
  const simulateUploadProcess = async (fileName: string, data: DataRow[]) => {
    const steps = [
      'Connecting to Power BI service...',
      'Uploading CSV data...',
      'Creating dataset...',
      'Generating visualizations...',
      'Publishing report...',
      'Generating embed URL...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    }

    // Generate mock Power BI embed URL
    const mockReportId = Math.random().toString(36).substr(2, 9);
    const mockEmbedUrl = `https://app.powerbi.com/reportEmbed?reportId=${mockReportId}&groupId=mock-workspace&config=mock-config`;
    
    return mockEmbedUrl;
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    if (!reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const { data } = parseCSV(text);
      
      // Simulate Power BI upload process
      const embedUrl = await simulateUploadProcess(file.name, data);
      
      onReportGenerated(embedUrl, reportName, data);
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [onReportGenerated, reportName]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ExternalLink className="h-5 w-5 text-blue-600" />
          <span>Upload to Power BI</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-name">Report Name</Label>
          <Input
            id="report-name"
            placeholder="Enter your Power BI report name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <div>
                <p className="text-gray-900 font-medium">Processing with Power BI</p>
                <p className="text-gray-600 text-sm">{processingStep}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload CSV to Power BI
                </h3>
                <p className="text-gray-500 mb-4">
                  Your CSV will be uploaded to Power BI and automatically converted to an interactive report
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => document.getElementById('csv-input')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!reportName.trim()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose CSV File
                </Button>
                <input
                  id="csv-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400">
                Supported format: CSV files up to 10MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
