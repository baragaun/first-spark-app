import { env } from '$env/dynamic/private';
import { GitHubModelsService } from '$lib/services/github-models-service';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Vision-capable model for image-based extraction
const VISION_MODEL = 'openai/gpt-4o-mini';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { ocrText, model, useVision, frontImage, backImage } = body;

    if (!useVision && !ocrText) {
      return json({ error: 'OCR text or images are required' }, { status: 400 });
    }

    if (useVision && !frontImage) {
      return json({ error: 'At least the front image is required' }, { status: 400 });
    }

    if (!env.GITHUB_PAT) {
      return json(
        { error: 'GitHub PAT is not configured. Please set GITHUB_PAT in .env file.' },
        { status: 503 },
      );
    }

    // Use vision model for image-based extraction, text model for OCR
    const selectedModel = useVision ? VISION_MODEL : model || 'xai/grok-3-mini';

    const githubModelsService = new GitHubModelsService({
      apiToken: env.GITHUB_PAT,
      model: selectedModel,
      temperature: 0.1,
    });

    let giftCardData;

    if (useVision && frontImage) {
      // Vision-based extraction from images — skip isAvailable check to avoid extra API call
      giftCardData = await githubModelsService.extractGiftCardFromImages(frontImage, backImage);
    } else {
      // Text-based extraction from OCR — check availability first
      const isAvailable = await githubModelsService.isAvailable();
      if (!isAvailable) {
        return json(
          { error: 'GitHub Models API is not available. Please check your GITHUB_PAT.' },
          { status: 503 },
        );
      }
      giftCardData = await githubModelsService.extractGiftCardData(ocrText);
    }

    if (!giftCardData) {
      return json({ error: 'Failed to extract gift card data' }, { status: 500 });
    }

    return json({ success: true, data: giftCardData });
  } catch (error) {
    console.error('Error in GitHub Models API endpoint:', error);
    return json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
};
