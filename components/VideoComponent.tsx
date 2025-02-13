'use client'
import { useState, useEffect } from "react";
import { fetchVoiceover } from "../utils/fetchVoiceover";
import { Audio, Img } from "remotion";

export const VideoComponent = () => {
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string>("");

  useEffect(() => {
    const generateVoiceover = async () => {
      const url = await fetchVoiceover(
        "Can you name these 10 scrambled countries? First one, let’s go!"
      );
      setVoiceoverUrl(url);
    };

    generateVoiceover();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Img src="../public/download (2).jpg" />
      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">
        Country Scramble Quiz
      </h1>

      {/* Render the voiceover if it's available */}
      {voiceoverUrl && <Audio src={voiceoverUrl} startFrom={0} />}

      {/* Display captions */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-xl">
        {captions}
      </div>
    </div>
  );
};
