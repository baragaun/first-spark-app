export interface GiftCardData {
  brandName: string;
  balance: number;
  barcode: string;
  pin: string;
  expiryDate?: string;
  cardNumber?: string;
  cvv?: string;
  additionalInfo?: string;
}

export interface GitHubModelsConfig {
  apiToken: string;
  model?: string;
  temperature?: number;
}

export class GitHubModelsService {
  private apiToken: string;
  private model: string;
  private temperature: number;
  private baseUrl = 'https://models.github.ai/inference';

  constructor(config: GitHubModelsConfig) {
    this.apiToken = config.apiToken;
    this.model = config.model || 'xai/grok-3-mini'; // Fast and accurate (no prefix needed)
    this.temperature = config.temperature || 0.1;
  }

  /**
   * Check if GitHub Models API is accessible
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${this.apiToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub Models API error response:', errorText);
      }

      return response.ok || response.status === 400; // 400 is ok, means API is accessible
    } catch (error) {
      console.error('GitHub Models is not available:', error);
      return false;
    }
  }

  /**
   * Convert extracted OCR text into structured GIFT CARD JSON
   */
  async extractGiftCardData(ocrText: string): Promise<GiftCardData | null> {
    try {
      const prompt = this.buildPrompt(ocrText);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${this.apiToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a gift card data extraction assistant. Extract information from OCR text and return ONLY valid JSON. No explanations, no markdown, just pure JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: this.temperature,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub Models API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      const jsonResponse = result.choices[0]?.message?.content;

      if (!jsonResponse) {
        throw new Error('No response from GitHub Models');
      }

      // Parse the JSON response
      const giftCardData = JSON.parse(jsonResponse);

      return this.validateAndNormalizeData(giftCardData);
    } catch (error) {
      console.error('Error extracting gift card data:', error);
      return null;
    }
  }

  /**
   * Extract gift card data directly from images using a vision-capable model.
   * Much more accurate than OCR → text → AI pipeline.
   */
  async extractGiftCardFromImages(
    frontImageBase64: string,
    backImageBase64?: string,
  ): Promise<GiftCardData | null> {
    try {
      const imageContent: any[] = [
        {
          type: 'text',
          text: this.buildVisionPrompt(!!backImageBase64),
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${frontImageBase64}`,
            detail: 'high',
          },
        },
      ];

      if (backImageBase64) {
        imageContent.push({
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${backImageBase64}`,
            detail: 'high',
          },
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${this.apiToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a gift card data extraction assistant. Extract information from gift card images and return ONLY valid JSON. No explanations, no markdown, just pure JSON.',
            },
            {
              role: 'user',
              content: imageContent,
            },
          ],
          temperature: this.temperature,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub Models API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      const jsonResponse = result.choices[0]?.message?.content;

      if (!jsonResponse) {
        throw new Error('No response from GitHub Models');
      }

      const giftCardData = JSON.parse(jsonResponse);
      return this.validateAndNormalizeData(giftCardData);
    } catch (error) {
      console.error('Error extracting gift card data from images:', error);
      return null;
    }
  }

  /**
   * Build the prompt for GitHub Models
   */
  private buildPrompt(ocrText: string): string {
    return `Extract gift card information from this OCR text and return a JSON object with these exact fields:

{
  "brandName": "the brand or company name (e.g., Amazon, Starbucks, Visa)",
  "balance": "the monetary value with currency symbol (e.g., $50.00, $25)",
  "barcode": "the barcode or card number (typically 16-20 digits)",
  "pin": "the PIN code if present (typically 4-8 digits)",
  "expiryDate": "expiry date if present (format: MM/YY or MM/YYYY)",
  "cardNumber": "card number if different from barcode",
  "cvv": "CVV/security code if present",
  "additionalInfo": "any other relevant information"
}

Rules:
- Return ONLY valid JSON, no markdown, no code blocks, no explanations
- If a field is not found, use an empty string ""
- For balance, do not include any symbols or text, just the numeric value (e.g., 50.00)
- For barcode, remove all spaces and format as continuous digits
- For pin, extract only the numeric digits
- Be precise and extract exact values from the text

OCR Text:
${ocrText}`;
  }

  /**
   * Build the prompt for vision-based extraction from card images.
   */
  private buildVisionPrompt(hasBackImage: boolean): string {
    const imageDescription = hasBackImage
      ? 'I am providing two images of a gift card: the FRONT and the BACK.'
      : 'I am providing one image of a gift card.';

    return `${imageDescription}

Extract gift card information from the image(s) and return a JSON object with these exact fields:

{
  "brandName": "the brand or company name (e.g., Amazon, Starbucks, Visa)",
  "balance": "the monetary value as a number (e.g., 50.00, 25)",
  "barcode": "the barcode or card number (typically 16-20 digits)",
  "pin": "the PIN code if present (typically 4-8 digits)",
  "expiryDate": "expiry date if present (format: MM/YY or MM/YYYY)",
  "cardNumber": "card number if different from barcode",
  "cvv": "CVV/security code if present",
  "additionalInfo": "any other relevant information"
}

Rules:
- Return ONLY valid JSON, no markdown, no code blocks, no explanations
- If a field is not found, use an empty string ""
- For balance, do not include any symbols or text, just the numeric value (e.g., 50.00)
- For barcode, remove all spaces and format as continuous digits
- For pin, extract only the numeric digits
- The front of the card usually shows the brand name and design
- The back of the card usually shows the barcode, PIN, balance, and terms
- Be precise and extract exact values from the images`;
  }

  /**
   * Validate and normalize the extracted data
   */
  private validateAndNormalizeData(data: any): GiftCardData {
    return {
      brandName: data.brandName?.trim() || '',
      balance: data.balance?.trim() || '',
      barcode: data.barcode?.replace(/\s+/g, '') || '',
      pin: data.pin?.replace(/\D/g, '') || '',
      expiryDate: data.expiryDate?.trim() || undefined,
      cardNumber: data.cardNumber?.replace(/\s+/g, '') || undefined,
      cvv: data.cvv?.replace(/\D/g, '') || undefined,
      additionalInfo: data.additionalInfo?.trim() || undefined,
    };
  }

  /**
   * Set the model to use
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.model;
  }
}
