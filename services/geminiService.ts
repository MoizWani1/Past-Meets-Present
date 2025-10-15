
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseDataUrl = (dataUrl: string): { mimeType: string; data: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const data = parts[1];
    return { mimeType, data };
};

export const generateReconnectedImage = async (childhoodDataUrl: string, currentDataUrl: string): Promise<string> => {
    const childhoodPhoto = parseDataUrl(childhoodDataUrl);
    const currentPhoto = parseDataUrl(currentDataUrl);

    const model = 'gemini-2.5-flash-image';
    const prompt = `I have provided two images. The first is a childhood photo, and the second is a current photo of the same person.
Generate a highly realistic and emotionally warm image showing the same person at two different ages — their childhood version from the first image and their current adult version from the second image — standing side by side and shaking hands while smiling warmly at each other.
Both faces must look naturally connected and share similar features to prove they are the same person at different ages.
The background should be softly lit, with warm, cinematic tones, like golden-hour lighting.
Ensure the pose, lighting, and expressions look genuine and heartfelt—not cartoonish or AI-glossy.
The final image must look like a real photograph captured by a high-end DSLR camera. There should be no text, watermarks, or logos on the image.
Composition guidelines:
- A full upper-body shot.
- Slight depth-of-field effect with a soft background blur.
- A subtle lens flare to enhance realism.
- The aspect ratio must be exactly 4:5.
Key style words: realistic portrait, human connection, emotional moment, handshake, smile, nostalgia, cinematic.`;

    const imagePart1 = {
        inlineData: { mimeType: childhoodPhoto.mimeType, data: childhoodPhoto.data },
    };
    const imagePart2 = {
        inlineData: { mimeType: currentPhoto.mimeType, data: currentPhoto.data },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart1, imagePart2, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated. The response may have been blocked.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to create the image. Please try again with different photos.");
    }
};
