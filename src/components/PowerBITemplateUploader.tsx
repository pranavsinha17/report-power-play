
import React, { useCallback, useState } from 'react';
import { Upload, FileText, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCSV } from '../utils/csvParser';
import { DataRow } from '../pages/Index';

interface PowerBITemplate {
  id: string;
  name: string;
  templateUrl: string;
}

interface UserSession {
  userId: string;
  sessionId: string;
  reportInstanceId: string;
  templateId: string;
}

interface PowerBITemplateUploaderProps {
  template: PowerBITemplate;
  session: UserSession;
  onReportGenerated: (reportUrl: string, reportName: string, data: DataRow[]) => void;
}

export const PowerBITemplateUploader: React.FC<PowerBITemplateUploaderProps> = ({ 
  template, 
  session, 
  onReportGenerated 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const simulatePowerBIIntegration = async (fileName: string, data: DataRow[]) => {
    const steps = [
      'Connecting to Power BI workspace...',
      'Cloning template report for user session...',
      'Uploading CSV data to isolated dataset...',
      'Replacing template data source...',
      'Refreshing report calculations...',
      'Generating user-specific embed URL...',
      'Applying security filters...',
      'Report ready for viewing'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    }

    // Generate user-specific embed URL
    const userSpecificUrl = `https://app.powerbi.com/reportEmbed?reportId=${session.reportInstanceId}&groupId=workspace-${session.userId}&config=${session.sessionId}&filter=user_id eq '${session.userId}'`;
    
    return userSpecificUrl;
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const { data } = parseCSV(text);
      
      console.log(`Processing CSV for user ${session.userId} with template ${template.id}`);
      console.log(`Report instance: ${session.reportInstanceId}`);
      
      const embedUrl = await simulatePowerBIIntegration(file.name, data);
      
      const reportName = `${template.name} - ${session.userId}`;
      onReportGenerated(embedUrl, reportName, data);
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [template, session, onReportGenerated]);

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
          <Database className="h-5 w-5 text-blue-600" />
          <span>Upload Data for {template.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Template Information</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Template:</strong> {template.name}</p>
            <p><strong>User:</strong> {session.userId}</p>
            <p><strong>Instance ID:</strong> <code className="bg-blue-100 px-1 rounded">{session.reportInstanceId}</code></p>
          </div>
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
                <p className="text-gray-900 font-medium">Processing with Power BI Template</p>
                <p className="text-blue-600 text-sm font-medium">{processingStep}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Replace Template Data Source
                </h3>
                <p className="text-gray-500 mb-4">
                  Your CSV will replace the template's sample data and generate a personalized report
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => document.getElementById('csv-input')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload CSV Data
                </Button>
                <input
                  id="csv-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• CSV data will be uploaded to your isolated Power BI dataset</p>
                <p>• Template visualizations will automatically update with your data</p>
                <p>• Report will be available for 3 hours in your session</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
