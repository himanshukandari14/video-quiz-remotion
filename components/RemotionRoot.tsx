// components/RemotionRoot.tsx
"use client";
import { Composition } from "remotion";
import { VideoContent } from "./VideoComponent";

export const RemotionRoot = () => {
  return (
    <Composition
      id="CountryScrambleQuiz"
      component={VideoContent}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
