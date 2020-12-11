const getNeighbors = (matrix, { x, y }) => {
  return [
    matrix[y][x - 1],
    matrix[y][x + 1],
    matrix[y - 1] && matrix[y - 1][x],
    matrix[y + 1] && matrix[y + 1][x],
    matrix[y + 1] && matrix[y + 1][x + 1],
    matrix[y + 1] && matrix[y + 1][x - 1],
    matrix[y - 1] && matrix[y - 1][x - 1],
    matrix[y - 1] && matrix[y - 1][x + 1],
  ].filter((x) => x);
};

export const top = ({ x, y }) => ({ x, y: y - 1 });
export const topLeft = ({ x, y }) => ({ x: x - 1, y: y - 1 });
export const topRight = ({ x, y }) => ({ x: x + 1, y: y - 1 });
export const bottom = ({ x, y }) => ({ x, y: y + 1 });
export const bottomLeft = ({ x, y }) => ({ x: x - 1, y: y + 1 });
export const bottomRight = ({ x, y }) => ({ x: x + 1, y: y + 1 });
export const left = ({ x, y }) => ({ x: x - 1, y });
export const right = ({ x, y }) => ({ x: x + 1, y });

export const allDirections = [
  top,
  topLeft,
  topRight,
  right,
  left,
  bottom,
  bottomLeft,
  bottomRight,
];

export const Matrix = (matrix) => {
  return {
    forEach(fn) {
      matrix.forEach((_, row) => {
        _.forEach((e, col) => {
          fn(e, { y: row, x: col }, matrix);
        });
      });
    },
    map(fn) {
      const newMat = [];
      this.forEach((cell, { x, y }, matrix) => {
        if (!newMat[y]) {
          newMat[y] = [];
        }
        newMat[y].push(fn(cell, { x, y }, matrix));
      });

      return newMat;
    },
    print() {
      matrix.forEach((_, row) => {
        let c = '';
        _.forEach((cell, col) => {
          c += cell;
        });
        console.log(c);
      });
    },
    eq(matrix2) {
      return matrix.every((_, row) =>
        _.every((cell, col) => matrix2[row][col] === cell)
      );
    },
    reduce(fn, initialValue) {
      const hasInitialValue = typeof initialValue !== 'undefined';
      let acc = hasInitialValue ? initialValue : matrix[0][0];
      this.forEach((value, { x, y }) => {
        if (!hasInitialValue && x === 0 && y === 0) return;
        acc = fn(acc, value, { x, y }, matrix);
      });
      return acc;
    },
    matrix,
  };
};

const play = (matrix, nsFn) => {
  return Matrix(matrix).map((seat, { y, x }) => {
    if (seat === '.') return '.';

    const ns = nsFn(matrix, { x, y });

    const onlyEmptySeats = ns.every((cell) => cell === 'L' || cell === '.');

    const occSeats = ns.filter((cell) => cell === '#').length;

    if (onlyEmptySeats) return '#';

    if (occSeats >= 4) return 'L';

    return seat;
  });
};

export const pt1 = (matrix, onPlay) => {
  let currentMatrix = matrix;
  while (true) {
    let mat = play(currentMatrix, getNeighbors);
    onPlay(mat);
    if (Matrix(mat).eq(currentMatrix)) {
      break;
    }
    currentMatrix = mat;
  }
  onPlay(null, true);

  return Matrix(currentMatrix).reduce(
    (acc, cell) => acc + (cell == '#' ? 1 : 0),
    0
  );
};

// day 2
const makePoint = (x, y) => ({ x, y });
const getNeighborsPt2 = (matrix, point) => {
  return allDirections
    .map((direction) => {
      let currentPosition = makePoint(point.x, point.y);
      currentPosition = direction(currentPosition);
      let value =
        matrix[currentPosition.y] &&
        matrix[currentPosition.y][currentPosition.x];
      while (value && value === '.') {
        currentPosition = direction(currentPosition);
        value =
          matrix[currentPosition.y] &&
          matrix[currentPosition.y][currentPosition.x];
      }
      return value;
    })
    .filter(Boolean);
};

const play2 = (matrix, nsFn) => {
  return Matrix(matrix).map((seat, { y, x }) => {
    if (seat === '.') return '.';

    const ns = nsFn(matrix, { x, y });

    const onlyEmptySeats = ns.every((cell) => cell === 'L' || cell === '.');

    const occSeats = ns.filter((cell) => cell === '#').length;

    if (onlyEmptySeats) return '#';

    if (occSeats >= 5) return 'L';

    return seat;
  });
};

export const pt2 = (matrix, onPlay) => {
  let currentMatrix = matrix;
  while (true) {
    let mat = play2(currentMatrix, getNeighborsPt2);
    onPlay(mat);
    if (Matrix(mat).eq(currentMatrix)) {
      break;
    }
    currentMatrix = mat;
  }
  onPlay(null, true);

  return Matrix(currentMatrix).reduce(
    (acc, cell) => acc + (cell == '#' ? 1 : 0),
    0
  );
};
