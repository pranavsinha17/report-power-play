
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Download, RotateCcw, Maximize2 } from 'lucide-react';
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

  const handleDownloadReport = () => {
    // In a real implementation, this would download the actual Power BI report
    // For now, we'll create a mock report summary
    const reportSummary = {
      reportName,
      generatedAt: new Date().toISOString(),
      dataRows: data.length,
      powerBiUrl: reportUrl,
      summary: `Power BI report generated from ${data.length} rows of data`
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
    // In a real implementation, this would open the actual Power BI report
    alert('In a real implementation, this would open your report in Power BI');
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
            <ExternalLink className="h-8 w-8 text-blue-600" />
            <span>{reportName}</span>
          </h1>
          <p className="text-gray-600">Power BI Report • {data.length} rows processed</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={openInPowerBI} variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Power BI
          </Button>
          <Button onClick={onReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Upload New File
          </Button>
        </div>
      </div>

      {/* Power BI Report Embed */}
      <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Power BI Dashboard</CardTitle>
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
            {/* Mock Power BI iframe - replace with actual Power BI embed */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
              <div className="text-center space-y-4">
                <div className="text-6xl">📊</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Power BI Report</h3>
                  <p className="text-gray-600">Interactive dashboard would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Report ID: {reportUrl.split('reportId=')[1]?.split('&')[0]}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-gray-700">
                    In production, this would be an embedded Power BI report iframe with your actual dashboard and visualizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">Published</div>
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
            <CardTitle className="text-sm font-medium text-gray-600">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">Just now</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
