import { Link } from "wouter";
import { MessageSquare, Users, Clock, Globe, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduRespond
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </span>
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 glass hover:glow transition-all duration-300">
              <Globe className="w-3 h-3 mr-1" />
              Multi-Language Support
            </Badge>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Teacher
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-400% float-animation">
              Communication Assistant
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Streamline your communication with students and parents using intelligent AI responses. 
            Generate professional, personalized messages in multiple languages instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-10 py-4 text-lg gradient-hover shadow-lg">
                Start Creating Responses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-10 py-4 text-lg glass hover:glow transition-all duration-300">
              <Sparkles className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="glass p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Teachers Using</div>
            </div>
            <div className="glass p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Languages Supported</div>
            </div>
            <div className="glass p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Efficient Communication
            </h3>
            <p className="text-lg text-gray-600">
              Powerful features designed specifically for educators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass hover:glow group">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Smart Response Generation</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Generate contextual responses for any type of inquiry using advanced AI technology
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass hover:glow group">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Multi-Language Support</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Communicate with parents and students in their preferred language seamlessly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass hover:glow group">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Student & Parent Profiles</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Maintain detailed profiles for personalized communication experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass hover:glow group">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Response Analytics</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Track response times, language usage, and communication patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass hover:glow group">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Template Management</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Save and reuse frequently used responses for common inquiries
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 glass hover:glow group">
              <CardHeader className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Real-time Notifications</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get notified of urgent inquiries and follow-up reminders instantly
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Transform Your Communication?
              </h3>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of educators who are already using EduRespond to improve their communication efficiency.
              </p>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="px-8 py-3">
                  Get Started Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EduRespond</span>
          </div>
          <p className="text-gray-400">
            Empowering educators with AI-powered communication tools
          </p>
        </div>
      </footer>
    </div>
  );
}