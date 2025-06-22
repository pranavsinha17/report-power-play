
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload } from 'lucide-react';
import { DataRow } from '../pages/Index';
import { analyzeData } from '../utils/csvParser';
import { ChartContainer } from './ChartContainer';
import { DataTable } from './DataTable';
import { SummaryStats } from './SummaryStats';

interface DashboardProps {
  data: DataRow[];
  columns: string[];
  fileName: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, columns, fileName, onReset }) => {
  const [selectedXAxis, setSelectedXAxis] = useState<string>(columns[0] || '');
  const [selectedYAxis, setSelectedYAxis] = useState<string>(columns[1] || '');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');

  const analysis = useMemo(() => analyzeData(data, columns), [data, columns]);

  const handleExport = () => {
    // Create downloadable JSON report
    const report = {
      fileName,
      uploadDate: new Date().toISOString(),
      dataAnalysis: analysis,
      sampleData: data.slice(0, 10), // First 10 rows as sample
      charts: {
        xAxis: selectedXAxis,
        yAxis: selectedYAxis,
        type: chartType
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.csv', '')}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{fileName} Dashboard</h1>
          <p className="text-gray-600">{data.length} rows • {columns.length} columns</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={onReset} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload New File
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <SummaryStats analysis={analysis} />

      {/* Main Content */}
      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Charts & Visualizations</TabsTrigger>
          <TabsTrigger value="data">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          {/* Chart Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Chart Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Chart Type</label>
                  <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">X-Axis</label>
                  <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Y-Axis</label>
                  <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {analysis.numericColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              data={data}
              xAxis={selectedXAxis}
              yAxis={selectedYAxis}
              type={chartType}
              title={`${selectedYAxis} by ${selectedXAxis}`}
            />
            {analysis.numericColumns.length > 1 && (
              <ChartContainer
                data={data}
                xAxis={selectedXAxis}
                yAxis={analysis.numericColumns.find(col => col !== selectedYAxis) || analysis.numericColumns[0]}
                type="line"
                title="Trend Analysis"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="data">
          <DataTable data={data} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
