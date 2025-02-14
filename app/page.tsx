"use client";
import { useState } from "react";
import { Player } from "@remotion/player";
import { RemotionRoot } from "../components/RemotionRoot";
import QuizCustomizer from "@/components/QuizCustomizer";
import QuizRenderer from "@/components/VideoComponent";
import { Card, CardContent } from "@/components/ui/card";
import Spline from "@splinetool/react-spline";

export default function Home() {
  const [quizConfig, setQuizConfig] = useState(null);


  const handleQuizGenerated = (config: any) => {
    setQuizConfig(config);
  };

  const handleExport = async () => {
    if (!quizConfig) return;

    try {
      // Use the Remotion Player's imperative API to render
      const video = document.querySelector("video");
      if (!video) return;

      // Create a MediaRecorder to capture the video
      const stream = video.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quiz-video.webm";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

      // Start recording
      mediaRecorder.start();

      // Play the video
      await video.play();

      // Stop recording after the video duration
      setTimeout(() => {
        mediaRecorder.stop();
        video.pause();
      }, (300 / 30) * 1000); // Duration in frames / fps * 1000 for milliseconds
    } catch (error) {
      console.error("Failed to export video:", error);
    }
  };

return (
    <main className="min-h-screen relative">
      {/* Spline Background */}
      <div className="fixed inset-0 z-0">
        <Spline scene="https://prod.spline.design/NK6xV8F92uNHB-Gg/scene.splinecode" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <RemotionRoot />
        
        <div className="w-full max-w-7xl mx-auto p-4">
          <div className="flex flex-col gap-8">
            <Card className="border-none bg-background/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customizer Section */}
                  <div className="w-full max-w-2xl flex flex-col justidy-start gap-8 mx-auto lg:max-w-none px-[20px]">
                    <h2 className="text-2xl font-semibold mb-6">
                      Customize Your Quiz
                    </h2>
                    <QuizCustomizer onQuizGenerated={handleQuizGenerated} />
                  </div>

                  {/* Preview Section */}
                  <div className="w-full flex flex-col items-center justify-start">
                    <h2 className="text-2xl font-semibold mb-6">Preview</h2>
                    {quizConfig ? (
                      <div className="relative aspect-[9/16] h-[600px] w-[400px] rounded-2xl overflow-hidden shadow-lg">
                        <Player
                          component={QuizRenderer}
                          inputProps={{
                            ...quizConfig,
                            onExport: handleExport,
                            isPreview: true,
                          }}
                          durationInFrames={300}
                          compositionWidth={1080}
                          compositionHeight={1920}
                          fps={30}
                          controls
                          autoPlay
                          loop
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[600px] w-[400px] rounded-2xl bg-muted/50">
                        <p className="text-muted-foreground text-center px-4">
                          Customize your quiz settings to see the preview here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

