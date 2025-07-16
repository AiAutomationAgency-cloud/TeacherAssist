import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Bot, Languages, Clock } from "lucide-react";

interface DashboardStats {
  totalInquiries: number;
  autoResponses: number;
  avgResponseTime: number;
  languageDistribution: { language: string; count: number; percentage: number }[];
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                  <div className="h-6 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries || 0,
      icon: Mail,
      bgColor: "bg-blue-100",
      iconColor: "text-primary"
    },
    {
      title: "Auto Responses", 
      value: stats?.autoResponses || 0,
      icon: Bot,
      bgColor: "bg-green-100",
      iconColor: "text-secondary"
    },
    {
      title: "Languages",
      value: 5,
      icon: Languages,
      bgColor: "bg-purple-100", 
      iconColor: "text-accent"
    },
    {
      title: "Avg Response Time",
      value: stats?.avgResponseTime ? `${(stats.avgResponseTime / 1000).toFixed(1)}s` : "0s",
      icon: Clock,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.iconColor} size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
