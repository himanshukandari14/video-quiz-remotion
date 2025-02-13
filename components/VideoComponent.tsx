"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useVideoConfig, Audio, Img } from "remotion";
import { fetchVoiceover } from "../utils/fetchVoiceover";
import { generateBackgroundImage } from "@/utils/generateBackground";

interface QuizRendererProps {
  quizTitle: string;
  background: string | null;
  themeColor: string;
  font: string;
  countries: string[];
}

export const QuizRenderer: React.FC<QuizRendererProps> = ({
  quizTitle,
  background,
  themeColor,
  font,
  countries,
}) => {
  const { width, height } = useVideoConfig();
  const [scrambled, setScrambled] = useState("");
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCountryIndex, setCurrentCountryIndex] = useState(-1); // Start with -1 for intro phase
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(3);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(background);
  const [answeredCountries, setAnsweredCountries] = useState<string[]>([]);
  const [introPhase, setIntroPhase] = useState(true); // Intro phase state

  // Generate voiceover for intro or quiz
  const generateVoiceover = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await fetchVoiceover(text);
      if (typeof url === 'string') {
        setVoiceoverUrl(url);
      }
    } catch (err) {
      console.error("Failed to generate voiceover:", err);
      setError("Failed to generate audio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize video and play intro
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        if (!backgroundUrl) {
          const { backgroundImageUrl } = await generateBackgroundImage();
          setBackgroundUrl(backgroundImageUrl);
        }

        // Play intro voiceover
        const introText = `Welcome to ${quizTitle}! Can you guess the 10 scrambled countries? Let's go!`;
        await generateVoiceover(introText);

        // After intro, start the quiz
        setTimeout(() => {
          setIntroPhase(false); // End intro phase
          setCurrentCountryIndex(0); // Start quiz
        }, 3000); // Assume intro duration is 3 seconds
      } catch (error) {
        console.error("Initialization failed:", error);
        setError("Initialization failed");
      }
    };

    initializeVideo();
  }, [backgroundUrl, quizTitle, generateVoiceover]);

  // Handle quiz logic
  useEffect(() => {
    if (introPhase || currentCountryIndex < 0) return; // Skip if still in intro phase
    let scrambled = "";
    const handleQuestion = async () => {
      const country = countries[currentCountryIndex];
      const shuffled = country
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');
      setScrambled(shuffled);
      const questionText = `Can you name this scrambled country? Your word is ${shuffled}`;
      await generateVoiceover(questionText);

      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShowAnswer(true);
            console.log("Timer reached 0, showAnswer set to true");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    };

    handleQuestion();
  }, [currentCountryIndex, introPhase, generateVoiceover, countries]);

  // Move to next country after answer is shown
  useEffect(() => {
    if (showAnswer) {
      setAnsweredCountries((prev) => [...prev, countries[currentCountryIndex]]);

      const timeout = setTimeout(() => {
        if (currentCountryIndex < countries.length - 1) {
          setCurrentCountryIndex((prev) => prev + 1);
          setShowAnswer(false);
          setTimer(3);
        }
      }, 2000); // Wait 2 seconds before moving to the next country

      return () => clearTimeout(timeout);
    }
    console.log("showAnswer:", showAnswer, "currentCountryIndex:", currentCountryIndex, "countries.length:", countries.length);
  }, [showAnswer, currentCountryIndex, countries]);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: font,
        color: themeColor,
      }}
      className="bg-gradient-to-b from-blue-900 to-black"
    >
      {backgroundUrl && (
        <Img
          src={backgroundUrl}
          style={{
            width: "100%",
            height: "33%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      )}

      {/* Intro Screen */}
      {introPhase && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-center">
            Welcome to {quizTitle}!
            <br />
            <span className="text-3xl mt-4 block">
              Can you guess the 10 scrambled countries? Let&apos;s go!
            </span>
          </h1>
        </div>
      )}

      {/* Quiz Content */}
      {!introPhase && (
        <>
          <div className="absolute top-0 left-[10px] z-10 w-[400px] flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold text-center mb-2">
              {quizTitle}
            </h1>

            <div className="space-y-0">
              {!showAnswer ? (
                <>
                  <h2 className="text-[14px] font-bold text-center">
                    {scrambled}
                  </h2>
                  <h3 className="text-[14px] text-center">
                    Revealing in {timer}...
                  </h3>
                </>
              ) : (
                <h3 className="text-green-400 text-[14px] font-bold text-center">
                  Answer: {countries[currentCountryIndex]}
                </h3>
              )}
            </div>
          </div>

          <div
            className="absolute left-8 top-[10%] text-lg font-medium space-y-0"
            style={{ maxHeight: "90%", overflowY: "auto" }}
          >
            <h3 className="font-semibold text-xl mb-4">Answered Countries:</h3>
            <ul>
              {answeredCountries.map((country, index) => (
                <li key={index} className="mb-2">{`${
                  index + 1
                }. ${country}`}</li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-8 w-full text-center text-lg">
            {currentCountryIndex + 1} / 10
          </div>
        </>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-xl">{error}</div>
        </div>
      )}

      {voiceoverUrl && !error && <Audio src={voiceoverUrl} startFrom={0} />}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default QuizRenderer;
