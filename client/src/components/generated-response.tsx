import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Edit3, Copy, Languages, Send, Save } from "lucide-react";

interface GeneratedResponseProps {
  response: {
    id: number;
    content: string;
    language: string;
    responseTime: number;
    status?: string;
    inquiry?: {
      type: string;
      content: string;
    };
  };
  onResponseUpdate: (response: any) => void;
}

export default function GeneratedResponse({ response, onResponseUpdate }: GeneratedResponseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(response.content);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateResponseMutation = useMutation({
    mutationFn: async (data: { status?: string; content?: string }) => {
      const result = await apiRequest("PATCH", `/api/responses/${response.id}`, data);
      return result.json();
    },
    onSuccess: (updatedResponse) => {
      onResponseUpdate(updatedResponse);
      queryClient.invalidateQueries({ queryKey: ["/api/responses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const translateMutation = useMutation({
    mutationFn: async (targetLanguage: string) => {
      const result = await apiRequest("POST", "/api/translate", {
        text: response.content,
        targetLanguage,
      });
      return result.json();
    },
    onSuccess: (data) => {
      setEditedContent(data.translatedText);
      toast({
        title: "Translation Complete",
        description: "Response has been translated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Translation Failed",
        description: "Unable to translate the response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendResponse = () => {
    updateResponseMutation.mutate({ status: "sent" });
    toast({
      title: "Response Sent",
      description: "Your response has been sent successfully.",
    });
  };

  const handleSaveResponse = () => {
    if (isEditing) {
      updateResponseMutation.mutate({ content: editedContent });
      setIsEditing(false);
      toast({
        title: "Response Saved",
        description: "Your changes have been saved.",
      });
    }
  };

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(response.content);
      toast({
        title: "Copied to Clipboard",
        description: "Response content has been copied.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleTranslate = () => {
    // For demo purposes, translate to Spanish
    translateMutation.mutate("es");
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-900">Generated Response</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-600 font-medium flex items-center">
              <CheckCircle className="mr-1" size={16} />
              Ready to Send
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Edit3 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyResponse}
                className="text-slate-400 hover:text-slate-600"
              >
                <Copy size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTranslate}
                disabled={translateMutation.isPending}
                className="text-slate-400 hover:text-slate-600"
              >
                <Languages size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={8}
              className="w-full border-slate-300 focus:ring-primary focus:border-primary resize-none"
            />
          ) : (
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {response.content}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSendResponse}
              disabled={updateResponseMutation.isPending}
              className="bg-secondary hover:bg-secondary/90"
            >
              <Send className="mr-2" size={16} />
              Send Response
            </Button>
            {isEditing && (
              <Button
                onClick={handleSaveResponse}
                variant="outline"
                disabled={updateResponseMutation.isPending}
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
            )}
            <Button variant="outline">
              <Save className="mr-2" size={16} />
              Save as Template
            </Button>
          </div>
          <div className="text-sm text-slate-500">
            Response generated in {(response.responseTime / 1000).toFixed(1)} seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
