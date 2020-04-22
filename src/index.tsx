import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, StyleSheet, StatusBar } from "react-native";

import { coordinatesType, DIRECTIONS } from "./types";

import { NUMBER_OF_ROWS, INITIAL_FOOD_POSITION, INITIAL_SNAKE_POSITION } from "./config";
import ControlPad from "./Components/ControlPad";
import GameBoard from "./Components/GameBoard";
import Colors from "./colors";

const window = Dimensions.get("window");


const getNextSnakePosition: (
  currentPosition: coordinatesType,
  direction: DIRECTIONS
) => coordinatesType = ({ x, y }, direction) => {
  switch (direction) {
    case DIRECTIONS.right: {
      return { x: x === NUMBER_OF_ROWS - 1 ? 0 : x + 1, y };
    }
    case DIRECTIONS.left:
      return { x: x === 0 ? NUMBER_OF_ROWS - 1 : x - 1, y };
    case DIRECTIONS.up:
      return { x, y: y === 0 ? NUMBER_OF_ROWS - 1 : y - 1 };
    default:
      return { x, y: y === NUMBER_OF_ROWS - 1 ? 0 : y + 1 };
  }
};

const App = () => {
  const [snakePosition, setSnakePosition] = useState<coordinatesType>(INITIAL_SNAKE_POSITION);
  const [snakeTrail, setSnakeTrail] = useState<coordinatesType[]>([]);
  const [snakeLength, setSnakeLength] = useState<number>(1);
  const [direction, setDirection] = useState<DIRECTIONS>(DIRECTIONS.right);
  const [foodPosition, setFoodPosition] = useState<coordinatesType>(INITIAL_FOOD_POSITION);
  // const [speed, setSpeed] = useState<number>(15);

  let interval: number | undefined = useRef().current;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  useEffect(() => {
    const intervalDuration = 100;

    // clear interval and change get new position as soon as direction changes
    clearInterval(interval);
    setSnakePosition((snakePosition) =>
      getNextSnakePosition(snakePosition, direction)
    );

    interval = setInterval(() => {
      setSnakePosition((snakePosition) => {
        return getNextSnakePosition(snakePosition, direction);
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    const updatedSnakeTrail = [...snakeTrail];
    while (updatedSnakeTrail.length > snakeLength - 1) {
      updatedSnakeTrail.shift();
    }
    setSnakeTrail([...updatedSnakeTrail, snakePosition]);
  }, [snakeLength, snakePosition]);

  useEffect(() => {
    if (areSamePositions(snakePosition, foodPosition)) {
      setFoodPosition({
        x: Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
        y: Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
      });
      setSnakeLength((snakeLength) => snakeLength + 1);
    }
  }, [snakePosition, foodPosition]);

  const areSamePositions: (
    a: coordinatesType,
    b: coordinatesType
  ) => boolean = (a, b) => {
    return a.x === b.x && a.y === b.y;
  };

  const handleDirectionChange: (nextDirection: DIRECTIONS) => void = (
    nextDirection
  ) => {
    const blackListedNextDirection = {
      [DIRECTIONS.left]: [DIRECTIONS.right],
      [DIRECTIONS.right]: [DIRECTIONS.left],
      [DIRECTIONS.up]: [DIRECTIONS.down],
      [DIRECTIONS.down]: [DIRECTIONS.up],
    };

    setDirection((direction) => {
      if (
        nextDirection !== direction &&
        !blackListedNextDirection[nextDirection].includes(direction)
      ) {
        return nextDirection;
      }
      return direction;
    });
  };


  return (
    <View style={styles.container}>
      <View style={{ height: 40 }} />

      <GameBoard
        containerStyle={styles.boardContainer}
        snakePosition={snakePosition}
        snakeTrail={snakeTrail}
        foodPosition={foodPosition}
        snakeColor={Colors.snake}
        foodColor={Colors.food}
        numberOfRows={NUMBER_OF_ROWS}
      />

      <ControlPad
        handlePress={handleDirectionChange}
        containerStyle={styles.controlsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.board,
  },
  boardContainer: {
    flexDirection: "row",
    height: window.width,
  },
  controlsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: Colors.controlPad,
  },
});

export default App;
