import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { SfxKey, sfxUris } from '../utils/sfx';
import { useSoundSettings } from '../context/SoundSettingsContext';

const rows = 14;
const cols = 8;

type Cell = 0 | 1 | 2;

type Shape = number[][];

const shapes: Shape[] = [
  [
    [1, 1, 1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

const rotateShape = (matrix: Shape): Shape =>
  matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());

const emptyBoard = (): Cell[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0 as Cell));

interface Piece {
  shape: Shape;
  row: number;
  col: number;
}

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createBag = (): Shape[] => shuffle(shapes);

const createInitialState = () => {
  const initialBag = createBag();
  const queue = [initialBag[0], initialBag[1]];
  return {
    queue,
    bag: initialBag.slice(2),
    current: spawnPiece(queue[0]),
  };
};

const spawnPiece = (shape: Shape): Piece => ({
  shape,
  row: 0,
  col: Math.floor((cols - shape[0].length) / 2),
});

const hasCollision = (board: Cell[][], piece: Piece): boolean => {
  return piece.shape.some((rowCells, r) =>
    rowCells.some((value, c) => {
      if (!value) return false;
      const nextRow = piece.row + r;
      const nextCol = piece.col + c;
      if (nextRow >= rows || nextCol < 0 || nextCol >= cols) return true;
      return board[nextRow]?.[nextCol] === 1;
    })
  );
};

const mergePiece = (board: Cell[][], piece: Piece): Cell[][] => {
  const next = board.map((row) => row.map((cell) => (cell === 2 ? 0 : cell)) as Cell[]);
  piece.shape.forEach((rowCells, r) => {
    rowCells.forEach((value, c) => {
      if (value) {
        const targetRow = piece.row + r;
        const targetCol = piece.col + c;
        if (targetRow >= 0 && targetRow < rows && targetCol >= 0 && targetCol < cols) {
          next[targetRow][targetCol] = 1;
        }
      }
    });
  });
  return next;
};

const clearLines = (board: Cell[][]): { board: Cell[][]; cleared: number } => {
  const remaining = board.filter((row) => row.some((cell) => cell === 0));
  const cleared = rows - remaining.length;
  const newRows = Array.from({ length: cleared }, () =>
    Array.from({ length: cols }, () => 0 as Cell)
  );
  return { board: [...newRows, ...remaining], cleared };
};

const buildPreviewCells = (shape: Shape): number[] => {
  const size = 4;
  const cells = Array.from({ length: size * size }, () => 0);
  shape.forEach((rowCells, r) => {
    rowCells.forEach((value, c) => {
      if (!value) return;
      const index = r * size + c;
      if (cells[index] !== undefined) cells[index] = 1;
    });
  });
  return cells;
};

export const BlockDropGame: React.FC = () => {
  const initial = useMemo(() => createInitialState(), []);

  const [board, setBoard] = useState<Cell[][]>(emptyBoard());
  const [bag, setBag] = useState<Shape[]>(initial.bag);
  const [nextQueue, setNextQueue] = useState<Shape[]>(initial.queue);
  const [heldShape, setHeldShape] = useState<Shape | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [piece, setPiece] = useState<Piece>(initial.current);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const { isMuted, volume, setMuted, setVolume } = useSoundSettings();
  const soundsRef = useRef<Record<SfxKey, Audio.Sound | null>>({
    move: null,
    rotate: null,
    drop: null,
    hardDrop: null,
    lock: null,
    hold: null,
    clear: null,
    gameOver: null,
  });

  const level = Math.floor(lines / 5) + 1;
  const dropSpeed = Math.max(220, 700 - (level - 1) * 60);

  const playSound = (key: SfxKey) => {
    if (isMuted) return;
    const sound = soundsRef.current[key];
    if (!sound) return;
    sound.setVolumeAsync(volume);
    sound.replayAsync();
  };

  useEffect(() => {
    let mounted = true;
    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        for (const key in sfxUris) {
          const typedKey = key as SfxKey;
          const uri = sfxUris[typedKey];
          const { sound } = await Audio.Sound.createAsync(
            { uri },
            { volume, shouldPlay: false }
          );
          if (mounted) {
            soundsRef.current[typedKey] = sound;
          } else {
            await sound.unloadAsync();
          }
        }
      } catch {
        // Ignore sound loading failures to keep gameplay responsive.
      }
    };
    loadSounds();
    return () => {
      mounted = false;
      for (const key in soundsRef.current) {
        const sound = soundsRef.current[key as SfxKey];
        if (sound) {
          sound.unloadAsync();
        }
      }
    };
  }, []);


  const drawFromBag = (currentBag: Shape[]): { next: Shape; bag: Shape[] } => {
    const safeBag = currentBag.length ? currentBag : createBag();
    return { next: safeBag[0], bag: safeBag.slice(1) };
  };

  const advanceQueue = () => {
    setBag((prevBag) => {
      const { next, bag: updatedBag } = drawFromBag(prevBag);
      setNextQueue((prevQueue) => [...prevQueue.slice(1), next]);
      return updatedBag;
    });
  };

  const lockAndSpawn = (current: Piece): Piece => {
    const merged = mergePiece(board, current);
    const cleared = clearLines(merged);
    setBoard(cleared.board);
    if (cleared.cleared) {
      setLines((value) => value + cleared.cleared);
      setScore((value) => value + cleared.cleared * 120);
      playSound('clear');
    } else {
      setScore((value) => value + 10);
      playSound('lock');
    }
  const [currentNext] = nextQueue;
  const upcoming = spawnPiece(currentNext);
  advanceQueue();
    setCanHold(true);
    if (hasCollision(cleared.board, upcoming)) {
      setIsGameOver(true);
      setIsRunning(false);
      playSound('gameOver');
      return current;
    }
    return upcoming;
  };

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const timer = setInterval(() => {
      setPiece((prev) => {
        const next = { ...prev, row: prev.row + 1 };
        if (hasCollision(board, next)) {
          return lockAndSpawn(prev);
        }
        return next;
      });
    }, dropSpeed);
    return () => clearInterval(timer);
  }, [board, isRunning, isGameOver, nextQueue, dropSpeed]);

  const ghostPiece = useMemo(() => {
    let ghostRow = piece.row;
    while (!hasCollision(board, { ...piece, row: ghostRow + 1 })) {
      ghostRow += 1;
    }
    return { ...piece, row: ghostRow };
  }, [board, piece]);

  const previewCells = useMemo(() => buildPreviewCells(nextQueue[0]), [nextQueue]);
  const previewCellsNext = useMemo(() => buildPreviewCells(nextQueue[1]), [nextQueue]);
  const holdPreview = useMemo(() => (heldShape ? buildPreviewCells(heldShape) : []), [heldShape]);

  const renderGrid = useMemo(() => {
    const snapshot = board.map((row) => [...row]);
    ghostPiece.shape.forEach((rowCells, r) => {
      rowCells.forEach((value, c) => {
        if (!value) return;
        const targetRow = ghostPiece.row + r;
        const targetCol = ghostPiece.col + c;
        if (snapshot[targetRow] && snapshot[targetRow][targetCol] === 0) {
          snapshot[targetRow][targetCol] = 2;
        }
      });
    });
    piece.shape.forEach((rowCells, r) => {
      rowCells.forEach((value, c) => {
        if (!value) return;
        const targetRow = piece.row + r;
        const targetCol = piece.col + c;
        if (snapshot[targetRow] && snapshot[targetRow][targetCol] !== undefined) {
          snapshot[targetRow][targetCol] = 1;
        }
      });
    });
    return snapshot.reduce<Cell[]>((acc, row) => acc.concat(row), []);
  }, [board, piece]);

  const move = (direction: number) => {
    if (isGameOver) return;
    setPiece((prev) => {
      const next = { ...prev, col: prev.col + direction };
      if (hasCollision(board, next)) return prev;
      playSound('move');
      return next;
    });
  };

  const drop = () => {
    if (isGameOver) return;
    setPiece((prev) => {
      const next = { ...prev, row: prev.row + 1 };
      if (hasCollision(board, next)) return prev;
      setScore((value) => value + 1);
      playSound('drop');
      return next;
    });
  };

  const hardDrop = () => {
    if (isGameOver) return;
    setPiece((prev) => {
      let current = { ...prev };
      let steps = 0;
      while (!hasCollision(board, { ...current, row: current.row + 1 })) {
        current = { ...current, row: current.row + 1 };
        steps += 1;
      }
      if (steps > 0) {
        setScore((value) => value + steps * 2);
        playSound('hardDrop');
      }
      return lockAndSpawn(current);
    });
  };

  const rotate = () => {
    if (isGameOver) return;
    setPiece((prev) => {
      const rotated = { ...prev, shape: rotateShape(prev.shape) };
      if (!hasCollision(board, rotated)) return rotated;
      const kicks = [-1, 1, -2, 2];
      for (const offset of kicks) {
        const kicked = { ...rotated, col: rotated.col + offset };
        if (!hasCollision(board, kicked)) {
          playSound('rotate');
          return kicked;
        }
      }
      return prev;
    });
  };

  const hold = () => {
    if (!canHold || isGameOver) return;
    setPiece((prev) => {
      setCanHold(false);
      if (!heldShape) {
        setHeldShape(prev.shape);
        const [currentNext] = nextQueue;
        advanceQueue();
        playSound('hold');
        return spawnPiece(currentNext);
      }
      const swapped = spawnPiece(heldShape);
      if (hasCollision(board, swapped)) {
        setHeldShape(prev.shape);
        return prev;
      }
      setHeldShape(prev.shape);
      playSound('hold');
      return swapped;
    });
  };

  const reset = () => {
    setBoard(emptyBoard());
    const fresh = createInitialState();
    setBag(fresh.bag);
    setNextQueue(fresh.queue);
    setHeldShape(null);
    setCanHold(true);
    setPiece(fresh.current);
    setScore(0);
    setLines(0);
    setIsGameOver(false);
    setIsRunning(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Block Drop</Text>
        <Pressable style={styles.resetButton} onPress={reset}>
          <Text style={styles.resetText}>Restart</Text>
        </Pressable>
      </View>
      <View style={styles.audioRow}>
        <Pressable
          style={[styles.audioButton, isMuted && styles.audioButtonMuted]}
          onPress={() => setMuted(!isMuted)}
        >
          <Text style={styles.audioText}>{isMuted ? 'Muted' : 'Sound On'}</Text>
        </Pressable>
        <View style={styles.volumeRow}>
          {([
            { label: 'Low', value: 0.2 },
            { label: 'Med', value: 0.35 },
            { label: 'High', value: 0.55 },
          ] as const).map((option) => (
            <Pressable
              key={option.label}
              style={[
                styles.audioButton,
                volume === option.value && styles.audioButtonActive,
              ]}
              onPress={() => {
                setVolume(option.value);
                setMuted(false);
              }}
            >
              <Text style={styles.audioText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.hud}>
        <View>
          <Text style={styles.status}>Score: {score}</Text>
          <Text style={styles.status}>Lines: {lines}</Text>
          <Text style={styles.status}>Level: {level}</Text>
        </View>
        <View style={[styles.previewColumn, !canHold && styles.previewColumnDisabled]}>
          <Text style={styles.previewLabel}>Hold</Text>
          <View style={styles.preview}>
            {holdPreview.length
              ? holdPreview.map((cell, index) => (
                  <View
                    key={`hold-${index}`}
                    style={[styles.previewCell, cell === 1 && styles.previewCellActive]}
                  />
                ))
              : Array.from({ length: 16 }, (_, index) => (
                  <View key={`hold-empty-${index}`} style={styles.previewCell} />
                ))}
          </View>
        </View>
        <View style={styles.previewColumn}>
          <Text style={styles.previewLabel}>Next</Text>
          <View style={styles.preview}>
            {previewCells.map((cell, index) => (
              <View
                key={`preview-${index}`}
                style={[styles.previewCell, cell === 1 && styles.previewCellActive]}
              />
            ))}
          </View>
        </View>
        <View style={styles.previewColumn}>
          <Text style={styles.previewLabel}>Next+</Text>
          <View style={styles.preview}>
            {previewCellsNext.map((cell, index) => (
              <View
                key={`preview-next-${index}`}
                style={[styles.previewCell, cell === 1 && styles.previewCellActive]}
              />
            ))}
          </View>
        </View>
      </View>
      {isGameOver && <Text style={styles.gameOver}>Game over</Text>}
      <View style={styles.grid}>
        {renderGrid.map((cell: Cell, index: number) => (
          <View
            key={`cell-${index}`}
            style={[
              styles.cell,
              cell === 1 && styles.cellActive,
              cell === 2 && styles.cellGhost,
            ]}
          />
        ))}
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={() => move(-1)}>
          <Text style={styles.controlText}>◀</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={rotate}>
          <Text style={styles.controlText}>⟳</Text>
        </Pressable>
        <Pressable
          style={[styles.controlButton, !canHold && styles.controlButtonDisabled]}
          onPress={hold}
          disabled={!canHold}
        >
          <Text style={[styles.controlText, !canHold && styles.controlTextDisabled]}>Hold</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={drop}>
          <Text style={styles.controlText}>▼</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={hardDrop}>
          <Text style={styles.controlText}>⤓</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={() => move(1)}>
          <Text style={styles.controlText}>▶</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={() => setIsRunning((prev) => !prev)}>
          <Text style={styles.controlText}>{isRunning ? 'Pause' : 'Play'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  status: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  audioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  volumeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  audioButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surfaceAlt,
  },
  audioButtonActive: {
    borderColor: colors.accent,
  },
  audioButtonMuted: {
    opacity: 0.6,
  },
  audioText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  previewColumn: {
    alignItems: 'center',
    gap: 4,
  },
  previewColumnDisabled: {
    opacity: 0.5,
  },
  previewLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  preview: {
    width: 64,
    height: 64,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    padding: 6,
  },
  previewCell: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  previewCellActive: {
    backgroundColor: colors.accentSoft,
  },
  gameOver: {
    color: colors.warning,
    fontSize: 12,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 4,
  },
  cell: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  cellActive: {
    backgroundColor: colors.accent,
  },
  cellGhost: {
    backgroundColor: 'rgba(123, 97, 255, 0.08)',
    borderColor: colors.accentSoft,
    borderStyle: 'dashed',
  },
  cellLocked: {
    backgroundColor: colors.accentSoft,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  controlButton: {
    flexBasis: '30%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    alignItems: 'center',
  },
  controlButtonDisabled: {
    borderColor: colors.surfaceAlt,
  },
  controlText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  controlTextDisabled: {
    color: colors.textSecondary,
  },
});
