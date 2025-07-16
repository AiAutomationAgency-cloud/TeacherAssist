import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit3, Copy, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ResponseWithInquiry {
  id: number;
  content: string;
  language: string;
  status: string;
  generatedAt: string;
  sentAt?: string;
  inquiry?: {
    id: number;
    type: string;
    content: string;
  };
}

export default function ResponseHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: responses = [], isLoading } = useQuery<ResponseWithInquiry[]>({
    queryKey: ["/api/responses"],
  });

  const languageInfo = {
    en: { emoji: "🇺🇸", name: "English" },
    es: { emoji: "🇪🇸", name: "Spanish" },
    fr: { emoji: "🇫🇷", name: "French" },
    de: { emoji: "🇩🇪", name: "German" },
    zh: { emoji: "🇨🇳", name: "Chinese" },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assignment_help":
        return "bg-blue-100 text-blue-800";
      case "grade_inquiry":
        return "bg-green-100 text-green-800";
      case "schedule_question":
        return "bg-purple-100 text-purple-800";
      case "parent_communication":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const filteredResponses = responses.filter(response =>
    response.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.inquiry?.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-8">
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Response History</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-slate-300 focus:ring-primary focus:border-primary"
              />
              <Button variant="outline" size="sm">
                <Filter className="mr-2" size={14} />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border-b border-slate-200 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="h-6 bg-slate-200 rounded w-24"></div>
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                    <div className="h-4 bg-slate-200 rounded flex-1"></div>
                    <div className="h-6 bg-slate-200 rounded w-16"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-slate-200 rounded"></div>
                      <div className="w-8 h-8 bg-slate-200 rounded"></div>
                      <div className="w-8 h-8 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Language</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Preview</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredResponses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        {searchTerm ? "No responses match your search." : "No responses yet. Generate your first response above!"}
                      </td>
                    </tr>
                  ) : (
                    filteredResponses.map((response) => (
                      <tr key={response.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {formatDistanceToNow(new Date(response.generatedAt), { addSuffix: true })}
                        </td>
                        <td className="py-3 px-4">
                          {response.inquiry && (
                            <Badge className={getTypeColor(response.inquiry.type)}>
                              {response.inquiry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {languageInfo[response.language as keyof typeof languageInfo]?.emoji}{" "}
                          {languageInfo[response.language as keyof typeof languageInfo]?.name || response.language}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">
                          {response.content.substring(0, 60)}...
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(response.status)}>
                            {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                              <Edit3 size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                              <Copy size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">
                Showing {Math.min(filteredResponses.length, 10)} of {filteredResponses.length} responses
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1" size={14} />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="ml-1" size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
