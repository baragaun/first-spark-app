import chromium from '@sparticuz/chromium';
import type { RequestHandler } from '@sveltejs/kit';
import puppeteer from 'puppeteer-core';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { walletItemProduct, code, pin } = await request.json();
    const barcodeValue = code || '5045 0794 5057 847';

    console.log('Generating PDF with barcode value:', barcodeValue);

    const barcodeFormat = walletItemProduct.barcodeFormat || 'CODE39';
    // Use a barcode API service
    const barcodeApiUrl = `https://barcodeapi.org/api/${barcodeFormat === 'QR_CODE' ? 'qr' : 'code39'}/${encodeURIComponent(barcodeValue)}`;

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
            .barcode { margin: 15px 0; width: 500px; height: 120px; display: block; }
            .code { font-family: monospace; font-size: 16px; margin: 10px 0; }
            .instructions, .terms { font-size: 12px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${walletItemProduct.name || 'Gift Card'}</h1>
            <img class="card-image" src="${
              walletItemProduct.imageSourceFront
                ? `https://d27wpajtnol6ce.cloudfront.net/giftcards/${walletItemProduct.imageSourceFront}`
                : 'placeholder-image-url'
            }" />
            <div class="balance">Balance: $${walletItemProduct.balance / 100}</div>

            <!-- Barcode from API -->
            <div style="border: 1px solid #ccc; padding: 10px; margin: 15px 0;">
              <p>Barcode:</p>
              <img src="${barcodeApiUrl}" class="barcode" alt="Barcode" />
            </div>

            <div class="code">Code: ${barcodeValue || '5045 0794 5057 847'}</div>
            <div class="balance">Pin: ${pin || '1234'}</div>
            <div class="instructions">Instructions: ${walletItemProduct.instructionsEn || ''}</div>
            <div class="terms">Terms: ${walletItemProduct.termsEn || ''}</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent);
    console.log('HTML content set in Puppeteer page');

    // Wait for the barcode image to load
    await page.waitForSelector('img.barcode');

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    console.log('PDF generated, buffer size:', pdfBuffer.length);

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
