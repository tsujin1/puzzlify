export const getBackgroundStyle = (
  correctPos: number,
  gridSize: number,
  imageUrl: string
) => {
  const correctRow = Math.floor(correctPos / gridSize);
  const correctCol = correctPos % gridSize;

  const xPercent = (correctCol * 100) / (gridSize - 1);
  const yPercent = (correctRow * 100) / (gridSize - 1);

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
    backgroundRepeat: 'no-repeat',
  };
};