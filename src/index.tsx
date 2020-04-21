import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

const width = Dimensions.get("window");

const NUMBER_OF_ROWS = 20;
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

const App = ({ snakeColor = "orange" }) => {
  const [snakePosition, setSnakePosition] = useState<[number, number]>([2, 2]);
  const [direction, setDirection] = useState<DIRECTIONS>(DIRECTIONS.right);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    const intervalDuration = 200 / (speed / 2);

    const interval = setInterval(() => {
      const nextSnakePosition = getNextSnakePosition(snakePosition, direction);
      setSnakePosition(nextSnakePosition);
    }, intervalDuration);

    return () => {
      clearInterval(interval);
    };
  });

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
  const colorCell = (x: number, y: number) =>
    snakePosition[0] === x && snakePosition[1] === y;

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
                      colorCell(rowIndex, columnIndex)
                        ? { backgroundColor: snakeColor }
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
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
