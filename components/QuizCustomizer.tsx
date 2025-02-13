"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizCustomizerProps {
  onQuizGenerated: (config: {
    quizTitle: string;
    voiceover: string;
    background: string | null;
    themeColor: string;
    font: string;
    countries: string[];
  }) => void;
}

const QuizCustomizer: React.FC<QuizCustomizerProps> = ({ onQuizGenerated }) => {
  const [quizTitle, setQuizTitle] = useState("Country Scramble Quiz");
  const [voiceover, setVoiceover] = useState("Default");
  const [background, setBackground] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [font, setFont] = useState("Arial");
  const [countries, setCountries] = useState<string[]>([]);

  const fetchRandomCountries = () => {
    // Fetch 10 random countries from a JSON dataset
    fetch("../data/countries.json")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);
        setCountries(shuffled);
      });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) setBackground(event.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerateQuiz = () => {
    fetchRandomCountries();
    onQuizGenerated({
      quizTitle,
      voiceover,
      background,
      themeColor,
      font,
      countries,
    });
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Quiz Title"
          />
          <Select value={voiceover} onValueChange={setVoiceover}>
            <SelectTrigger>
              <SelectValue placeholder="Select Voiceover" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Default">Default</SelectItem>
              <SelectItem value="AI Voice 1">AI Voice 1</SelectItem>
              <SelectItem value="AI Voice 2">AI Voice 2</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
          />
          <Input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
          />
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateQuiz}>Generate Quiz</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCustomizer;
