import { pt1, pt2, Matrix } from './game';
import { grid, input } from './input';

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
    ctx.moveTo(0, i * colsSize);
    ctx.lineTo(size, i * colsSize);
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
