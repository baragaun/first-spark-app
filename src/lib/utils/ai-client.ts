import type { GiftCardData } from '$lib/services/github-models-service';

export interface AIExtractionResult {
  success: boolean;
  data?: GiftCardData;
  error?: string;
}

export async function extractGiftCardWithAI(
  ocrText: string,
  model?: string,
): Promise<AIExtractionResult> {
  try {
    const response = await fetch('/api/ai/extract-gift-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ocrText,
        model: model || 'xai/grok-3-mini',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to extract gift card data',
      };
    }

    return result;
  } catch (error) {
    console.error('Error calling GitHub Models API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
