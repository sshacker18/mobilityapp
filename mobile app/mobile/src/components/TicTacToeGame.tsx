import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const initialBoard = Array(9).fill('') as Array<'X' | 'O' | ''>;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState(initialBoard);
  const [current, setCurrent] = useState<'X' | 'O'>('X');

  const winner = useMemo(() => {
    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, [board]);

  const isDraw = useMemo(() => board.every((cell) => cell), [board]);

  const handlePress = (index: number) => {
    if (board[index] || winner) return;
    const next = [...board];
    next[index] = current;
    setBoard(next);
    setCurrent((prev) => (prev === 'X' ? 'O' : 'X'));
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setCurrent('X');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Tic Tac Toe</Text>
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>
      <Text style={styles.status}>
        {winner ? `Winner: ${winner}` : isDraw ? 'Draw game' : `Turn: ${current}`}
      </Text>
      <View style={styles.grid}>
        {board.map((cell, index) => (
          <Pressable
            key={`${index}-${cell}`}
            style={styles.cell}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </Pressable>
        ))}
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
    marginBottom: 8,
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
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  cellText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
  },
});
