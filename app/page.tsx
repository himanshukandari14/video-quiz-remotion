// app/page.tsx
"use client";
import { Player } from "@remotion/player";
import { VideoContent } from "../components/VideoComponent";
import { RemotionRoot } from "../components/RemotionRoot";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <RemotionRoot /> {/* Register the composition globally */}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Country Scramble Game
        </h1>

        <div className="aspect-[9/16] w-full max-w-lg mx-auto bg-black rounded-lg overflow-hidden shadow-xl">
          <Player
            component={VideoContent} // Corrected: Using VideoContent
            durationInFrames={300}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            controls
            autoPlay
            loop
          />
        </div>

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
