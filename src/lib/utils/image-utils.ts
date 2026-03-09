/**
 * Compress an image data URL to reduce size for mobile uploads.
 * Resizes to maxDimension and compresses to target quality.
 */
export function compressImage(
  dataUrl: string,
  maxDimension: number = 1200,
  quality: number = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if exceeding max dimension
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Extract the base64 data from a data URL (strips the data:image/...;base64, prefix).
 */
export function dataUrlToBase64(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex >= 0 ? dataUrl.substring(commaIndex + 1) : dataUrl;
}

/**
 * Detect barcodes from an image data URL using the native BarcodeDetector API.
 */
export async function detectBarcode(imageDataUrl: string): Promise<string> {
  try {
    if (typeof window === 'undefined' || !(window as any).BarcodeDetector) {
      return '';
    }

    const detector = new (window as any).BarcodeDetector({
      formats: ['code_128', 'ean_13', 'ean_8', 'code_39', 'upc_a', 'upc_e', 'codabar'],
    });

    const img = new Image();
    img.src = imageDataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(img, 0, 0);
    const barcodes = await detector.detect(canvas);
    if (barcodes.length > 0) {
      return barcodes[0].rawValue || barcodes[0].value || '';
    }
  } catch {
    // Barcode detection not supported or failed
  }
  return '';
}
