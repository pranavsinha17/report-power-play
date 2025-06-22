
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Download, RotateCcw, Maximize2, Clock, Shield, Database } from 'lucide-react';
import { DataRow } from '../pages/Index';

interface PowerBIReportProps {
  reportUrl: string;
  reportName: string;
  data: DataRow[];
  onReset: () => void;
}

export const PowerBIReport: React.FC<PowerBIReportProps> = ({ 
  reportUrl, 
  reportName, 
  data, 
  onReset 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionTime, setSessionTime] = useState<string>('');

  useEffect(() => {
    // Simulate session timing
    const startTime = new Date();
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const remaining = (3 * 60 * 60 * 1000) - elapsed; // 3 hours - elapsed
      
      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setSessionTime(`${hours}h ${minutes}m remaining`);
      } else {
        setSessionTime('Session expired');
        clearInterval(interval);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleDownloadReport = () => {
    const reportSummary = {
      reportName,
      generatedAt: new Date().toISOString(),
      dataRows: data.length,
      powerBiUrl: reportUrl,
      reportType: 'Template-based Report',
      userIsolated: true,
      sessionBased: true,
      summary: `Power BI template report with ${data.length} rows of user data`
    };

    const blob = new Blob([JSON.stringify(reportSummary, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_powerbi_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInPowerBI = () => {
    // Extract report details from URL
    const reportId = reportUrl.split('reportId=')[1]?.split('&')[0];
    alert(`Opening isolated Power BI report instance: ${reportId}\n\nIn production, this would open your personalized report in Power BI with your session credentials.`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <span>{reportName}</span>
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
            <span className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>User Isolated</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{sessionTime}</span>
            </span>
            <span>{data.length} rows processed</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={openInPowerBI} variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Power BI
          </Button>
          <Button onClick={onReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Session Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Isolated Report Instance</p>
                <p className="text-sm text-blue-700">Your data is processed in a separate, secure environment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-blue-900">{sessionTime}</p>
              <p className="text-sm text-blue-700">Session auto-cleanup enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Power BI Report Embed */}
      <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Power BI Template Report</CardTitle>
          <Button 
            onClick={toggleFullscreen} 
            variant="ghost" 
            size="sm"
          >
            <Maximize2 className="h-4 w-4" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className={`bg-gray-100 border rounded-lg ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'}`}>
            {/* Mock Power BI iframe with template-specific content */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl">📊</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Power BI Template Report</h3>
                  <p className="text-gray-600">Template-based dashboard with your CSV data</p>
                </div>
                
                <div className="bg-white/70 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Report Instance:</span>
                    <span className="font-mono text-xs">{reportUrl.split('reportId=')[1]?.split('&')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Data Source:</span>
                    <span>User CSV ({data.length} rows)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Template Type:</span>
                    <span>Pre-configured Dashboard</span>
                  </div>
                </div>

                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    ✅ Template data source successfully replaced with your CSV data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Report Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Data Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">{data.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Session Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">Isolated</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Auto-Cleanup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-600">Enabled</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
