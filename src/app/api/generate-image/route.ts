import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, width = 1024, height = 1024 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const replicateApiToken = process.env.REPLICATE_API_TOKEN;

    if (!replicateApiToken) {
      // Return a self-contained placeholder if API token not configured
      console.warn('REPLICATE_API_TOKEN not configured, returning self-contained placeholder');

      // Create a base64 encoded SVG placeholder
      const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#e0e0e0"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#999999" text-anchor="middle" dy=".3em">
          ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}
        </text>
      </svg>`;

      const base64Svg = Buffer.from(svg).toString('base64');
      const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

      return NextResponse.json({
        imageUrl: dataUrl,
      });
    }

    // Call Replicate API for Stable Diffusion
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt,
          width,
          height,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start image generation');
    }

    const prediction = await response.json();

    // Poll for completion
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (!imageUrl && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${replicateApiToken}`,
          },
        }
      );

      const status = await statusResponse.json();

      if (status.status === 'succeeded') {
        imageUrl = status.output[0];
      } else if (status.status === 'failed') {
        throw new Error('Image generation failed');
      }

      attempts++;
    }

    if (!imageUrl) {
      throw new Error('Image generation timeout');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
