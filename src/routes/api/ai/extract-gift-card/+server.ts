import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { GitHubModelsService } from '$lib/services/github-models-service';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { ocrText, model } = await request.json();

    if (!ocrText) {
      return json({ error: 'OCR text is required' }, { status: 400 });
    }

    if (!env.GITHUB_PAT) {
      return json(
        { error: 'GitHub PAT is not configured. Please set GITHUB_PAT in .env file.' },
        { status: 503 }
      );
    }

    // Initialize GitHub Models service
    const githubModelsService = new GitHubModelsService({
      apiToken: env.GITHUB_PAT,
      model: model || 'xai/grok-3-mini',
      temperature: 0.1,
    });

    // Check if GitHub Models is available
    const isAvailable = await githubModelsService.isAvailable();
    if (!isAvailable) {
      return json(
        { error: 'GitHub Models API is not available. Please check your GITHUB_PAT.' },
        { status: 503 }
      );
    }

    // Extract gift card data
    const giftCardData = await githubModelsService.extractGiftCardData(ocrText);

    if (!giftCardData) {
      return json({ error: 'Failed to extract gift card data' }, { status: 500 });
    }

    return json({ success: true, data: giftCardData });
  } catch (error) {
    console.error('Error in GitHub Models API endpoint:', error);
    return json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
