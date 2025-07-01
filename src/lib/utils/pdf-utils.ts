import { giftCardImageDomain } from '@/constants';
import type { WalletItem } from '@baragaun/bg-node-client';
import { jsPDF } from 'jspdf';

async function fetchProxyImageAsDataUrl(imageUrl: string): Promise<string> {
  //const resp = await fetch('/api/image-proxy');
  const resp = await fetch(`/api/image-proxy?imageUrl=${encodeURIComponent(imageUrl)}`);
  if (!resp.ok) throw new Error('Proxy fetch failed.');
  const blob = await resp.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}

function measureHtmlContentHeight(htmlString: string, widthPt: number): number {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.width = `${widthPt}px`; // A4 width in points, e.g. 595
  div.innerHTML = htmlString;
  document.body.appendChild(div);
  const { height: heightPx } = div.getBoundingClientRect();
  return heightPx;
}

export async function downloadPdf(
  walletItemProduct: WalletItem,
  code: string = '5045 0794 5057 847',
  pin: string = '1234',
) {
  try {
    //const doc = new jsPDF();
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth() - 40 * 2;
    let positionY = 30;
    const topPadding = 30;
    const leftPadding = 40;

    // Set up document
    doc.setFontSize(16);
    doc.text(walletItemProduct.name || 'Gift Card', pageWidth / 2, positionY, { align: 'center' });

    positionY += topPadding;
    // Try to add image if available
    if (walletItemProduct.imageSourceFront) {
      try {
        const imgUrl = `${giftCardImageDomain}/giftcards/${walletItemProduct.imageSourceFront}`;
        const dataUrl = await fetchProxyImageAsDataUrl(imgUrl);
        doc.addImage(dataUrl, 'JPEG', pageWidth / 2 - 100, positionY, 200, 120);
      } catch (imgError) {
        console.error('Error adding image to PDF:', imgError);
      }
    }

    // Add balance
    positionY = positionY + 120 + topPadding;
    doc.setFontSize(14);
    doc.text(
      `Balance: $${(walletItemProduct.balance / 100).toFixed(2)}`,
      pageWidth / 2,
      positionY,
      { align: 'center' },
    );

    // Add code
    positionY += topPadding;

    // Add barcode image using barcodeapi.org
    const barcodeFormat = walletItemProduct.barcodeFormat ?? 'code128';
    const barcodeApiUrl = `https://barcodeapi.org/api/${barcodeFormat}/${encodeURIComponent(code)}`;
    const resp = await fetch(barcodeApiUrl);
    const blob = await resp.blob();
    const barcodeDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(blob);
    });
    let barcodeHeight = 200;
    let barcodeWidth = 200;
    if (walletItemProduct.barcodeFormat == null || walletItemProduct.barcodeFormat == undefined) {
      barcodeHeight = 80;
      barcodeWidth = 300;
    }
    doc.addImage(
      barcodeDataUrl,
      'PNG',
      pageWidth / 2 - barcodeWidth / 2,
      positionY,
      barcodeWidth,
      barcodeHeight,
    ); // larger barcode
    positionY = positionY + barcodeHeight + topPadding;

    let container = document.createElement('div');
    container.style.width = `${pageWidth.toString()}px`;
    container.style.fontSize = '12pt';
    container.style.lineHeight = '1.4';
    container.style.fontFamily = 'Arial, sans-serif';

    doc.text(`Pin: ${pin}`, pageWidth / 2, positionY, { align: 'center' });

    positionY += topPadding;

    // Add instructions if available
    if (walletItemProduct.instructionsEn) {
      doc.setFontSize(12);
      doc.text('How to Reedem', leftPadding, positionY);
      positionY += topPadding;
      doc.setFontSize(10);
      doc.setTextColor('#808080');
      const instructionLines = doc.splitTextToSize(walletItemProduct.instructionsEn, pageWidth);
      if (walletItemProduct.instructionsEn.startsWith('<')) {
        const heightPx = measureHtmlContentHeight(walletItemProduct.instructionsEn, pageWidth);

        container.innerHTML = walletItemProduct.instructionsEn;
        await doc.html(container, {
          x: leftPadding,
          y: positionY,
          width: pageWidth,
          autoPaging: 'text',
          html2canvas: {
            scale: 0.8,
            letterRendering: true,
            logging: false,
          },
        });
        positionY = positionY + heightPx + topPadding;
      } else {
        doc.text(instructionLines, leftPadding, positionY, { align: 'left', maxWidth: pageWidth });
        positionY = positionY + instructionLines.length * 10 + topPadding;
      }
    }

    // Add terms if available
    if (walletItemProduct.termsEn) {
      doc.setFontSize(12);
      doc.setTextColor('#000000');
      doc.text('Terms & Conditions', leftPadding, positionY);
      positionY += topPadding;
      doc.setFontSize(10);
      doc.setTextColor('#808080');
      const termsLines = doc.splitTextToSize(walletItemProduct.termsEn, pageWidth);
      if (walletItemProduct.termsEn.startsWith('<')) {
        const heightPx = measureHtmlContentHeight(walletItemProduct.termsEn, pageWidth);
        container.innerHTML = walletItemProduct.termsEn;
        await doc.html(container, {
          x: leftPadding,
          y: positionY,
          width: pageWidth,
          autoPaging: 'text',
          html2canvas: {
            scale: 0.8,
            letterRendering: true,
            logging: false,
          },
        });
        positionY = positionY + heightPx + topPadding;
      } else {
        doc.text(termsLines, leftPadding, positionY, { align: 'left' });
      }
    }

    // Save the PDF
    doc.save(`${walletItemProduct.name || 'wallet-item'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
