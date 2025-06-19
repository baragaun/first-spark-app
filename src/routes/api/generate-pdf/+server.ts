import chromium from '@sparticuz/chromium';
import type { RequestHandler } from '@sveltejs/kit';
import JsBarcode from 'jsbarcode';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer-core';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { walletItemProduct, code } = await request.json();
    const barcodeValue = code || '5045 0794 5057 847';

    // Create a virtual DOM to generate the barcode
    const dom = new JSDOM(
      '<!DOCTYPE html><html><body><canvas id="barcode"></canvas></body></html>',
    );
    const canvas = dom.window.document.getElementById('barcode');

    const barcodeFormat = walletItemProduct.barcodeFormat || 'CODE39';
    const barcodeOptions = {
      format: barcodeFormat === 'QR_CODE' ? 'qrcode' : 'CODE39',
      displayValue: false,
      width: barcodeFormat === 'QR_CODE' ? 4 : 2,
      height: barcodeFormat === 'QR_CODE' ? 100 : 100,
    };

    // Generate barcode with the appropriate format
    JsBarcode(canvas, barcodeValue, barcodeOptions);

    // Get the barcode as a data URL
    const barcodeDataUrl = canvas.toDataURL('image/png');

    // Log the barcode data URL to check if it's being generated
    console.log('Barcode data URL length:', barcodeDataUrl.length);

    // Configure Puppeteer for server environment
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--disable-web-security', '--allow-file-access-from-files'],
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Create HTML content for the PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .card-image { width: 300px; height: auto; }
            .balance { font-size: 18px; font-weight: bold; margin: 15px 0; }
            .barcode { margin: 15px 0; width: 300px; height: auto; display: block; }
            .code { font-family: monospace; font-size: 16px; margin: 10px 0; }
            .instructions, .terms { font-size: 12px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="card-image" src="${
              walletItemProduct.imageSourceFront
                ? `https://d27wpajtnol6ce.cloudfront.net/giftcards/${walletItemProduct.imageSourceFront}`
                : 'placeholder-image-url'
            }" />
            <div class="balance">Balance: ${walletItemProduct.balance / 100}</div>

            <!-- Embed the barcode directly as an SVG instead of using a data URL -->
            <div class="barcode">
              ${canvas.outerHTML}
            </div>

            <div class="code">Code: ${barcodeValue}</div>
            <div class="instructions">Instructions: ${walletItemProduct.instructionsEn || ''}</div>
            <div class="terms">Terms: ${walletItemProduct.termsEn || ''}</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${walletItemProduct.name || 'wallet-item'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF', details: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
