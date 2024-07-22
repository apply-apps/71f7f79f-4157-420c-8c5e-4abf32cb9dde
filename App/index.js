// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, ScrollView, Alert } from 'react-native';

const CELL_SIZE = 20;
const CELL_COUNT = 15;
const SNAKE_COLOR = 'green';
const FOOD_COLOR = 'red';
const INITIAL_SNAKE = [{ x: 2, y: 2 }];
const INITIAL_FOOD = { x: 10, y: 10 };

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * CELL_COUNT),
    y: Math.floor(Math.random() * CELL_COUNT),
});

const Game = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState('RIGHT');
    const [intervalId, setIntervalId] = useState(null);

    const moveSnake = () => {
        setSnake((prevSnake) => {
            const head = prevSnake[prevSnake.length - 1];
            let newHead;
            if (direction === 'RIGHT') newHead = { x: head.x + 1, y: head.y };
            if (direction === 'LEFT') newHead = { x: head.x - 1, y: head.y };
            if (direction === 'UP') newHead = { x: head.x, y: head.y - 1 };
            if (direction === 'DOWN') newHead = { x: head.x, y: head.y + 1 };

            const newSnake = [...prevSnake, newHead];
            if (newHead.x === food.x && newHead.y === food.y) {
                setFood(getRandomPosition());
            } else {
                newSnake.shift();
            }

            return newSnake;
        });
    };

    const handleGameOver = () => {
        Alert.alert("Game Over!", "You've hit the wall or yourself.");
        setDirection('RIGHT');
        setSnake(INITIAL_SNAKE);
        setFood(INITIAL_FOOD);
    };

    useEffect(() => {
        if (intervalId) clearInterval(intervalId);
        const id = setInterval(moveSnake, 200);
        setIntervalId(id);
        return () => clearInterval(id);
    }, [direction]);

    useEffect(() => {
        const head = snake[snake.length - 1];
        const isOutOfBounds = head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT;
        const isCollidingWithSelf = snake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y);

        if (isOutOfBounds || isCollidingWithSelf) {
            handleGameOver();
        }
    }, [snake]);

    return (
        <View style={styles.gameContainer}>
            <View style={styles.board}>
                {Array.from({ length: CELL_COUNT }).map((_, row) => (
                    <View key={row} style={styles.row}>
                        {Array.from({ length: CELL_COUNT }).map((_, col) => (
                            <View
                                key={col}
                                style={[
                                    styles.cell,
                                    snake.some(segment => segment.x === col && segment.y === row) && { backgroundColor: SNAKE_COLOR },
                                    food.x === col && food.y === row && { backgroundColor: FOOD_COLOR },
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.controls}>
                <Button title="Up" onPress={() => setDirection('UP')} />
                <View style={styles.horizontalControls}>
                    <Button title="Left" onPress={() => setDirection('LEFT')} />
                    <Button title="Right" onPress={() => setDirection('RIGHT')} />
                </View>
                <Button title="Down" onPress={() => setDirection('DOWN')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    gameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    board: {
        width: CELL_SIZE * CELL_COUNT,
        height: CELL_SIZE * CELL_COUNT,
        backgroundColor: '#000',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: '#fff',
    },
    controls: {
        marginTop: 20,
        alignItems: 'center',
    },
    horizontalControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginVertical: 10,
    }
});

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Snake Game</Text>
                <Game />
            </ScrollView>
        </SafeAreaView>
    );
}