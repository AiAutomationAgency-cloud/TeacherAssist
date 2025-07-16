import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Lock } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduRespond
            </h1>
          </div>
          <p className="text-gray-600">Sign in to your teacher account</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  placeholder="teacher@school.edu"
                  type="email"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  className="pl-10"
                />
              </div>
            </div>

            <Link href="/dashboard">
              <Button className="w-full mt-6">
                Sign In
              </Button>
            </Link>
            
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Contact your administrator
              </a>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}