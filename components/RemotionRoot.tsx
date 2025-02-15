
"use client";
import { Composition } from "remotion";
import { QuizRenderer } from "./VideoComponent";

export const RemotionRoot = () => {
  return (
    <Composition
      id="CountryScrambleQuiz"
      component={QuizRenderer as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
