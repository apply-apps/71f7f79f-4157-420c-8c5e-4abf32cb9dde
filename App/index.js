// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';

// Game.js
export const Game = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;

  const getInitialSnake = () => [
    { x: 8 * CELL_SIZE, y: 5 * CELL_SIZE },
    { x: 7 * CELL_SIZE, y: 5 * CELL_SIZE },
  ];

  const getRandomFood = () => ({
    x: Math.floor(Math.random() * GRID_SIZE) * CELL_SIZE,
    y: Math.floor(Math.random() * GRID_SIZE) * CELL_SIZE,
  });

  const [snake, setSnake] = useState(getInitialSnake());
  const [food, setFood] = useState(getRandomFood());
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef();

  const moveSnake = () => {
    const snakeHead = snake[0];
    let newHead;

    if (direction === 'RIGHT') newHead = { x: snakeHead.x + CELL_SIZE, y: snakeHead.y };
    else if (direction === 'DOWN') newHead = { x: snakeHead.x, y: snakeHead.y + CELL_SIZE };
    else if (direction === 'LEFT') newHead = { x: snakeHead.x - CELL_SIZE, y: snakeHead.y };
    else if (direction === 'UP') newHead = { x: snakeHead.x, y: snakeHead.y - CELL_SIZE };

    const newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(getRandomFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    checkGameOver(newSnake);
  };

  const checkGameOver = (snake) => {
    const snakeHead = snake[0];
    for (let i = 4; i < snake.length; i++) {
      if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
        setGameOver(true);
        clearInterval(intervalRef.current);
        return;
      }
    }

    if (snakeHead.x < 0 || snakeHead.x >= GRID_SIZE * CELL_SIZE || snakeHead.y < 0 || snakeHead.y >= GRID_SIZE * CELL_SIZE) {
      setGameOver(true);
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (gameOver) return;
    intervalRef.current = setInterval(moveSnake, 200);
    return () => clearInterval(intervalRef.current);
  }, [snake, direction, gameOver]);

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
    else if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
    else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
  };

  return (
    <View style={styles.container} tabIndex="0" onKeyDown={handleKeyPress}>
      {snake.map((segment, index) => (
        <View key={index} style={{ ...styles.snake, top: segment.y, left: segment.x }} />
      ))}
      <View style={{ ...styles.food, top: food.y, left: food.x }} />
      {gameOver && <Text style={styles.gameOver}>GAME OVER</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    position: 'relative',
    borderWidth: 1,
  },
  snake: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'green',
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'red',
  },
  gameOver: {
    position: 'absolute',
    top: 50,
    left: 50,
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
});

// App.js
export default function App() {
  const [running, setRunning] = useState(false);

  const handleStart = () => {
    setRunning(true);
  };

  const handleRestart = () => {
    setRunning(false);
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>Snake Game</Text>
      {running ? (
        <Game />
      ) : (
        <Button title="Start Game" onPress={handleStart} />
      )}
      {running && <Button title="Restart" onPress={handleRestart} />}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});