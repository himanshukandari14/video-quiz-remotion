// utils/generateBackground.ts
import { fal } from "@fal-ai/serverless-client";

// Initialize fal client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
});

export const generateBackgroundImage = async () => {
  try {
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt:
          "Astronaut exploring galaxies in a vibrant universe, highly detailed space background",
        negative_prompt: "text, watermark, low quality, blurry",
        image_size: "portrait_16_9", // For vertical video format
        num_images: 1,
      },
    });

    if (result.images && result.images[0]) {
      return result.images[0].url;
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Failed to generate background:", error);
    throw error;
  }
};
