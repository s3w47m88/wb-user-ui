export type ImageGenerationParams = {
  prompt: string;
  width?: number;
  height?: number;
};

export async function generateImage(params: ImageGenerationParams): Promise<string> {
  const { prompt, width = 1024, height = 1024 } = params;

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, width, height }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}
