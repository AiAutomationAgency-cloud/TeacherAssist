import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertScheduledMessageSchema, type InsertScheduledMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Send, Users, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const formSchema = insertScheduledMessageSchema.extend({
  scheduledFor: insertScheduledMessageSchema.shape.scheduledFor.transform((val) => new Date(val)),
});

type FormData = z.infer<typeof formSchema>;

export default function ScheduledMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      recipients: [],
      scheduledFor: new Date(),
      messageType: "individual",
    },
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/scheduled-messages"],
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/scheduled-messages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message scheduled successfully!",
      });
      form.reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-messages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule message",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-500";
      case "sent":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading scheduled messages...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Messages
              </CardTitle>
              <CardDescription>
                Schedule messages or create broadcast announcements
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Schedule Message"}
            </Button>
          </div>
        </CardHeader>
        
        {showForm && (
          <CardContent className="border-t">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Exam reminder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Dear parents, this is a reminder about the upcoming exam..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule Date & Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field}
                            value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="messageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Type</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full p-2 border rounded">
                            <option value="individual">Individual</option>
                            <option value="broadcast">Broadcast</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={mutation.isPending} className="w-full">
                  {mutation.isPending ? "Scheduling..." : "Schedule Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-4">
        {messages?.map((message: any) => (
          <Card key={message.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{message.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(message.status)} text-white`}
                    >
                      {message.status}
                    </Badge>
                    <Badge variant="outline">
                      {message.messageType === "broadcast" ? (
                        <Users className="w-3 h-3 mr-1" />
                      ) : (
                        <MessageSquare className="w-3 h-3 mr-1" />
                      )}
                      {message.messageType}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {message.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(message.scheduledFor), "PPp")}
                    </div>
                    {message.sentAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Sent: {format(new Date(message.sentAt), "PPp")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}