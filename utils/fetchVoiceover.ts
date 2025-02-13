import axios from "axios";

export const fetchVoiceover = async (text: string) => {
  const response = await axios.post(
    "https://api.elevenlabs.io/v1/text-to-speech/IKne3meq5aSn9XLyUdCD?output_format=mp3_44100_128",
    {
      text: text,
      model_id: "eleven_multilingual_v2",
    },
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY, xi-api-key header
        "Content-Type": "application/json",
      },
    }
  );


  return response.data; 
};
