"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useVideoConfig, Audio, Img } from "remotion";
import { fetchVoiceover } from "../utils/fetchVoiceover";
import countriesData from "../data/countries.json";
import { generateBackgroundImage } from "@/utils/generateBackground";

interface Caption {
  text: string;
  startTime: number;
  duration: number;
}

interface Country {
  original: string;
  scrambled: string;
}

interface VideoContent {
  title: string;
  captions: Caption[];
  countries: string[];
  voiceoverText: string;
}

const shuffleString = (str: string): string => {
  return str
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const countries: Country[] = countriesData.countryList.map((name) => ({
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
  const [currentCountry, setCurrentCountry] = useState<Country>(countries[0]);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
  const [videoContent, setVideoContent] = useState<VideoContent | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateVoiceover = useCallback(async () => {
    if (!currentCountry) return;

    setIsLoading(true);
    setError(null);
    try {
      const voiceoverText = `Can you name this scrambled country? Your word is ${currentCountry.scrambled}`;
      const url = await fetchVoiceover(voiceoverText);
      setVoiceoverUrl(url);
    } catch (err) {
      console.error("Failed to generate voiceover:", err);
      setError("Failed to generate audio");
    } finally {
      setIsLoading(false);
    }
  }, [currentCountry]);

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const { backgroundImageUrl, videoContent: content } =
          await generateBackgroundImage();
        setBackgroundUrl(backgroundImageUrl);
        setVideoContent(content);

        if (content.captions && content.captions.length > 0) {
          setCurrentCaption(content.captions[0]);
        }
      } catch (error) {
        console.error("Failed to initialize video:", error);
        setError("Failed to initialize video content");
      }
    };

    initializeVideo();
  }, []);

  useEffect(() => {
    if (!videoContent?.captions) return;

    const captionTimer = setInterval(() => {
      const currentTime = timer;
      const newCaption = videoContent.captions.find(
        (caption) =>
          currentTime >= caption.startTime &&
          currentTime < caption.startTime + caption.duration
      );

      if (newCaption) {
        setCurrentCaption(newCaption);
      }
    }, 100);

    return () => clearInterval(captionTimer);
  }, [timer, videoContent]);

  useEffect(() => {
    generateVoiceover();
  }, [generateVoiceover]);

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

  const moveToNextCountry = useCallback(() => {
    if (currentIndex < countries.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentCountry(countries[currentIndex + 1]);
      setTimer(3);
      setShowAnswer(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (showAnswer) {
      const timeout = setTimeout(() => {
        moveToNextCountry();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showAnswer, moveToNextCountry]);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
      }}
      className="bg-gradient-to-b from-blue-900 to-black"
    >
      {backgroundUrl && (
        <Img
          src={backgroundUrl}
          style={{
            width:"512",
            height:"910px",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      )}

      <div className="absolute  z-10 flex flex-col items-center justify-center bg-red">
        <div className="w-full  mx-auto px-4 text-center">
          <h1 className="text-white text-4xl font-bold mb-12">
            Country Scramble Quiz
          </h1>

          {currentCaption && (
            <div className="w-full mb-8">
              <div className="inline-block text-white text-2xl text-center bg-black bg-opacity-50 p-4 rounded-lg">
                {currentCaption.text}
              </div>
            </div>
          )}

          <div className="space-y-8">
            <h2 className="text-white text-5xl font-bold">
              {currentCountry.scrambled}
            </h2>

            {!showAnswer ? (
              <h3 className="text-white text-2xl">Revealing in {timer}...</h3>
            ) : (
              <h3 className="text-green-400 text-4xl font-bold">
                Answer: {currentCountry.original}
              </h3>
            )}
          </div>

          {error && (
            <div className="mt-8 text-red-500 bg-black bg-opacity-50 p-2 rounded inline-block">
              {error}
            </div>
          )}

          <div className="absolute bottom-8 w-full text-center text-white text-xl">
            {currentIndex + 1} / {countries.length}
          </div>
        </div>
      </div>

      {voiceoverUrl && !error && <Audio src={voiceoverUrl} startFrom={0} />}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default VideoContent;