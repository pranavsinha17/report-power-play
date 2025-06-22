
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataRow } from '../pages/Index';

interface ChartContainerProps {
  data: DataRow[];
  xAxis: string;
  yAxis: string;
  type: 'bar' | 'line' | 'area' | 'pie';
  title: string;
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export const ChartContainer: React.FC<ChartContainerProps> = ({ data, xAxis, yAxis, type, title }) => {
  const chartData = useMemo(() => {
    if (type === 'pie') {
      // Aggregate data for pie chart
      const aggregated: Record<string, number> = {};
      data.forEach(row => {
        const key = String(row[xAxis]);
        const value = typeof row[yAxis] === 'number' ? row[yAxis] : 0;
        aggregated[key] = (aggregated[key] || 0) + value;
      });
      
      return Object.entries(aggregated)
        .map(([name, value]) => ({ name, value }))
        .slice(0, 8); // Limit to 8 slices for readability
    }

    // For other chart types, limit and sort data
    return data
      .filter(row => row[xAxis] !== undefined && row[yAxis] !== undefined)
      .slice(0, 20) // Limit to 20 data points for performance
      .map(row => ({
        [xAxis]: String(row[xAxis]),
        [yAxis]: typeof row[yAxis] === 'number' ? row[yAxis] : 0
      }));
  }, [data, xAxis, yAxis, type]);

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#3B82F6" />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yAxis} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
          </AreaChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
