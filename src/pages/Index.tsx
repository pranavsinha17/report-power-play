
import React, { useState } from 'react';
import { PowerBIReport } from '../components/PowerBIReport';
import { Header } from '../components/Header';
import { TemplateSelector } from '../components/TemplateSelector';
import { UserSessionManager } from '../components/UserSessionManager';
import { PowerBITemplateUploader } from '../components/PowerBITemplateUploader';

export interface DataRow {
  [key: string]: string | number;
}

interface PowerBITemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  templateUrl: string;
  category: string;
}

interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  expiryTime: Date;
  templateId: string;
  reportInstanceId: string;
}

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PowerBITemplate | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [reportUrl, setReportUrl] = useState<string>('');
  const [reportName, setReportName] = useState<string>('');
  const [data, setData] = useState<DataRow[]>([]);

  const handleTemplateSelect = (template: PowerBITemplate) => {
    setSelectedTemplate(template);
  };

  const handleSessionCreated = (session: UserSession) => {
    setUserSession(session);
  };

  const handleReportGenerated = (url: string, name: string, csvData: DataRow[]) => {
    setReportUrl(url);
    setReportName(name);
    setData(csvData);
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setUserSession(null);
    setReportUrl('');
    setReportName('');
    setData([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!reportUrl ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {!selectedTemplate ? (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Power BI Template Integration
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Connect to existing Power BI templates with your CSV data
                  </p>
                </div>
                <TemplateSelector onTemplateSelect={handleTemplateSelect} />
              </div>
            ) : !userSession ? (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Create User Session
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Selected Template: <span className="font-medium text-blue-600">{selectedTemplate.name}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Each user gets an isolated 3-hour session with personalized report instance
                  </p>
                </div>
                <UserSessionManager onSessionCreated={(session) => {
                  const updatedSession = { ...session, templateId: selectedTemplate.id };
                  handleSessionCreated(updatedSession);
                }} />
                <div className="text-center">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    ← Back to Template Selection
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <UserSessionManager onSessionCreated={handleSessionCreated} />
                <PowerBITemplateUploader 
                  template={selectedTemplate}
                  session={userSession}
                  onReportGenerated={handleReportGenerated}
                />
                <div className="text-center mt-4">
                  <button
                    onClick={handleReset}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    ← Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <PowerBIReport 
            reportUrl={reportUrl}
            reportName={reportName}
            data={data}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
