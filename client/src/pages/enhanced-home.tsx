import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Calendar, 
  Paperclip, 
  Bell, 
  BarChart3, 
  Users, 
  Bot,
  GraduationCap,
  Settings,
  TrendingUp,
  Clock
} from "lucide-react";

// Import all the enhanced components
import InquiryForm from "@/components/inquiry-form";
import GeneratedResponse from "@/components/generated-response";
import DashboardStats from "@/components/dashboard-stats";
import ResponseHistory from "@/components/response-history";
import QuickTemplates from "@/components/quick-templates";
import RecentActivity from "@/components/recent-activity";
import LanguageStats from "@/components/language-stats";
import StudentProfileForm from "@/components/student-profile-form";
import ToneSelector from "@/components/tone-selector";
import ScheduledMessages from "@/components/scheduled-messages";
import AttachmentManager from "@/components/attachment-manager";
import NotificationCenter from "@/components/notification-center";
import FaqBot from "@/components/faq-bot";

interface GeneratedResponseData {
  id: number;
  content: string;
  language: string;
  tone: string;
  responseTime: number;
  inquiry?: {
    type: string;
    content: string;
  };
}

export default function EnhancedHome() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [generatedResponse, setGeneratedResponse] = useState<GeneratedResponseData | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const unreadNotifications = notifications?.filter((n: any) => !n.isRead).length || 0;

  const handleResponseGenerated = (response: GeneratedResponseData) => {
    setGeneratedResponse(response);
    setActiveTab("response");
  };

  const features = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: BarChart3,
      description: "Analytics and insights",
      color: "text-blue-500",
    },
    {
      id: "inquiry",
      name: "New Inquiry",
      icon: MessageSquare,
      description: "Create AI responses",
      color: "text-green-500",
    },
    {
      id: "profiles",
      name: "Student Profiles",
      icon: GraduationCap,
      description: "Personalized communication",
      color: "text-purple-500",
    },
    {
      id: "scheduled",
      name: "Scheduled Messages",
      icon: Calendar,
      description: "Automated messaging",
      color: "text-orange-500",
    },
    {
      id: "attachments",
      name: "Attachments",
      icon: Paperclip,
      description: "Resource library",
      color: "text-indigo-500",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      description: "Alerts and reminders",
      color: "text-red-500",
      badge: unreadNotifications > 0 ? unreadNotifications : null,
    },
    {
      id: "faq",
      name: "FAQ Assistant",
      icon: Bot,
      description: "Self-service support",
      color: "text-teal-500",
    },
    {
      id: "history",
      name: "Response History",
      icon: Clock,
      description: "Past communications",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                EduRespond
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered teacher communication platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="hi">Hindi</option>
              </select>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Inquiries</p>
                  <p className="text-2xl font-bold">{dashboardStats?.totalInquiries || 0}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Auto Responses</p>
                  <p className="text-2xl font-bold">{dashboardStats?.autoResponses || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                  <p className="text-2xl font-bold">{dashboardStats?.avgResponseTime || 0}s</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notifications</p>
                  <p className="text-2xl font-bold">{unreadNotifications}</p>
                </div>
                <Bell className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTab === feature.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveTab(feature.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                    {feature.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium">{feature.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <DashboardStats />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LanguageStats />
                  <QuickTemplates />
                </div>
              </div>
            )}
            
            {activeTab === "inquiry" && (
              <div className="space-y-6">
                <InquiryForm 
                  currentLanguage={currentLanguage}
                  onResponseGenerated={handleResponseGenerated}
                />
                <ToneSelector 
                  selectedTone="professional"
                  onToneChange={(tone) => console.log("Tone changed:", tone)}
                />
              </div>
            )}
            
            {activeTab === "response" && generatedResponse && (
              <GeneratedResponse 
                response={generatedResponse}
                onResponseUpdate={(response) => setGeneratedResponse(response)}
              />
            )}
            
            {activeTab === "profiles" && <StudentProfileForm />}
            {activeTab === "scheduled" && <ScheduledMessages />}
            {activeTab === "attachments" && <AttachmentManager />}
            {activeTab === "notifications" && <NotificationCenter />}
            {activeTab === "faq" && <FaqBot />}
            {activeTab === "history" && <ResponseHistory />}
          </div>
          
          <div className="space-y-6">
            <RecentActivity />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Inquiry
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  FAQ Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}