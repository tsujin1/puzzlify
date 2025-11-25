import { useState, useCallback } from 'react';
import type { Tile } from '../../../types';

const isNeighbor = (pos1: number, pos2: number, size: number) => {
  const row1 = Math.floor(pos1 / size);
  const col1 = pos1 % size;
  const row2 = Math.floor(pos2 / size);
  const col2 = pos2 % size;

  return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
};

const checkWin = (tiles: Tile[]) => {
  return tiles.every(t => t.currentPos === t.correctPos);
};

const generateScrambledTiles = (size: number): Tile[] => {
  const totalTiles = size * size;
  const emptyId = totalTiles - 1;

  const tiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
    id: i,
    currentPos: i,
    correctPos: i,
  }));

  let emptyPos = emptyId;
  const moves = totalTiles * 20;

  for (let i = 0; i < moves; i++) {
    const neighbors = tiles.filter(t =>
      t.id !== emptyId && isNeighbor(t.currentPos, emptyPos, size)
    );

    if (neighbors.length === 0) continue;

    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    const tempPos = randomNeighbor.currentPos;

    randomNeighbor.currentPos = emptyPos;
    emptyPos = tempPos;
  }

  const emptyTile = tiles.find(t => t.id === emptyId);
  if (emptyTile) {
    emptyTile.currentPos = emptyPos;
  }

  return tiles;
};

export const useGameLogic = (gridSize: number) => {
  const [tiles, setTiles] = useState<Tile[]>(() => generateScrambledTiles(gridSize));
  const [isSolved, setIsSolved] = useState(false);
  const [prevGridSize, setPrevGridSize] = useState(gridSize);

  if (gridSize !== prevGridSize) {
    setPrevGridSize(gridSize);
    setTiles(generateScrambledTiles(gridSize));
    setIsSolved(false);
  }

  const handleTileClick = useCallback((tileId: number) => {
    if (isSolved) return;

    setTiles((currentTiles) => {
      const emptyId = gridSize * gridSize - 1;
      const emptyTile = currentTiles.find(t => t.id === emptyId);
      const clickedTile = currentTiles.find(t => t.id === tileId);

      if (!emptyTile || !clickedTile) return currentTiles;

      if (isNeighbor(clickedTile.currentPos, emptyTile.currentPos, gridSize)) {
        const newTiles = currentTiles.map(t => {
          if (t.id === clickedTile.id) return { ...t, currentPos: emptyTile.currentPos };
          if (t.id === emptyTile.id) return { ...t, currentPos: clickedTile.currentPos };
          return t;
        });

        if (checkWin(newTiles)) {
          setIsSolved(true);
        }

        return newTiles;
      }

      return currentTiles;
    });
  }, [gridSize, isSolved]);

  return { tiles, handleTileClick, isSolved };
};