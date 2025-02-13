'use client'
import { useState } from "react";
import { Player } from "@remotion/player";
import { RemotionRoot } from "../components/RemotionRoot";
import QuizCustomizer from "@/components/QuizCustomizer";
import QuizRenderer from "@/components/VideoComponent";

export default function Home() {
  const [quizConfig, setQuizConfig] = useState(null);

  const handleQuizGenerated = (config) => {
    setQuizConfig(config);
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <RemotionRoot />

      {/* Glassmorphic container */}
      <div className="relative max-w-6xl mx-auto p-8 rounded-2xl overflow-hidden">
        {/* Blurred background elements */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        {/* Content */}
        <div className="relative w-full flex justify-center align-center">
        

          {/* Quiz Customizer wrapped in glassmorphic card */}
          <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-xl border border-white/20">
            <QuizCustomizer onQuizGenerated={handleQuizGenerated} />
          </div>

          {/* Player container with enhanced styling */}
          {quizConfig && (
            <div className="mt-12 flex justify-center">
              <div className="relative aspect-[9/16] h-[600px] w-[400px]">
                {/* Glow effect behind player */}
                <div className="absolute inset-0 bg-green-500 opacity-20 blur-xl -z-10" />

                {/* Glassmorphic player container */}
                <div className="relative h-full backdrop-blur-lg bg-white/10 rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                  <Player
                    component={QuizRenderer}
                    inputProps={quizConfig}
                    durationInFrames={300}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    fps={30}
                    controls
                    autoPlay
                    loop
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
