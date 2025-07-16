import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { Wand2, FileText, RotateCcw, Clock, User, GraduationCap } from "lucide-react";
import ToneSelector from "./tone-selector";

const formSchema = insertInquirySchema.extend({
  content: z.string().min(10, "Inquiry must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface InquiryFormProps {
  currentLanguage: string;
  onResponseGenerated: (response: any) => void;
}

export default function InquiryForm({ currentLanguage, onResponseGenerated }: InquiryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(currentLanguage);
  const [selectedTone, setSelectedTone] = useState("professional");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "assignment_help",
      content: "",
      language: currentLanguage,
      detectedLanguage: currentLanguage,
    },
  });

  const inquiryTypes = [
    { value: "assignment_help", label: "Assignment Help" },
    { value: "grade_inquiry", label: "Grade Inquiry" },
    { value: "schedule_question", label: "Schedule Question" },
    { value: "parent_communication", label: "Parent Communication" },
    { value: "technical_support", label: "Technical Support" },
    { value: "general_question", label: "General Question" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
  ];

  const createInquiryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  const generateResponseMutation = useMutation({
    mutationFn: async ({ inquiryId, targetLanguage }: { inquiryId: number; targetLanguage: string }) => {
      const response = await apiRequest("POST", `/api/inquiries/${inquiryId}/generate-response`, {
        targetLanguage,
        teacherName: "Ms. Johnson",
        subject: "Mathematics"
      });
      return response.json();
    },
    onSuccess: (data) => {
      onResponseGenerated(data.response);
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Response Generated",
        description: "AI response has been generated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const detectLanguageMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/detect-language", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setDetectedLanguage(data.detectedLanguage);
      form.setValue("detectedLanguage", data.detectedLanguage);
      toast({
        title: "Language Detected",
        description: `Detected language: ${languageOptions.find(l => l.value === data.detectedLanguage)?.label}`,
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      const inquiry = await createInquiryMutation.mutateAsync(data);
      await generateResponseMutation.mutateAsync({
        inquiryId: inquiry.id,
        targetLanguage: currentLanguage
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoDetectLanguage = () => {
    const content = form.getValues("content");
    if (content.trim()) {
      detectLanguageMutation.mutate(content);
    } else {
      toast({
        title: "No Content",
        description: "Please enter some text first to detect the language.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-slate-200 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">New Inquiry</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>AI Assistant Active</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Inquiry Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detectedLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Detected Language
                    </FormLabel>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAutoDetectLanguage}
                        disabled={detectLanguageMutation.isPending}
                      >
                        <RotateCcw size={16} />
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Student/Parent Inquiry
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Enter the inquiry text here..."
                      className="border-slate-300 focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  disabled={isGenerating || !form.formState.isValid}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2" size={16} />
                      Generate Response
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline">
                  <FileText className="mr-2" size={16} />
                  Use Template
                </Button>
              </div>
              <div className="text-sm text-slate-500 flex items-center">
                <Clock className="mr-1" size={14} />
                Estimated response time: ~3 seconds
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
