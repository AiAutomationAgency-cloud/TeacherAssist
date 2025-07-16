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
  Settings as SettingsIcon,
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
import SettingsPage from "./settings";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    {
      id: "settings",
      name: "Settings",
      icon: SettingsIcon,
      description: "Account preferences",
      color: "text-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduRespond
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  AI-powered teacher communication platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="px-4 py-2 border rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="zh">🇨🇳 Chinese</option>
                <option value="hi">🇮🇳 Hindi</option>
              </select>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
                onClick={() => setActiveTab("settings")}
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Inquiries</p>
                  <p className="text-3xl font-bold">{dashboardStats?.totalInquiries || 0}</p>
                </div>
                <div className="p-3 bg-blue-400/30 rounded-full">
                  <MessageSquare className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Auto Responses</p>
                  <p className="text-3xl font-bold">{dashboardStats?.autoResponses || 0}</p>
                </div>
                <div className="p-3 bg-green-400/30 rounded-full">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg Response Time</p>
                  <p className="text-3xl font-bold">{dashboardStats?.avgResponseTime || 0}s</p>
                </div>
                <div className="p-3 bg-orange-400/30 rounded-full">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Notifications</p>
                  <p className="text-3xl font-bold">{unreadNotifications}</p>
                </div>
                <div className="p-3 bg-red-400/30 rounded-full">
                  <Bell className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeTab === feature.id;
            return (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 transform ${
                  isActive 
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg" 
                    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                }`}
                onClick={() => setActiveTab(feature.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    <div className={`p-2 rounded-full mb-2 mx-auto w-fit ${
                      isActive ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isActive ? 'text-white' : feature.color
                      }`} />
                    </div>
                    {feature.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs animate-pulse"
                      >
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium">{feature.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        {activeTab === "settings" ? (
          <SettingsPage />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {activeTab === "dashboard" && (
                  <>
                    <DashboardStats />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LanguageStats />
                      <QuickTemplates />
                    </div>
                  </>
                )}
                
                {activeTab === "inquiry" && (
                  <>
                    <InquiryForm 
                      currentLanguage={currentLanguage}
                      onResponseGenerated={handleResponseGenerated}
                    />
                    <ToneSelector 
                      selectedTone="professional"
                      onToneChange={(tone) => console.log("Tone changed:", tone)}
                    />
                  </>
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
            </div>
            
            <div className="space-y-6">
              <RecentActivity />
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => setActiveTab("inquiry")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    New Inquiry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => setActiveTab("scheduled")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => setActiveTab("profiles")}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    onClick={() => setActiveTab("faq")}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    FAQ Assistant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}