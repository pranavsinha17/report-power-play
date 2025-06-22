
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, TrendingUp, PieChart } from 'lucide-react';

interface PowerBITemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  templateUrl: string;
  category: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: PowerBITemplate) => void;
}

const templates: PowerBITemplate[] = [
  {
    id: 'sales-dashboard',
    name: 'Sales Performance Dashboard',
    description: 'Track sales metrics, revenue trends, and performance KPIs',
    icon: <TrendingUp className="h-8 w-8 text-green-600" />,
    templateUrl: 'template-sales-dashboard-001',
    category: 'Sales'
  },
  {
    id: 'hr-analytics',
    name: 'HR Analytics Dashboard',
    description: 'Employee metrics, recruitment data, and workforce analytics',
    icon: <Users className="h-8 w-8 text-blue-600" />,
    templateUrl: 'template-hr-analytics-002',
    category: 'Human Resources'
  },
  {
    id: 'financial-report',
    name: 'Financial Reporting',
    description: 'Financial statements, budget analysis, and cost tracking',
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    templateUrl: 'template-financial-003',
    category: 'Finance'
  },
  {
    id: 'customer-insights',
    name: 'Customer Insights',
    description: 'Customer behavior, satisfaction scores, and engagement metrics',
    icon: <PieChart className="h-8 w-8 text-orange-600" />,
    templateUrl: 'template-customer-004',
    category: 'Marketing'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Power BI Template
        </h2>
        <p className="text-gray-600">
          Choose a pre-built template that matches your data structure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                {template.icon}
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </CardTitle>
                  <span className="text-sm text-gray-500">{template.category}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                {template.description}
              </p>
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
