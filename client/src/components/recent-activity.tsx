import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: number;
  type: string;
  description: string;
  createdAt: string;
}

export default function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case "response_sent":
        return "bg-green-400";
      case "template_created":
        return "bg-blue-400";
      case "text_translated":
        return "bg-purple-400";
      case "response_generated":
        return "bg-orange-400";
      default:
        return "bg-slate-400";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-2 h-2 bg-slate-200 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
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
        <h3 className="text-lg font-medium text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.description}</p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-primary hover:bg-blue-50 text-sm font-medium"
        >
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
