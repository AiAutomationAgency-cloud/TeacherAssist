import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Search, HelpCircle, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

export default function FaqBot() {
  const [query, setQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: number;
    type: "user" | "bot";
    message: string;
    timestamp: Date;
  }>>([]);
  const { toast } = useToast();

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["/api/faq"],
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/api/faq/search", query],
    enabled: query.length > 2,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("/api/faq/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
    },
    onSuccess: (response) => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          message: response.answer,
          timestamp: new Date(),
        }
      ]);
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    },
  });

  const handleChatSubmit = (message: string) => {
    if (!message.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        message,
        timestamp: new Date(),
      }
    ]);
    
    chatMutation.mutate(message);
    setQuery("");
  };

  const handleFaqClick = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const displayedFaqs = query.length > 2 ? searchResults : faqs;

  return (
    <div className="space-y-6">
      {/* FAQ Search and Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            FAQ Assistant
          </CardTitle>
          <CardDescription>
            Get instant answers to common questions or search our knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Ask a question or search FAQs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit(query)}
              />
            </div>
            <Button 
              onClick={() => handleChatSubmit(query)}
              disabled={!query.trim() || chatMutation.isPending}
            >
              {chatMutation.isPending ? "..." : "Ask"}
            </Button>
          </div>

          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-60 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700 border"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading FAQs...</div>
          ) : !displayedFaqs?.length ? (
            <div className="text-center py-8 text-gray-500">
              {query.length > 2 ? "No FAQs found matching your search." : "No FAQs available."}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedFaqs?.map((faq: any) => (
                <div
                  key={faq.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left"
                    onClick={() => handleFaqClick(faq.id)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedFaq === faq.id && (
                    <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
                      <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Badge variant="outline">{faq.category}</Badge>
                        <span>•</span>
                        <span>{faq.viewCount} views</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}