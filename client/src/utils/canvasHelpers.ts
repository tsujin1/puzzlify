const drawPuzzleGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, gridSize: number, yOffset: number) => {
  const pieceWidth = width / gridSize;
  const pieceHeight = height / gridSize;
  const knobSize = Math.min(pieceWidth, pieceHeight) * 0.15;

  ctx.save();
  ctx.translate(0, yOffset);

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = width / 200;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = width / 150;
  ctx.shadowOffsetX = width / 400;
  ctx.shadowOffsetY = width / 400;

  for (let i = 1; i < gridSize; i++) {
    const x = i * pieceWidth;
    ctx.moveTo(x, 0);
    for (let j = 0; j < gridSize; j++) {
      const y = j * pieceHeight;
      const direction = (i + j) % 2 === 0 ? 1 : -1;
      ctx.lineTo(x, y + pieceHeight / 2 - knobSize);
      ctx.bezierCurveTo(
        x + direction * knobSize, y + pieceHeight / 2 - knobSize,
        x + direction * knobSize, y + pieceHeight / 2 + knobSize,
        x, y + pieceHeight / 2 + knobSize
      );
      ctx.lineTo(x, y + pieceHeight);
    }

    const y = i * pieceHeight;
    ctx.moveTo(0, y);
    for (let j = 0; j < gridSize; j++) {
      const x = j * pieceWidth;
      const direction = (i + j) % 2 === 0 ? 1 : -1;
      ctx.lineTo(x + pieceWidth / 2 - knobSize, y);
      ctx.bezierCurveTo(
        x + pieceWidth / 2 - knobSize, y + direction * knobSize,
        x + pieceWidth / 2 + knobSize, y + direction * knobSize,
        x + pieceWidth / 2 + knobSize, y
      );
      ctx.lineTo(x + pieceWidth, y);
    }
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.stroke();
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

    const imageYOffset = 120;
    const footerHeight = 180;
    const canvasWidth = img.width;
    const canvasHeight = img.height + imageYOffset + footerHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const borderWidth = canvasWidth * 0.02;
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth);
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = borderWidth / 2;
    ctx.strokeRect(borderWidth * 1.5, borderWidth * 1.5, canvasWidth - borderWidth * 3, canvasHeight - borderWidth * 3);

    ctx.fillStyle = '#1e293b';
    const titleFontSize = Math.max(40, canvasWidth / 15);
    ctx.font = `bold ${titleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("CERTIFICATE OF COMPLETION", canvasWidth / 2, imageYOffset / 2);

    ctx.drawImage(img, 0, imageYOffset);
    drawPuzzleGrid(ctx, img.width, img.height, gridSize, imageYOffset);

    const footerStartY = imageYOffset + img.height + 50;

    ctx.fillStyle = '#64748b';
    ctx.font = `${titleFontSize * 0.4}px sans-serif`;
    ctx.fillText("Presented to", canvasWidth / 2, footerStartY);

    ctx.fillStyle = '#334155';
    ctx.font = `bold ${titleFontSize * 0.8}px sans-serif`;
    ctx.fillText(playerName, canvasWidth / 2, footerStartY + titleFontSize * 0.8);

    ctx.fillStyle = '#64748b';
    ctx.font = `${titleFontSize * 0.4}px sans-serif`;
    ctx.fillText("for successfully solving the puzzle in", canvasWidth / 2, footerStartY + titleFontSize * 1.4);

    ctx.fillStyle = '#6366f1';
    ctx.font = `bold ${titleFontSize * 0.6}px monospace`;
    ctx.fillText(timeString, canvasWidth / 2, footerStartY + titleFontSize * 2.1);

    const link = document.createElement('a');
    link.download = `puzzlify-certificate-${playerName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    onComplete();
  };
  img.src = imageUrl;
};