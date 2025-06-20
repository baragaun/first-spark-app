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
      if (walletItemProduct.instructionsEn.startsWith('<')) {
        //doc.html(instructionLines, { x: 20, y: 85 } );
        doc.text(instructionLines, 20, 55);
      } else {
        doc.text(instructionLines, 20, 55);
      }
    }

    // Add terms if available
    if (walletItemProduct.termsEn) {
      doc.setFontSize(10);
      doc.text('Terms:', 20, 80);
      doc.setFontSize(8);
      const termsLines = doc.splitTextToSize(walletItemProduct.termsEn, 170);
      if (walletItemProduct.termsEn.startsWith('<')) {
        //doc.html(termsLines, { x: 20, y: 85 } );
        doc.text(termsLines, 20, 85);
      } else {
        doc.text(termsLines, 20, 85);
      }
    }

    // Try to add image if available
    if (walletItemProduct.imageSourceFront) {
      try {
        const imgUrl = `${walletCardImageDomain}/giftcards/${walletItemProduct.imageSourceFront}`;
        const dataUrl = await fetchProxyImageAsDataUrl(imgUrl);
        doc.addImage(dataUrl, 'JPEG', 20, 110, 160, 80);
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
function HTMLOptions(x: any, arg1: number, y: any, arg3: number) {
  throw new Error('Function not implemented.');
}
