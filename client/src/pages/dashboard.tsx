import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Users, 
  Clock, 
  Globe, 
  Sparkles, 
  Send, 
  Settings,
  BarChart3,
  FileText,
  Bell
} from "lucide-react";

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [inquiry, setInquiry] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateResponse = async () => {
    if (!inquiry.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI response generation
    setTimeout(() => {
      const responses = {
        english: "Thank you for your inquiry. I appreciate you reaching out about your child's progress. I'd be happy to discuss this further during our scheduled conference time or arrange a separate meeting if needed.",
        spanish: "Gracias por su consulta. Aprecio que se haya comunicado sobre el progreso de su hijo. Me complacería discutir esto más a fondo durante nuestro tiempo de conferencia programado o organizar una reunión separada si es necesario.",
        french: "Merci pour votre demande. J'apprécie que vous nous contactiez au sujet des progrès de votre enfant. Je serais ravi de discuter de cela plus en détail pendant notre temps de conférence programmé ou d'organiser une réunion séparée si nécessaire."
      };
      
      setGeneratedResponse(responses[selectedLanguage as keyof typeof responses] || responses.english);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduRespond Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Inquiries</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">247</span>
                <Badge variant="secondary" className="text-xs">+12%</Badge>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">AI Responses</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">189</span>
                <Badge variant="secondary" className="text-xs">+8%</Badge>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">2.3m</span>
                <Badge variant="secondary" className="text-xs">-15%</Badge>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Languages Used</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">5</span>
                <Badge variant="secondary" className="text-xs">+2</Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Response Generator */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  AI Response Generator
                </CardTitle>
                <CardDescription>
                  Generate intelligent responses for student and parent inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Response Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tone">Response Tone</Label>
                    <Select value={selectedTone} onValueChange={setSelectedTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="supportive">Supportive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="inquiry">Parent/Student Inquiry</Label>
                  <Textarea 
                    id="inquiry"
                    placeholder="Paste the inquiry you received here..."
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateResponse}
                  disabled={isGenerating || !inquiry.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating Response...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate AI Response
                    </>
                  )}
                </Button>
                
                {generatedResponse && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <Label className="text-sm font-medium text-green-800">Generated Response:</Label>
                    <p className="mt-2 text-sm text-green-700">{generatedResponse}</p>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Profiles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Response sent to Maria Garcia</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New inquiry from John Smith</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Template updated</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}