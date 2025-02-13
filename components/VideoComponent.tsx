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

const countries: Country[] = countriesData.countryList.map((name) => ({
  original: name,
  scrambled: shuffleString(name),
}));

// export const VideoContent: React.FC = () => {
//   const { width, height } = useVideoConfig();
//   const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [timer, setTimer] = useState(3);
//   const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
//   const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
//   const [videoContent, setVideoContent] = useState<VideoContent | null>(null);
//   const [answeredCountries, setAnsweredCountries] = useState<Country[]>([]);

//   const generateVoiceover = useCallback(async () => {
//     if (currentCountryIndex < countries.length) {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const voiceoverText = `Can you name this scrambled country? Your word is ${countries[currentCountryIndex].scrambled}`;
//         const url = await fetchVoiceover(voiceoverText);
//         setVoiceoverUrl(url);
//       } catch (err) {
//         console.error("Failed to generate voiceover:", err);
//         setError("Failed to generate audio");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [currentCountryIndex]);

//   useEffect(() => {
//     const initializeVideo = async () => {
//       try {
//         const { backgroundImageUrl, videoContent: content } =
//           await generateBackgroundImage();
//         setBackgroundUrl(backgroundImageUrl);
//         setVideoContent(content);

//         if (content.captions && content.captions.length > 0) {
//           setCurrentCaption(content.captions[0]);
//         }
//       } catch (error) {
//         console.error("Failed to initialize video:", error);
//         setError("Failed to initialize video content");
//       }
//     };

//     initializeVideo();
//   }, []);

//   useEffect(() => {
//     if (!videoContent?.captions) return;

//     const captionTimer = setInterval(() => {
//       const currentTime = timer;
//       const newCaption = videoContent.captions.find(
//         (caption) =>
//           currentTime >= caption.startTime &&
//           currentTime < caption.startTime + caption.duration
//       );

//       if (newCaption) {
//         setCurrentCaption(newCaption);
//       }
//     }, 100);

//     return () => clearInterval(captionTimer);
//   }, [timer, videoContent]);

//   useEffect(() => {
//     generateVoiceover();
//   }, [generateVoiceover]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev === 1) {
//           setShowAnswer(true);
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [currentCountryIndex]);

//   const moveToNextCountry = useCallback(() => {
//     if (currentCountryIndex < countries.length - 1) {
//       setCurrentCountryIndex((prev) => prev + 1);
//       setShowAnswer(false);
//       setTimer(3);
//     }
//   }, [currentCountryIndex]);

//   useEffect(() => {
//     if (showAnswer) {
//       setAnsweredCountries((prev) => [...prev, countries[currentCountryIndex]]);

//       const timeout = setTimeout(() => {
//         moveToNextCountry();
//       }, 2000);
//       return () => clearTimeout(timeout);
//     }
//   }, [showAnswer, moveToNextCountry, currentCountryIndex]);

//   return (
//     <div
//       style={{
//         width,
//         height,
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//       }}
//       className="bg-gradient-to-b from-blue-900 to-black"
//     >
//       {backgroundUrl && (
//         <Img
//           src={backgroundUrl}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: 0,
//           }}
//         />
//       )}

//      <div className="absolute top-0 left-[10px] z-10 w-[400px] flex flex-col justify-center items-center">
//   <h1 className="text-white text-2xl font-semibold text-center mb-2">
//     Country Scramble Quiz
//   </h1>

//   {currentCaption && (
//     <div className="w-full mb-8">
//       <div className="inline-block text-red-800 text-xl text-center rounded-xl">
//         {currentCaption.text}
//       </div>
//     </div>
//   )}

//   <div className="space-y-0">
//     {!showAnswer ? (
//       <h2 className="text-white text-[14px] font-bold text-center">
//         {countries[currentCountryIndex].scrambled}
//       </h2>
//     ) : (
//       <h3 className="text-green-400 text-[14px] font-bold text-center">
//         Answer: {countries[currentCountryIndex].original}
//       </h3>
//     )}

//     {!showAnswer ? (
//       <h3 className="text-white text-[14px] text-center">
//         Revealing in {timer}...
//       </h3>
//     ) : (
//       <h3 className="text-green-400 text-4xl font-bold text-center">
//         Answer: {countries[currentCountryIndex].original}
//       </h3>
//     )}
//   </div>
// </div>


//       <div
//         className="absolute left-8 top-[10%] text-white text-lg font-medium space-y-0"
//         style={{ maxHeight: "90%", overflowY: "auto" }}
//       >
//         <h3 className="font-semibold text-xl mb-4">Answered Countries:</h3>
//         <ul>
//           {answeredCountries.map((country, index) => (
//             <li key={index} className="mb-2">{`${index + 1}. ${
//               country.original
//             }`}</li>
//           ))}
//         </ul>
//       </div>

//       {error && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="text-white text-xl">{error}</div>
//         </div>
//       )}

//       <div className="absolute bottom-8 w-full text-center text-white text-lg">
//         {currentCountryIndex + 1} / 10
//       </div>

//       {voiceoverUrl && !error && <Audio src={voiceoverUrl} startFrom={0} />}

//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="text-white text-xl">Loading...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoContent;


export const VideoContent: React.FC = () => {
  const { width, height } = useVideoConfig();
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCountryIndex, setCurrentCountryIndex] = useState(-1); // Start with -1 for intro phase
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(3);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [answeredCountries, setAnsweredCountries] = useState<Country[]>([]);
  const [introPhase, setIntroPhase] = useState(true); // Intro phase state

  // Generate voiceover for intro or quiz
  const generateVoiceover = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await fetchVoiceover(text);
      setVoiceoverUrl(url);
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
        const { backgroundImageUrl } = await generateBackgroundImage();
        setBackgroundUrl(backgroundImageUrl);

        // Play intro voiceover
        const introText = "Can you guess the 10 scrambled countries? Let's go!";
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
  }, [generateVoiceover]);

  // Handle quiz logic
  useEffect(() => {
    if (introPhase || currentCountryIndex < 0) return; // Skip if still in intro phase

    const handleQuestion = async () => {
      const scrambled = countries[currentCountryIndex].scrambled;
      const questionText = `Can you name this scrambled country? Your word is ${scrambled}`;
      await generateVoiceover(questionText);

      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShowAnswer(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    };

    handleQuestion();
  }, [currentCountryIndex, introPhase, generateVoiceover]);

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
  }, [showAnswer, currentCountryIndex]);

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
      }}
      className="bg-gradient-to-b from-blue-900 to-black"
    >
      {backgroundUrl && (
        <Img
          src={backgroundUrl}
          style={{
            width: "100%",
            height: "100%",
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
          <h1 className="text-white text-5xl font-bold text-center">
            Can you guess the 10 scrambled countries?
            <br />
            <span className="text-3xl mt-4 block">Let's go!</span>
          </h1>
        </div>
      )}

      {/* Quiz Content */}
      {!introPhase && (
        <>
          <div className="absolute top-0 left-[10px] z-10 w-[400px] flex flex-col justify-center items-center">
            <h1 className="text-white text-2xl font-semibold text-center mb-2">
              Country Scramble Quiz
            </h1>

            <div className="space-y-0">
              {!showAnswer ? (
                <>
                  <h2 className="text-white text-[14px] font-bold text-center">
                    {countries[currentCountryIndex].scrambled}
                  </h2>
                  <h3 className="text-white text-[14px] text-center">
                    Revealing in {timer}...
                  </h3>
                </>
              ) : (
                <h3 className="text-green-400 text-[14px] font-bold text-center">
                  Answer: {countries[currentCountryIndex].original}
                </h3>
              )}
            </div>
          </div>

          <div
            className="absolute left-8 top-[10%] text-white text-lg font-medium space-y-0"
            style={{ maxHeight: "90%", overflowY: "auto" }}
          >
            <h3 className="font-semibold text-xl mb-4">Answered Countries:</h3>
            <ul>
              {answeredCountries.map((country, index) => (
                <li key={index} className="mb-2">{`${index + 1}. ${
                  country.original
                }`}</li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-8 w-full text-center text-white text-lg">
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

export default VideoContent;
