import DashboardStats from "@/components/dashboard-stats";
import InquiryForm from "@/components/inquiry-form";
import GeneratedResponse from "@/components/generated-response";
import QuickTemplates from "@/components/quick-templates";
import RecentActivity from "@/components/recent-activity";
import LanguageStats from "@/components/language-stats";
import ResponseHistory from "@/components/response-history";
import { useState } from "react";
import { GraduationCap, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneratedResponseData {
  id: number;
  content: string;
  language: string;
  responseTime: number;
  inquiry?: {
    type: string;
    content: string;
  };
}

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [generatedResponse, setGeneratedResponse] = useState<GeneratedResponseData | null>(null);

  const languageOptions = [
    { value: "en", label: "🇺🇸 English" },
    { value: "es", label: "🇪🇸 Español" },
    { value: "fr", label: "🇫🇷 Français" },
    { value: "de", label: "🇩🇪 Deutsch" },
    { value: "zh", label: "🇨🇳 中文" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-bold text-slate-900">EduRespond</h1>
              </div>
              <span className="text-sm text-slate-500 hidden sm:block">Teacher Automation Platform</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="text-slate-600" size={14} />
                </div>
                <span className="text-sm font-medium text-slate-700">Sarah Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <InquiryForm 
              currentLanguage={currentLanguage} 
              onResponseGenerated={setGeneratedResponse}
            />
            
            {generatedResponse && (
              <GeneratedResponse 
                response={generatedResponse}
                onResponseUpdate={setGeneratedResponse}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickTemplates />
            <RecentActivity />
            <LanguageStats />
          </div>
        </div>

        {/* Response History */}
        <ResponseHistory />
      </div>
    </div>
  );
}
