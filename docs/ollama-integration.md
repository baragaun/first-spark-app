# Ollama Integration for Gift Card Extraction

This document explains how to use the Ollama service to extract and structure gift card data from OCR text.

## Overview

The Ollama integration provides AI-powered extraction of gift card information from OCR text, converting unstructured text into a clean JSON format with fields like brand name, balance, barcode, PIN, etc.

## Prerequisites

### 1. Install Ollama

Download and install Ollama from [https://ollama.ai](https://ollama.ai)

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [https://ollama.ai/download](https://ollama.ai/download)

### 2. Pull a Model

After installing Ollama, pull a model (recommended: llama3.2 for good balance of speed and accuracy):

```bash
# Recommended model (smaller, faster)
ollama pull llama3.2

# Alternative models
ollama pull llama3.1      # Larger, more accurate
ollama pull mistral       # Good alternative
ollama pull phi3          # Very small and fast
```

### 3. Start Ollama Service

```bash
ollama serve
```

The service will run on `http://localhost:11434` by default.

## Usage

### Option 1: Using the Component

The easiest way to use Ollama extraction is with the pre-built component:

```svelte
<script lang="ts">
  import GiftCardOllamaExtractor from '$lib/components/gift-card-ollama-extractor.svelte';
  import type { GiftCardData } from '$lib/services/ollama-service';

  let ocrText = "AMAZON\n$50.00\n1234 5678 9012 3456\nPIN: 8765";

  function handleExtracted(data: GiftCardData) {
    console.log('Extracted data:', data);
    // Use the extracted data to populate your form
  }
</script>

<GiftCardOllamaExtractor {ocrText} onExtracted={handleExtracted} />
```

### Option 2: Using the Client Utility

For more control, use the client utility directly:

```svelte
<script lang="ts">
  import { extractGiftCardWithOllama } from '$lib/utils/ollama-client';

  async function processOCR(ocrText: string) {
    const result = await extractGiftCardWithOllama(ocrText, 'llama3.2');
    
    if (result.success && result.data) {
      console.log('Brand:', result.data.brandName);
      console.log('Balance:', result.data.balance);
      console.log('Barcode:', result.data.barcode);
      console.log('PIN:', result.data.pin);
    } else {
      console.error('Error:', result.error);
    }
  }
</script>
```

### Option 3: Using the Service Directly (Server-side)

```typescript
import { OllamaService } from '$lib/services/ollama-service';

const ollamaService = new OllamaService({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2',
  temperature: 0.1,
});

// Check availability
const isAvailable = await ollamaService.isAvailable();

// Extract data
const giftCardData = await ollamaService.extractGiftCardData(ocrText);
```

## Integration with Existing OCR Flow

You can integrate Ollama into your existing wallet upload flow. Here's an example:

```svelte
<script lang="ts">
  import Tesseract from 'tesseract.js';
  import { extractGiftCardWithOllama } from '$lib/utils/ollama-client';

  async function handleFileUpload(imageDataUrl: string) {
    // Step 1: Extract text with Tesseract
    const { data: { text } } = await Tesseract.recognize(imageDataUrl, 'eng');
    console.log('OCR Text:', text);

    // Step 2: Use Ollama to structure the data
    const result = await extractGiftCardWithOllama(text);
    
    if (result.success && result.data) {
      // Step 3: Use the structured data
      uploadedCardSetValues({
        brandNameValue: result.data.brandName,
        balanceValue: result.data.balance,
        barcodeValue: result.data.barcode,
        pinValue: result.data.pin,
        imageUrlData: imageDataUrl,
        isLoading: false,
      });
    }
  }
</script>
```

## API Reference

### GiftCardData Interface

```typescript
interface GiftCardData {
  brandName: string;        // e.g., "Amazon", "Starbucks"
  balance: string;          // e.g., "$50.00"
  barcode: string;          // e.g., "1234567890123456"
  pin: string;              // e.g., "8765"
  expiryDate?: string;      // e.g., "12/25"
  cardNumber?: string;      // Alternative to barcode
  cvv?: string;             // Security code
  additionalInfo?: string;  // Any other relevant info
}
```

### OllamaService Methods

- `isAvailable()`: Check if Ollama is running
- `getAvailableModels()`: Get list of installed models
- `extractGiftCardData(ocrText)`: Extract structured data from OCR text
- `setModel(model)`: Change the model being used

## Troubleshooting

### Ollama Not Available

If you see "Ollama service is not available":

1. Make sure Ollama is installed
2. Start the service: `ollama serve`
3. Check if it's running: `curl http://localhost:11434/api/tags`

### Model Not Found

If you get a model error:

```bash
# List installed models
ollama list

# Pull the required model
ollama pull llama3.2
```

### Poor Extraction Quality

Try these solutions:

1. Use a larger model: `ollama pull llama3.1`
2. Improve OCR quality first (better image preprocessing)
3. Adjust temperature (lower = more deterministic)

## Performance Tips

- **llama3.2**: Best balance of speed and accuracy (recommended)
- **phi3**: Fastest, good for simple cards
- **llama3.1**: Most accurate, slower
- **mistral**: Good alternative to llama models

## Environment Variables (Optional)

You can configure Ollama settings via environment variables:

```env
# .env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_TEMPERATURE=0.1
```

## Security Notes

- Ollama runs locally, so your gift card data never leaves your machine
- The service is only accessible from localhost by default
- No data is sent to external APIs

