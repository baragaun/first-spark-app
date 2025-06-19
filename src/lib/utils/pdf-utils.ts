import type { WalletItem } from '@baragaun/bg-node-client';
import { jsPDF } from 'jspdf';

export async function downloadPdf(
  walletItemProduct: WalletItem,
  code: string = '5045 0794 5057 847',
) {
  try {
    const doc = new jsPDF();
    const walletCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';

    // Set up document
    doc.setFontSize(16);
    doc.text(walletItemProduct.name || 'Gift Card', 20, 20);

    // Add balance
    doc.setFontSize(14);
    doc.text(`Balance: ${walletItemProduct.balance / 100}`, 20, 30);

    // Add code
    doc.setFontSize(12);
    doc.text(`Code: ${code}`, 20, 40);

    // Add instructions if available
    if (walletItemProduct.instructionsEn) {
      doc.setFontSize(10);
      doc.text('Instructions:', 20, 50);
      doc.setFontSize(8);
      const instructionLines = doc.splitTextToSize(walletItemProduct.instructionsEn, 170);
      doc.text(instructionLines, 20, 55);
    }

    // Add terms if available
    if (walletItemProduct.termsEn) {
      doc.setFontSize(10);
      doc.text('Terms:', 20, 80);
      doc.setFontSize(8);
      const termsLines = doc.splitTextToSize(walletItemProduct.termsEn, 170);
      doc.text(termsLines, 20, 85);
    }

    // Try to add image if available
    if (walletItemProduct.imageSourceFront) {
      try {
        const imgUrl = `${walletCardImageDomain}/giftcards/${walletItemProduct.imageSourceFront}`;
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imgUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          const imgData = canvas.toDataURL('image/jpeg');
          doc.addImage(imgData, 'JPEG', 20, 110, 160, 80);
        } else {
          console.error('Could not get 2D context from canvas.');
        }
      } catch (imgError) {
        console.error('Error adding image to PDF:', imgError);
      }
    }

    // Save the PDF
    doc.save(`${walletItemProduct.name || 'wallet-item'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
