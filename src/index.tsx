import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

const width = Dimensions.get("window");

const NUMBER_OF_ROWS = 22;
enum DIRECTIONS {
  up = "UP",
  down = "DOWN",
  left = "LEFT",
  right = "RIGHT",
}

type coordinatesType = [number, number];

const getNextSnakePosition: (
  currentPosition: coordinatesType,
  direction: DIRECTIONS
) => coordinatesType = ([x, y], direction) => {
  switch (direction) {
    case DIRECTIONS.right: {
      if (x === NUMBER_OF_ROWS - 1) {
        return [0, y];
      }
      return [x + 1, y];
    }

    case DIRECTIONS.left: {
      if (x === 0) {
        return [NUMBER_OF_ROWS - 1, y];
      }
      return [x - 1, y];
    }

    case DIRECTIONS.up: {
      if (y === 0) {
        return [x, NUMBER_OF_ROWS - 1];
      }
      return [x, y - 1];
    }

    default: {
      if (y === NUMBER_OF_ROWS - 1) {
        return [x, 0];
      }
      return [x, y + 1];
    }
  }
};

const App = ({ snakeColor = "orange", foodColor = "yellow" }) => {
  const [snakePosition, setSnakePosition] = useState<coordinatesType>([2, 2]);
  const [snakeLength, setSnakeLength] = useState<number>(1);
  const [direction, setDirection] = useState<DIRECTIONS>(DIRECTIONS.right);
  const [speed, setSpeed] = useState<number>(1);
  const [foodPosition, setFoodPosition] = useState<coordinatesType>([10, 2]);
  const [directionChangeCoordinates, setDirectionChangeCoordinates] = useState<coordinatesType>([2, 2]);

  useEffect(() => {
    const intervalDuration = 400 / speed;

    const interval = setInterval(() => {
      updateSnakePosition(snakePosition, direction);
    }, intervalDuration);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    updateSnakePosition(snakePosition, direction);
  }, [direction]);

  useEffect(() => {
    if (areSamePositions(snakePosition, foodPosition)) {
      setFoodPosition([
        Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
        Math.floor(Math.random() * (NUMBER_OF_ROWS - 1)),
      ]);
      setSnakeLength(snakeLength + 1);
    }
  }, [snakePosition, foodPosition]);

  const areSamePositions: (
    a: coordinatesType,
    b: coordinatesType
  ) => boolean = (a, b) => {
    return a[0] === b[0] && a[1] === b[1];
  };

  const updateSnakePosition: (
    snakePosition: coordinatesType,
    direction: DIRECTIONS
  ) => void = (snakePosition, direction) => {
    const nextSnakePosition = getNextSnakePosition(snakePosition, direction);
    setSnakePosition(nextSnakePosition);
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

    if (
      nextDirection !== direction &&
      !blackListedNextDirection[nextDirection].includes(direction)
    ) {
      setDirection(nextDirection);
    }
  };

  const oneDArray = new Array(NUMBER_OF_ROWS).fill(null);

  const isSnakeOnCoordinates = (x: number, y: number) =>
    snakePosition[0] === x && snakePosition[1] === y;

  const isFoodOnCoordinates = (x: number, y: number) =>
    foodPosition[0] === x && foodPosition[1] === y;

  return (
    <View style={styles.container}>
      <View style={{ height: 40 }} />

      <View style={styles.boardContainer}>
        {oneDArray.map((_, rowIndex) => {
          return (
            <View key={`row-${rowIndex}`} style={{ flex: 1 }}>
              {oneDArray.map((_, columnIndex) => {
                return (
                  <View
                    key={`column-${columnIndex}`}
                    style={[
                      { flex: 1, borderWidth: 1, borderColor: "#e2e2e2" },
                      isSnakeOnCoordinates(rowIndex, columnIndex)
                        ? { backgroundColor: snakeColor }
                        : {},
                      isFoodOnCoordinates(rowIndex, columnIndex)
                        ? { backgroundColor: foodColor }
                        : {},
                    ]}
                  ></View>
                );
              })}
            </View>
          );
        })}
      </View>

      <View style={styles.controlsContainer}>
        <ControlButton
          text={"UP"}
          style={styles.controlButton}
          onPress={() => {
            handleDirectionChange(DIRECTIONS.up);
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <ControlButton
            text={"LEFT"}
            style={styles.controlButton}
            onPress={() => {
              handleDirectionChange(DIRECTIONS.left);
            }}
          />
          <ControlButton
            text={"RIGHT"}
            style={styles.controlButton}
            onPress={() => {
              handleDirectionChange(DIRECTIONS.right);
            }}
          />
        </View>
        <ControlButton
          text={"DOWN"}
          style={styles.controlButton}
          onPress={() => {
            handleDirectionChange(DIRECTIONS.down);
          }}
        />
      </View>
    </View>
  );
};

interface ControlButtonProps extends TouchableOpacityProps {
  text: string;
}

const ControlButton: React.FunctionComponent<ControlButtonProps> = ({
  text,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boardContainer: {
    borderWidth: 1,
    flexDirection: "row",
    borderColor: "#e2e2e2",
    height: width.width,
  },
  controlsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButton: {
    height: 80,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
