'use client'
import { useState } from "react";
import { Player } from "@remotion/player";
import { RemotionRoot } from "../components/RemotionRoot";
import QuizCustomizer from "@/components/QuizCustomizer";
import QuizRenderer from "@/components/VideoComponent";

export default function Home() {
  const [quizConfig, setQuizConfig] = useState(null);

  const handleQuizGenerated = (config: any) => {
    setQuizConfig(config);
  };

  return (
    <main className="min-h-screen md-[flex] flex-col justify-center align-center flex  p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <RemotionRoot />

      {/* Container */}
      <div className="relative max-w-6xl flex mx-auto p-8 rounded-2xl overflow-hidden">
        {/* Content */}
        <div className="relative w-full flex justify-center align-center">
          {/* Quiz Customizer */}

          <QuizCustomizer onQuizGenerated={handleQuizGenerated} />

          <div>
            {/* Player container */}
            {quizConfig && (
              <div className=" flex justify-centerv bg-slate-500 rounded-[28px]">
                <div className="relative aspect-[9/16] h-[600px] w-[400px] rounded-[28px]">
                  <div className="rounded-[28px] overflow-hidden">
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
      </div>
    </main>
  );
}
