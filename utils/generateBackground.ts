import * as fal from "@fal-ai/serverless-client";

// Initialize fal client with type safety for environment variable
if (!process.env.NEXT_PUBLIC_FAL_AI_KEY) {
  throw new Error("FAL API key not found in environment variables");
}

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_AI_KEY,
});

// Define types for better type safety
type ImageSize = "portrait_16_9" | "square_1_1" | "landscape_16_9";

interface GenerateImageOptions {
  prompt?: string;
  negative_prompt?: string;
  image_size?: ImageSize;
  num_images?: number;
}

export const generateBackgroundImage = async (
  options: GenerateImageOptions = {}
) => {
  const {
    prompt = "Astronaut exploring galaxies in a vibrant universe, highly detailed space background",
    negative_prompt = "text, watermark, low quality, blurry",
    image_size = "portrait_16_9",
    num_images = 1,
  } = options;

  try {
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt,
        negative_prompt,
        image_size,
        num_images,
      },
    });

    if (!result.images?.[0]?.url) {
      throw new Error("No image generated");
    }

    return result.images[0].url;
  } catch (error) {
    console.error("Failed to generate background:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};
