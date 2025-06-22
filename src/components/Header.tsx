
import React from 'react';
import { FileText } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DataViz Pro</h1>
            <p className="text-sm text-gray-500">Professional CSV Analytics</p>
          </div>
        </div>
      </div>
    </header>
  );
};
