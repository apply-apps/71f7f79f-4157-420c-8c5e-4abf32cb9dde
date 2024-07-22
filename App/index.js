// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

const CELL_SIZE = 20;
const GRID_SIZE = 20;

const getRandomFoodPosition = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
};

const Game = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(getRandomFoodPosition());
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [isGameOver, setIsGameOver] = useState(false);

    const interval = useRef(null);

    const moveSnake = () => {
        setSnake(prevSnake => {
            const newSnake = [...prevSnake];
            const head = { ...newSnake[0] };

            head.x += direction.x;
            head.y += direction.y;

            if (head.x >= GRID_SIZE || head.y >= GRID_SIZE || head.x < 0 || head.y < 0) {
                setIsGameOver(true);
            } else {
                newSnake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    setFood(getRandomFoodPosition());
                } else {
                    newSnake.pop();
                }
            }
            return newSnake;
        });
    };

    const handleDirectionChange = (x, y) => {
        setDirection({ x, y });
    };

    useEffect(() => {
        if (!isGameOver) {
            interval.current = setInterval(moveSnake, 200);
            return () => clearInterval(interval.current);
        }
    }, [direction, isGameOver]);

    const handleReset = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomFoodPosition());
        setDirection({ x: 1, y: 0 });
        setIsGameOver(false);
    };

    return (
        <View style={styles.gameContainer}>
            <View style={styles.grid}>
                {snake.map((segment, index) => (
                    <View
                        key={index}
                        style={[styles.snakeSegment, { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }]}
                    />
                ))}
                <View
                    style={[
                        styles.food,
                        { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE },
                    ]}
                />
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => handleDirectionChange(0, -1)} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>Up</Text>
                </TouchableOpacity>
                <View style={styles.horizontalControls}>
                    <TouchableOpacity onPress={() => handleDirectionChange(-1, 0)} style={styles.controlButton}>
                        <Text style={styles.controlButtonText}>Left</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDirectionChange(1, 0)} style={styles.controlButton}>
                        <Text style={styles.controlButtonText}>Right</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleDirectionChange(0, 1)} style={styles.controlButton}>
                    <Text style={styles.controlButtonText}>Down</Text>
                </TouchableOpacity>
            </View>
            {isGameOver && (
                <View style={styles.gameOver}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Button title="Restart" onPress={handleReset} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    gameContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        position: 'relative',
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        borderWidth: 1,
        borderColor: '#000',
    },
    snakeSegment: {
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
    controls: {
        marginTop: 20,
        alignItems: 'center',
    },
    controlButton: {
        margin: 10,
        padding: 10,
        backgroundColor: '#DDD',
        borderWidth: 1,
        borderColor: '#000',
    },
    controlButtonText: {
        fontSize: 18,
    },
    horizontalControls: {
        flexDirection: 'row',
    },
    gameOver: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 20,
        borderColor: '#000',
        borderWidth: 1,
    },
    gameOverText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <Game />
        </SafeAreaView>
    );
}