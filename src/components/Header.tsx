
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Power BI Integration</h1>
            <p className="text-sm text-gray-500">CSV to Power BI Dashboard</p>
          </div>
        </div>
      </div>
    </header>
  );
};
