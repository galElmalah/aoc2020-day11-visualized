(function () {
  'use strict';

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

  const top = ({ x, y }) => ({ x, y: y - 1 });
  const topLeft = ({ x, y }) => ({ x: x - 1, y: y - 1 });
  const topRight = ({ x, y }) => ({ x: x + 1, y: y - 1 });
  const bottom = ({ x, y }) => ({ x, y: y + 1 });
  const bottomLeft = ({ x, y }) => ({ x: x - 1, y: y + 1 });
  const bottomRight = ({ x, y }) => ({ x: x + 1, y: y + 1 });
  const left = ({ x, y }) => ({ x: x - 1, y });
  const right = ({ x, y }) => ({ x: x + 1, y });

  const allDirections = [
    top,
    topLeft,
    topRight,
    right,
    left,
    bottom,
    bottomLeft,
    bottomRight,
  ];

  const Matrix = (matrix) => {
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

  const pt1 = (matrix, onPlay) => {
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

  const pt2 = (matrix, onPlay) => {
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

  const input = `L.LLLLLLLLLL.LLLLLLLLL.LLLLLLLLL.LLL.LL.LLLLLLLLL.LLLLLL.LLLL.LL..LLLL.LLLL.LLL.LL.LLLLLLL
.LLLL.L.LLLLLLL.LLLLLLLLLLLLLLL..LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLL.LLLLLLLLLL.LLLLLLLLLLLLLL
LLLLLLLL.LLL.LLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLL.LLL.LLLL.LLLLLLLLLLLLLL
LLLLL..LL.LL.LLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL
LLLLL.L.LLLLLLLL.LLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLL.LLLLL.LLLLLLLLLLLLLLLLLLL
LLLLL..L..L.L........L....L.L..LLL...L....L.....L...L..L.....LLL.L..L..LLL...L.LLL...L..L.
LLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLL.LLLLLL.LL.LLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLLLLLLLLLL
LLLLL.LLLLLL.LLLLLLLLLLLLLLLLLL..LLLLLL.L.LLL.LLLLLLLLLLLLLLLLLL..LLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LLL.LLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLL.LL.LLLLLLLLLLLLLL
LLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL..LLLLLL.LLLLLLLLLL.LLLLL.LLLLLLLLLLLLL.LLLL.LLLLLL.L.LLLLL
LLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLL..LL.LL.LLLLLLLLLLLLL.LLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LLLLL..LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL..LLLLLL.LLLLL.LLLL.LLLLLLLLLLLLLL
LLL.LLLLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLL.LL.LLLLLL.LL.LLLLLLLLLLLLLLL.LLLLLL.LLLLLLL
.L.LL..LL.LLL...L....L..L....LLL...LL.L.L......L.....................LLLL.....L..LLL.L..L.
LLLLLL.LLLLL.LLLLL.LLL.LLLLLLLLL.LLLLLL.LLLLLL.LL.LLL.LL.LLLL.LLLLLLLL.LLLLLLLLLLL.LLLLLLL
LLLLLLLLLLLL..L.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLL
LLLLLLLLLLLL.LLL.LLLLL.LLLLLLLLL.L.LLL..LLLLLLLLL.LLL.LL.LLLLLLL.LLLL..LLLL..LLLLLLLLLL.LL
LLLLL.LLLLLL.LL.LLL.LL.LLLLLL.LL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLL..LLLLL.LLLL.LLLLLLLLLLLLLL
..L...LLL..L.......L..LL.LLL........L..L..LLL..L.L.LLL..LL....LL.L.L...LLL...LLL..LL.L...L
LLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.L.LLLLLLLLLLL.LLLL.LLLLLLLLLLLLLL
LLLLLLLLLLL..LLLL.LLLLLLLLLLLLLL.LLLLLLLLL.LLLLL..LLLLLL.LLLLLLL.LLLLL.LLLL.L.LLLLLLLLLLLL
LLLLL.LLL.LLLLLLLLLLLL.LLLLLL.L..LLLLL..LLLLLLLLL.LLLLLL.LLLLLLL.LLLLL.LLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLL.LLLLLLLLLLLLLL.LLLLLL.LLL.LLL.LLLLL.LLLL.LLL.LL.LL.LLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.L.LLLL.LLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLL.LLLL.LLLLLLL.LLLLL.LLLLLLLLLLLLLL.LLLL
LLLLL.LLLLLL.LLLLLLLL..LLL.LLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLL.LLLLL.LLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLL..LLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLL.LLLLLL.LLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLL
..L..L......L.L...L.....L....L..L.L..L.LL.LLLLL....LL...L.L.LL....L..L..L..............LL.
LLLLLLLLLLL..LLLLLLLLL.LL.LLLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLL.
LLLLLL.LLLLL.LLLLLLLLLLLLL.LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLL.LLLL.LL
LLLLL.LLLLLLLLLLLLLLL..LLLLLLL.L.LLLLLL.LLLLLLLLLLLLLLLLLL.LLLLLL.LLLL..LLL.LLL.LL.LLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LL.LLL.LLLLLLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.L.LLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLL
L.......L...........L..L.....L.L.L.....L...L.....LL...........L..L.....L.....LL......L....
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLL.LLLLLLLLLLLL.LL.L.L.LLLLLLLLLL.L.LLLL.LLL.LLLLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLL.LLLLLLL
LLLL..LLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL.LLLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLLLLLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLLLLLLL.LLLLLLL.LLLLLLLLLL.LLLLLL.LLLLLLL
.L..L...L.......L....L.....L...........LLLLLL.L...L..L.L....L.LLL...LL......LL.L..L.LL..L.
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLL.LLL.LLLLLLLLLLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LLLL.L.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LL.LLLLLL..LLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLL
LLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.L.LLL.LLLLLLL.LLLLL
LLLL.LL.LLLL.LLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLL.LL.LLLLLLL.LLLLLLLLLL.LLLLLLL.LLLLLL
LLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLL.LLL..L.LLLLLL.LLLLLLL
LLLLLLLLLLLLLLLLLLLL.L.LLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLL..LLLLLLLLLLLLL.LLLL.LLLLLL.LLLLLLL
L.LLL.LLLLLL.LLLLLLLLL.L.LLLLLLL..LLLLL..LLLLLLLLLLLLLLL.LLLL.LL.LLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.L.LLLL.LLLLLLLLLLLL.LLLLLL.LLLLLL.LLLLLLLLL..LLLLLLLLLLLLL.LLLLL.LL.L.LLLLLL.LL.LLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLL.LL.LLLL
L..L.L.LL.LLL..LLL.L.L.......L...L.LL...L..L.L......L....L.....L..L....L....LL.L..........
LLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLL.LLLLLLLLLL.LLLLLL.LLLLLLL
LLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLL.LLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLL.L.LLLLLLL
LLLLLLLLLLLL.LL.LLLLLL.LLLLL.LLL.LLLLLLLLLL.LLLLLLLLLLLL.LLLL.LL.LLLLL.LLLL.LLLLLL.LLL.LLL
LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLL.LLL.LLLLLLLLLLLLLLL..LLLL.LLLLLLLLLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLL.LLLL.LLLLLL..LLLLLL
LLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.L.LLLL.LLLLLL..LLLLL.LLLL.LLLLLLLLL.LLLL
.......L....L....L.L....L.LLLL......L.L............L....L..L..L..L.LLL..L.LLLL.LL..L....L.
LLLLL.LLLLLL.L.LLLLLLL.LLLLLLLLL.LLLLLL..LLLLLLLL.LLLLLL.LL.L.LLLLLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LLLLLL..LLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLLLL.LLL..LLLLLLLLLLLLLL
LLLLL.LLL.LL.LLLLLLLL.LLLLLLLLLL.LLL.LLLLLLLLLLLL.LLLLLLLLLLLLLL..LLLLLLLLLLLLLLLLLLLLLLLL
L.LLL.LLLLLL.LLLLLLLLL.LLLLLL.LL.LLLL.L.LLLLLLLLL.LLL.LLLLLLLLLL.LLLLL.LLL.LLLLLLLLLLLLLL.
LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLL.LL.LLL.LLLLLLL.LLLL.LLLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLLLL.LLL.LLLL.LLLLL.LLLL
LL...L..LL........L...LL....L.LL..L.........LL..L...L..L.L...L.L.LL..L.L....LL....LL.....L
LLLLL.LLLLLL.LLLLLLLL..LLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.L.LLLLLLLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLL.LLLLL.LLLLLLLLLLL.LLLL.LL
LLLLL.LLLLLL.LLLLLLLLL.LLLLL.LLL.LLLL.L.LLLLLLLLLLL.LLLL.LLLLLLL.L.LLL.LLLLLLLLLLL.LLLLLLL
LL.LL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LL.LLLLLL.LLLLLL.LLLLLLLLLLLLLLL.LL.LLLLLL.LLL.LLL
LLLLLLLLLLLL.LLLLLLLLL.LL.LLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLL.LLLLLL.LLLLLLL
LLL.L.L.LLLL.LLLLLLLLLLLLLLLLLLL.L.LLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLL..LLL.LLLLLL.LLL.LLL
L.LL..L.L.L...L......L...L.......L.L.LL.....L.........L....L.......L.LL....L..L.L...L....L
LLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLLLL..LLLLLLLLLLLLLL.LLLL.LLLLLLLLLLLLLLL
LLLLL..LLLLL.LLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLL.LLL.LLLLLLLLLL.LLLLLL.LLLLLLL
LLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLL.LLLLLL.LLLLLLLLL.LLLL.L.LLLLLLL.L.LLL.LLLL.LLLLLL.LLL.LLL
LLLLLLLLLLLL.LLLL.LLLLLLLLLLLLL..LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LLLLL..LLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.L.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLL
LLLLL.LLLLLL.LLLLLL.LL.LLLLLLLLLLLLLLLL..LLLLLLLL.LLLLLLL.LL.LLLLLLLLL.LLLL.LLL.LLLLLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLL.LLL.LLLLLL.LLLLLL..LLLLL.LLLL.L.LLLL.LLLLLL.
LLLLL.LLLLLLLLLLLLL..L.LLLLLLLLL.LLLLLL.LLL.LLLLL.LLLLLL.LLLLLLL..LLLL.LLLLLLLLLLL.LLLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLL.LLL.LLLLLLLLLL.LLLLLLLLLLLLLL
.LL...L...........LL...LLL.L.L.L.L...L.L.....LLLLLL..........L.L.L.L.L...L.L.L.L........L.
LLLLLLLLLLLL.LLLLLLLLL..LLLLLLLL.L.LLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLLLL.LLLLL..LLLLLLL
L.LLL.LLLLLL.LLLLLLLLL.LLL.LLLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLLL.LLLLLLLLLLL.LLLLLL.
LLL.LLLLLLLL.LL.LLLLLL.L.LLLLLLL.LLLLLLLLLL.LLLLLLLLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLLLLLLLLLL
LLLLLLLLL.L.LLLLLLLLLL.L.LLLLLLL.LLLL.L.LLLLLLLLLLLLLLLLLLLLL.LL.LLLLLLLLLL.LLLL.LLLLLLLLL
LLLLL.LLLLLLL.LLLLLLL..LLLL.LLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLL.LLLLL.LLLL.L.LLLLLLLLLLL.
LLLLL.LLLLLLLLLLLLL.LLL.LLLLLLLLLLLLLLLLLLLLLLLLL.LLL.LL.LLLLLLL.LLLLLLLLLL.LLLLLL.LLLLLLL
.LLLL.LLLLLL.LLLLLLLLLLLLLLL.LLL.LLLLLL.LLLLLLL.L.LLLLLLLLLLLLLL.LLLL..L.L..LLLLLL.LLLLLLL
LLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLL.L.LLLLLL.LLLLLLLLLLLLL.LLLL.LLLLLL.LLLLLLL
LLLLL.LLLLLL..LLLLLLLL.LLLL.LLL.LLLLLLL.LLLLLLLLL.LL.LLL.LLLLLLLLLLLLL.LLLLLLLLLLL.LLLLLL.
LLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLL.LLLL.LLLLLL..LLLLLL
LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL..LLLLL.LLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLL
L.LLL.LLLLLL.LLLLLLLLL.LLLLLLLLL.L.LLLLLLLLLLLLLLLLLL.LL.LLLLLLLLLLLLLL.LL..LLLLLL.LLLLLLL`;

  const makeSimpleMatrix = (str, mapper = (x) => x) =>
    str.split('\n').map((line) => line.split('').map(mapper));

  const grid = makeSimpleMatrix(input);

  let cellsMatrix;

  const settings = {
    speed: 50,
    part: '1',
  };
  const speedRange = document.getElementById('speedRange');
  const rangeOutput = document.getElementById('rangevalue');
  const parts = document.getElementById('parts');
  const playBtn = document.getElementById('play');

  parts.onclick = (e) => {
    if (e.target.type === 'radio') {
      settings.part = e.target.value;
    }
  };

  speedRange.oninput = (e) => {
    settings.speed = e.target.value;
    rangeOutput.innerHTML = settings.speed;
  };

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const size = Math.min(innerHeight, innerWidth);
  const rowSize = Math.floor(size / grid.length);
  const colsSize = Math.floor(size / grid[0].length);

  canvas.width = size;
  canvas.height = size;
  function Cell(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    const getFillStyle = () => {
      const colorMap = {
        L: '#06d6a0',
        '.': '#073b4c',
        '#': '#ef476f',
      };
      return colorMap[this.value];
    };

    this.setValue = (value) => {
      this.value = value;
    };

    this.draw = () => {
      ctx.beginPath();
      ctx.fillStyle = getFillStyle();
      ctx.fillRect(x * colsSize, y * rowSize, colsSize, rowSize);
    };
  }

  const init = () => {
    cellsMatrix = Matrix(grid).map((cell, { x, y }) => new Cell(x, y, cell));
    Matrix(cellsMatrix).forEach((c) => c.draw());
    ctx.fill();
  };
  const drawGrid = () => {
    ctx.strokeStyle = 'white';
    for (let i = 0; i < grid.length; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * rowSize);
      ctx.lineTo(size, i * rowSize);
      ctx.stroke();
    }
    for (let i = 0; i < grid[0].length; i++) {
      ctx.beginPath();
      ctx.moveTo(i * colsSize, 0);
      ctx.lineTo(i * colsSize, size);
      ctx.stroke();
    }
  };
  init();
  drawGrid();
  let turns = 0;
  const ids = [];
  const onPlay = (changedMatrix, isDone) => {
    turns++;
    ids.push(
      setTimeout(() => {
        if (isDone) {
          console.log('done');
          return;
        }
        Matrix(changedMatrix).forEach((cell, { x, y }) => {
          const _cell = cellsMatrix[y][x];
          _cell.setValue(cell);
          _cell.draw();
        });
        drawGrid();
      }, settings.speed * turns)
    );
  };

  playBtn.onclick = () => {
    ids.forEach((id) => clearTimeout(id));
    init();
    turns = 0;
    if (settings.part === '1') {
      pt1(grid, onPlay);
      return;
    }
    pt2(grid, onPlay);
  };

}());
