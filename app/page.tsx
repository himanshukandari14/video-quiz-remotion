"use client";
import { useState } from "react";
import { Player } from "@remotion/player";

import { RemotionRoot } from "../components/RemotionRoot";
import QuizCustomizer from "@/components/QuizCustomizer";
import QuizRenderer from "@/components/VideoComponent";

export default function Home() {
  const [quizConfig, setQuizConfig] = useState<{
    quizTitle: string;
    voiceover: string;
    background: string | null;
    themeColor: string;
    font: string;
    countries: string[];
  } | null>(null);

  const handleQuizGenerated = (config: {
    quizTitle: string;
    voiceover: string;
    background: string | null;
    themeColor: string;
    font: string;
    countries: string[];
  }) => {
    setQuizConfig(config); // Set the quiz configuration
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <RemotionRoot /> {/* Register the composition globally */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Country Scramble Game
        </h1>

        {/* Render the QuizCustomizer */}
        <QuizCustomizer onQuizGenerated={handleQuizGenerated} />

        {/* Conditionally render the Player when quizConfig is available */}
        {quizConfig && (
          <div className="aspect-[9/16] h-[600px] w-[400px] mx-auto bg-black rounded-lg overflow-hidden shadow-xl mt-8">
            <Player
              component={QuizRenderer}
              inputProps={quizConfig} // Pass quiz configuration as inputProps
              durationInFrames={300}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={30}
              controls
              autoPlay
              loop
            />
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4">
            Try to guess the scrambled country names before the timer runs out!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </main>
  );
}
