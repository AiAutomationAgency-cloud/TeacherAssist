import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  languageDistribution: { language: string; count: number; percentage: number }[];
}

export default function LanguageStats() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const languageInfo = {
    en: { emoji: "🇺🇸", name: "English", color: "bg-primary" },
    es: { emoji: "🇪🇸", name: "Spanish", color: "bg-secondary" },
    fr: { emoji: "🇫🇷", name: "French", color: "bg-accent" },
    de: { emoji: "🇩🇪", name: "German", color: "bg-orange-500" },
    zh: { emoji: "🇨🇳", name: "Chinese", color: "bg-red-500" },
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Language Distribution</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default data if no stats available
  const defaultDistribution = [
    { language: "en", count: 75, percentage: 75 },
    { language: "es", count: 15, percentage: 15 },
    { language: "fr", count: 6, percentage: 6 },
    { language: "de", count: 3, percentage: 3 },
    { language: "zh", count: 1, percentage: 1 },
  ];

  const distribution = stats?.languageDistribution?.length > 0 
    ? stats.languageDistribution 
    : defaultDistribution;

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Language Distribution</h3>
        <div className="space-y-3">
          {distribution.map((item) => {
            const info = languageInfo[item.language as keyof typeof languageInfo];
            if (!info) return null;
            
            return (
              <div key={item.language} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{info.emoji}</span>
                  <span className="text-sm font-medium text-slate-700">{info.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`${info.color} h-2 rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-8">{item.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
