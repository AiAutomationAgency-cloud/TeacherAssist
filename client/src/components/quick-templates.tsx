import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, TrendingUp, Calendar, Users, Settings, ChevronRight } from "lucide-react";

interface Template {
  id: number;
  name: string;
  type: string;
  usageCount: number;
}

export default function QuickTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const useTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await apiRequest("POST", `/api/templates/${templateId}/use`);
      return response.json();
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Template Used",
        description: `Template "${template.name}" has been applied.`,
      });
    },
  });

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "assignment_help":
        return FileText;
      case "grade_inquiry":
        return TrendingUp;
      case "schedule_question":
        return Calendar;
      case "parent_communication":
        return Users;
      default:
        return FileText;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case "assignment_help":
        return "bg-blue-100 text-primary";
      case "grade_inquiry":
        return "bg-green-100 text-secondary";
      case "schedule_question":
        return "bg-purple-100 text-accent";
      case "parent_communication":
        return "bg-orange-100 text-orange-500";
      default:
        return "bg-blue-100 text-primary";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Quick Templates</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Quick Templates</h3>
        <div className="space-y-3">
          {templates.map((template) => {
            const Icon = getTemplateIcon(template.type);
            const colorClass = getTemplateColor(template.type);
            
            return (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => useTemplateMutation.mutate(template.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{template.name}</p>
                    <p className="text-xs text-slate-500">Used {template.usageCount} times</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-400" size={16} />
              </div>
            );
          })}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-sm"
          onClick={() => toast({ title: "Coming Soon", description: "Template management is coming soon!" })}
        >
          <Settings className="mr-2" size={14} />
          Manage Templates
        </Button>
      </CardContent>
    </Card>
  );
}
