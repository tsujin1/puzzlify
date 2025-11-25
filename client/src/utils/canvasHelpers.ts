const drawPuzzleGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, gridSize: number) => {
  const pieceWidth = width / gridSize;
  const pieceHeight = height / gridSize;
  const knobSize = Math.min(pieceWidth, pieceHeight) * 0.15;

  ctx.save();
  ctx.translate(x, y);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Draw vertical puzzle lines
  for (let i = 1; i < gridSize; i++) {
    const lineX = i * pieceWidth;
    ctx.beginPath();
    ctx.moveTo(lineX, 0);

    for (let j = 0; j < gridSize; j++) {
      const pieceY = j * pieceHeight;
      const direction = (i + j) % 2 === 0 ? 1 : -1;

      ctx.lineTo(lineX, pieceY + pieceHeight / 2 - knobSize);
      ctx.bezierCurveTo(
        lineX + direction * knobSize, pieceY + pieceHeight / 2 - knobSize,
        lineX + direction * knobSize, pieceY + pieceHeight / 2 + knobSize,
        lineX, pieceY + pieceHeight / 2 + knobSize
      );
      ctx.lineTo(lineX, pieceY + pieceHeight);
    }
    ctx.stroke();
  }

  // Draw horizontal puzzle lines
  for (let i = 1; i < gridSize; i++) {
    const lineY = i * pieceHeight;
    ctx.beginPath();
    ctx.moveTo(0, lineY);

    for (let j = 0; j < gridSize; j++) {
      const pieceX = j * pieceWidth;
      const direction = (i + j) % 2 === 0 ? 1 : -1;

      ctx.lineTo(pieceX + pieceWidth / 2 - knobSize, lineY);
      ctx.bezierCurveTo(
        pieceX + pieceWidth / 2 - knobSize, lineY + direction * knobSize,
        pieceX + pieceWidth / 2 + knobSize, lineY + direction * knobSize,
        pieceX + pieceWidth / 2 + knobSize, lineY
      );
      ctx.lineTo(pieceX + pieceWidth, lineY);
    }
    ctx.stroke();
  }

  // Outer border
  ctx.strokeRect(0, 0, width, height);
  ctx.restore();
};

interface CertificateParams {
  imageUrl: string;
  gridSize: number;
  playerName: string;
  timeString: string;
  onComplete: () => void;
}

export const generateAndDownloadCertificate = ({
  imageUrl, gridSize, playerName, timeString, onComplete
}: CertificateParams) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    if (!ctx) return;

    const canvasWidth = 900;
    const canvasHeight = 700;

    const maxImageWidth = 600;
    const maxImageHeight = 400;
    const imageTop = 120;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

    ctx.fillStyle = '#333333';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Puzzle Completion Certificate", canvasWidth / 2, 60);

    const imgAspectRatio = img.width / img.height;
    const maxAspectRatio = maxImageWidth / maxImageHeight;

    let displayWidth, displayHeight;

    if (imgAspectRatio > maxAspectRatio) {
      displayWidth = maxImageWidth;
      displayHeight = maxImageWidth / imgAspectRatio;
    } else {
      displayHeight = maxImageHeight;
      displayWidth = maxImageHeight * imgAspectRatio;
    }

    const imageX = (canvasWidth - displayWidth) / 2;
    const imageY = imageTop;

    ctx.drawImage(img, imageX, imageY, displayWidth, displayHeight);

    drawPuzzleGrid(ctx, imageX, imageY, displayWidth, displayHeight, gridSize);

    ctx.fillStyle = '#222222';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText(playerName, canvasWidth / 2, imageTop + displayHeight + 60);

    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText("has successfully completed", canvasWidth / 2, imageTop + displayHeight + 100);

    ctx.fillStyle = '#444444';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(`Time Spent: ${timeString}`, canvasWidth / 2, imageTop + displayHeight + 140);

    const link = document.createElement('a');
    link.download = `puzzle-certificate-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    onComplete();
  };

  img.onerror = () => {
    console.error('Failed to load image for certificate');
    onComplete();
  };

  img.src = imageUrl;
};