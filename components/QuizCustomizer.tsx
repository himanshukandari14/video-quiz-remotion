"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import countriesData from "../data/countries.json";
import { fetchVoiceover } from "../utils/fetchVoiceover";
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
    audioUrls: {
      intro?: string;
      nextQuestion?: string;
      reveals?: string[];
      outro?: string;
    };
  }) => void;
}

const QuizCustomizer: React.FC<QuizCustomizerProps> = ({ onQuizGenerated }) => {
  const [quizTitle, setQuizTitle] = useState("Country Scramble Quiz");
  const [voiceover, setVoiceover] = useState("JBFqnCBsd6RMkjVDRZzb");
  const [background, setBackground] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [font, setFont] = useState("Arial");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) setBackground(event.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const preProcessAudio = async (countries: string[], voiceId: string) => {
    try {
      // Generate intro audio
      const introText = "Hello! Can you unscramble 10 countries? Let's go!";
      const introAudio = await fetchVoiceover(introText, voiceId);

      // Generate "next question" audio
      const nextQuestionText = "Here's the next one";
      const nextQuestionAudio = await fetchVoiceover(nextQuestionText, voiceId);

      // Generate reveal audios
      const revealAudios = await Promise.all(
        countries.map(async (country) => {
          const revealText = `It's ${country}!`;
          return fetchVoiceover(revealText, voiceId);
        })
      );

      // Generate outro audio
      const outroText = "Thank you for playing! Comment below with your score!";
      const outroAudio = await fetchVoiceover(outroText, voiceId);

      return {
        intro: introAudio,
        nextQuestion: nextQuestionAudio,
        reveals: revealAudios,
        outro: outroAudio,
      };
    } catch (error) {
      console.error("Failed to pre-process audio:", error);
      throw new Error("Failed to generate audio content");
    }
  };

  const handleGenerateQuiz = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Shuffle countries list each time
      const shuffledCountries = [...countriesData.countryList]
        .sort(() => 0.5 - Math.random()) // Shuffle the array
        .slice(0, 10); // Pick 10 random countries

      // Pre-process all audio content with selected voice type
      const audioUrls = await preProcessAudio(shuffledCountries, voiceover);

      onQuizGenerated({
        quizTitle,
        voiceover,
        background,
        themeColor,
        font,
        countries: shuffledCountries,
        audioUrls,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate quiz"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 justify-center align-center">
      <Card>
        <CardContent className="flex flex-col gap-4 mt-4">
          <Input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Quiz Title"
            disabled={isProcessing}
          />
          <Select
            value={voiceover}
            onValueChange={setVoiceover}
            disabled={isProcessing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Voiceover" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JBFqnCBsd6RMkjVDRZzb">George</SelectItem>
              <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah</SelectItem>
              <SelectItem value="FGY2WhTYpPnrIDTdsKH5">Laurah</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            disabled={isProcessing}
          />
          <Input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            disabled={isProcessing}
          />
          <Select value={font} onValueChange={setFont} disabled={isProcessing}>
            <SelectTrigger>
              <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateQuiz} disabled={isProcessing}>
            {isProcessing ? "Cooking Awesomenes..." : "Generate Quiz"}
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCustomizer;
