# Ollama Quick Reference

## Installation (One-time setup)

```bash
# Install Ollama
brew install ollama

# Pull recommended model
ollama pull llama3.2

# Start service (keep running in background)
ollama serve
```

## Basic Usage

### 1. Simple Extraction

```typescript
import { extractGiftCardWithOllama } from '$lib/utils/ollama-client';

const result = await extractGiftCardWithOllama(ocrText);

if (result.success) {
  console.log(result.data.brandName);  // "Amazon"
  console.log(result.data.balance);    // "$50.00"
  console.log(result.data.barcode);    // "1234567890123456"
  console.log(result.data.pin);        // "8765"
}
```

### 2. Using the Component

```svelte
<script>
  import GiftCardOllamaExtractor from '$lib/components/gift-card-ollama-extractor.svelte';
  
  let ocrText = "...";
</script>

<GiftCardOllamaExtractor 
  {ocrText} 
  onExtracted={(data) => console.log(data)} 
/>
```

### 3. Check Availability

```typescript
import { checkOllamaAvailability } from '$lib/utils/ollama-client';

const isAvailable = await checkOllamaAvailability();
```

## Integration with Existing Code

Add to your `handleFileChange` in `wallet/+page.svelte`:

```typescript
// After Tesseract OCR
const { data: { text } } = await Tesseract.recognize(imageDataUrl, 'eng');

// Add Ollama extraction
const result = await extractGiftCardWithOllama(text);

if (result.success && result.data) {
  uploadedCardSetValues({
    brandNameValue: result.data.brandName,
    balanceValue: result.data.balance,
    barcodeValue: result.data.barcode || barcode,
    pinValue: result.data.pin,
    imageUrlData: imageDataUrl,
    isLoading: false,
  });
}
```

## API Endpoints

### POST `/api/ollama/extract-gift-card`

Request:
```json
{
  "ocrText": "AMAZON\n$50.00\n...",
  "model": "llama3.2"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "brandName": "Amazon",
    "balance": "$50.00",
    "barcode": "1234567890123456",
    "pin": "8765"
  }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Ollama not available" | Run `ollama serve` |
| "Model not found" | Run `ollama pull llama3.2` |
| Slow extraction | Use smaller model: `ollama pull phi3` |
| Poor accuracy | Use larger model: `ollama pull llama3.1` |

## Model Comparison

| Model | Speed | Accuracy | Best For |
|-------|-------|----------|----------|
| phi3 | ⚡⚡⚡ | ⭐⭐ | Quick testing |
| llama3.2 | ⚡⚡ | ⭐⭐⭐ | Production (recommended) |
| llama3.1 | ⚡ | ⭐⭐⭐⭐ | Maximum accuracy |

## Testing

Visit `/test-ollama` in your app to test the integration.

## Files Reference

- **Service**: `src/lib/services/ollama-service.ts`
- **Client**: `src/lib/utils/ollama-client.ts`
- **API**: `src/routes/api/ollama/extract-gift-card/+server.ts`
- **Component**: `src/lib/components/gift-card-ollama-extractor.svelte`
- **Example**: `src/routes/wallet/upload-card-with-ollama-example.svelte`
- **Test Page**: `src/routes/test-ollama/+page.svelte`

