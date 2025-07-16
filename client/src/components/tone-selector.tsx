import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Briefcase, Users, MessageSquare } from "lucide-react";

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

const tones = [
  {
    id: "formal",
    name: "Formal",
    description: "Professional and structured communication",
    icon: Briefcase,
    color: "bg-blue-500",
    example: "Dear Mr. Johnson, I am writing to inform you about...",
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm and approachable tone",
    icon: Smile,
    color: "bg-green-500",
    example: "Hi there! I wanted to reach out about...",
  },
  {
    id: "neutral",
    name: "Neutral",
    description: "Balanced and informative",
    icon: Users,
    color: "bg-gray-500",
    example: "Hello, I would like to discuss...",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Courteous and respectful",
    icon: MessageSquare,
    color: "bg-purple-500",
    example: "Good morning, I hope this message finds you well...",
  },
];

export default function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Response Tone
        </CardTitle>
        <CardDescription>
          Choose the tone for AI-generated responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {tones.map((tone) => {
            const Icon = tone.icon;
            const isSelected = selectedTone === tone.id;
            
            return (
              <Button
                key={tone.id}
                variant={isSelected ? "default" : "outline"}
                className={`flex flex-col items-center gap-2 h-auto p-4 ${
                  isSelected ? tone.color : ""
                }`}
                onClick={() => onToneChange(tone.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{tone.name}</span>
              </Button>
            );
          })}
        </div>

        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm"
          >
            {showExamples ? "Hide" : "Show"} Examples
          </Button>
        </div>

        {showExamples && (
          <div className="space-y-3">
            {tones.map((tone) => (
              <div
                key={tone.id}
                className={`p-3 rounded-lg border ${
                  selectedTone === tone.id 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {tone.name}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tone.description}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700 dark:text-gray-300">
                  "{tone.example}"
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}