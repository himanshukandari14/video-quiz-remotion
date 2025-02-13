// components/VideoComponent.tsx
"use client";

import { useVideoConfig, Audio, Img, staticFile } from "remotion";
import { useEffect, useState, useCallback } from "react";
import { fetchVoiceover } from "../utils/fetchVoiceover";
import Image from "next/image";
import image from "../app/assets/download (2).jpg";
import countriesData from "../data/countries.json";

const shuffleString = (str: string) => {
  return str
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const countries = countriesData.countryList.map((name) => ({
  original: name,
  scrambled: shuffleString(name),
}));

export const VideoContent: React.FC = () => {
  const { width, height } = useVideoConfig();

  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(countries[0]);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  // Generate background on component mount
  useEffect(() => {
    const getBackground = async () => {
      try {
        const bgUrl = await generateBackgroundImage();
        setBackgroundUrl(bgUrl);
      } catch (error) {
        console.error("Failed to generate background:", error);
      }
    };

    getBackground();
  }, []);

  // Moved generateVoiceover to useCallback to prevent unnecessary recreations
  const generateVoiceover = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await fetchVoiceover(
        `Can you name this scrambled country? Your word is ${currentCountry.scrambled}`
      );
      setVoiceoverUrl(url);
    } catch (err) {
      console.error("Failed to generate voiceover:", err);
      setError("Failed to generate audio");
    } finally {
      setIsLoading(false);
    }
  }, [currentCountry.scrambled]);

  // Initialize with random country
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    setCurrentCountry(countries[randomIndex]);
  }, []);

  // Generate voiceover when country changes
  useEffect(() => {
    generateVoiceover();
  }, [generateVoiceover]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setShowAnswer(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width, height, position: "relative" }}>
      <Img src={staticFile("/background.jpg")} style={{ width, height }} />
      <Image src={image} height={100} width={100} alt="image" />

      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">
        Country Scramble Quiz
      </h1>

      <h2 className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white text-2xl">
        {currentCountry.scrambled}
      </h2>

      {!showAnswer && (
        <h3 className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-xl">
          Revealing in {timer}...
        </h3>
      )}

      {showAnswer && (
        <h3 className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-green-400 text-3xl font-bold">
          Answer: {currentCountry.original}
        </h3>
      )}

      {error && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-red-500">
          {error}
        </div>
      )}

      {voiceoverUrl && !error && <Audio src={voiceoverUrl} startFrom={0} />}
    </div>
  );
};
