<template>
  <div class="main">
    <canvas ref="pixiContainer"></canvas>
    <button class="left" @click="left"></button>
    <button class="right" @click="right"></button>
    <button class="start" @click="start">开始</button>
    <div class="score">{{ score }}</div>
  </div>
</template>

<script setup>
import * as PIXI from "pixi.js";
import gsap from "gsap";
import { ref, computed, onMounted } from "vue";

const centerX = 500;
const centerY = 500;
const side1 = 100;
const side2 = 307.8461;
const side3 = 446.4102;

let hexagon3 = null;
let hexagon2 = null;
let hexagon1 = null;
let isLeft = true;
let isRight = true;
let crash = [0, 0, 0, 0, 0, 0];
let inside = [[], [], [], [], [], []];
let itemArr = [];
let app = null;
let v = 1;
let interval = 3000;
let color = ["0xE74C3C", "0xF1C40F", "0x3498DB", "0x2ECC71"];
let record1 = [];
let flag = false;
let timer = null;

const score = ref(0);

const diso_init = computed(() => (side3 / 2) * Math.sqrt(3));

const pixiContainer = ref(null);

onMounted(() => {
  app = new PIXI.Application({
    width: 1800,
    height: 1000,
    transparent: false,
    antialias: true,
    backgroundColor: 0x1099bb,
    view: pixiContainer.value,
  });

  hexagon3 = new PIXI.Graphics();
  hexagon2 = new PIXI.Graphics();
  hexagon1 = new PIXI.Graphics();
  let points1 = [];
  let points2 = [];
  let points3 = [];

  hexagon3.beginFill(0xffffff);
  for (let i = 0; i < 6; i++) {
    let deg = 60 * i;
    let rad = (Math.PI / 180) * deg;
    const point_x = centerX + side3 * Math.cos(rad);
    const point_y = centerY + side3 * Math.sin(rad);
    points3.push(point_x, point_y);
  }
  hexagon3.drawPolygon(points3);
  hexagon3.endFill();
  app.stage.addChild(hexagon3);

  hexagon2.beginFill(0xbdc3c7);
  for (let i = 0; i < 6; i++) {
    let deg = 60 * i;
    let rad = (Math.PI / 180) * deg;
    const point_x = centerX + side2 * Math.cos(rad);
    const point_y = centerY + side2 * Math.sin(rad);
    points2.push(point_x, point_y);
  }
  hexagon2.drawPolygon(points2);
  hexagon2.endFill();
  app.stage.addChild(hexagon2);

  hexagon1.beginFill(0xf1c40f);
  for (let i = 0; i < 6; i++) {
    let deg = 60 * i;
    let rad = (Math.PI / 180) * deg;
    const point_x = side1 * Math.cos(rad);
    const point_y = side1 * Math.sin(rad);
    points1.push(point_x, point_y);
  }
  hexagon1.drawPolygon(points1);
  hexagon1.endFill();
  app.stage.addChild(hexagon1);
  hexagon1.interactive = true;
  hexagon1.position.set(500, 500);
});

const left = () => {
  if (isLeft) {
    isLeft = false;
    gsap.to(hexagon1, {
      rotation: hexagon1.rotation - Math.PI / 3,
      duration: 0.1,
    });
    let val = crash.shift();
    crash.push(val);
    let arr = inside.shift();
    inside.push(arr);
    for (let obj of itemArr) {
      if (obj.isFinish) {
        gsap.to(obj.item, {
          rotation: obj.item.rotation - Math.PI / 3,
          duration: 0.1,
        });
      }
    }
    setTimeout(() => {
      isLeft = true;
    }, 100);
  }
};

const right = () => {
  if (isRight) {
    isRight = false;
    gsap.to(hexagon1, {
      rotation: hexagon1.rotation + Math.PI / 3,
      duration: 0.1,
    });
    let val = crash.pop();
    crash.unshift(val);
    let arr = inside.pop();
    inside.unshift(arr);
    for (let obj of itemArr) {
      if (obj.isFinish) {
        gsap.to(obj.item, {
          rotation: obj.item.rotation + Math.PI / 3,
          duration: 0.1,
        });
      }
    }
    setTimeout(() => {
      isRight = true;
    }, 100);
  }
};

const start = () => {
  timer = setInterval(() => {
    generate(v);
  }, interval);
};

const generate = (v) => {
  let item = new PIXI.Graphics();
  let polygon1 = new PIXI.Polygon([
    -side3 / 2,
    0,
    side3 / 2,
    0,
    side3 / 2 - 10 * Math.sqrt(3),
    30,
    10 * Math.sqrt(3) - side3 / 2,
    30,
  ]);
  let colorVal = color[Math.floor(Math.random() * 4)];
  item.beginFill(colorVal);
  item.drawPolygon(polygon1);
  item.endFill();
  let type = Math.floor(Math.random() * 6);
  item.position.set(500, 500);
  item.pivot.set(0, (side3 / 2) * Math.sqrt(3));
  switch (type) {
    case 0:
      break;
    case 1:
      item.rotation += Math.PI / 3;
      break;
    case 2:
      item.rotation += (Math.PI / 3) * 2;
      break;
    case 3:
      item.rotation += (Math.PI / 3) * 3;
      break;
    case 4:
      item.rotation += (Math.PI / 3) * 4;
      break;
    case 5:
      item.rotation += (Math.PI / 3) * 5;
      break;
  }
  app.stage.addChild(item);
  let obj = { item, type, isFinish: false, color: colorVal, advance: 0 };
  itemArr.push(obj);
  move(v);
};

const move = (v) => {
  let ticker = new PIXI.Ticker();
  let obj = itemArr.pop();
  let { item, type, color: colorVal, isFinish, advance } = obj;
  item.clear();
  let polygon1 = new PIXI.Polygon([
    -side3 / 2,
    0,
    side3 / 2,
    0,
    side3 / 2 - 10 * Math.sqrt(3),
    30,
    10 * Math.sqrt(3) - side3 / 2,
    30,
  ]);
  item.beginFill(colorVal);
  item.drawPolygon(polygon1);
  item.endFill();
  let y = (side3 / 2) * Math.sqrt(3);
  let ratio;
  ticker.add(() => {
    y -= v;
    ratio = y / diso_init.value;
    item.clear();
    let polygon1 = new PIXI.Polygon([
      (-side3 / 2) * ratio,
      0,
      (side3 / 2) * ratio,
      0,
      (side3 / 2) * ratio - 10 * Math.sqrt(3),
      30,
      10 * Math.sqrt(3) - (side3 / 2) * ratio,
      30,
    ]);
    item.beginFill(colorVal);
    item.drawPolygon(polygon1);
    item.endFill();
    item.pivot.set(0, y);
    if (y <= 50 * Math.sqrt(3) + 30 * (crash[type] + 1)) {
      y = 50 * Math.sqrt(3) + 30 * (crash[type] + 1);
      item.pivot.set(0, y);
      ratio = y / diso_init.value;
      item.clear();
      let polygon1 = new PIXI.Polygon([
        (-side3 / 2) * ratio,
        0,
        (side3 / 2) * ratio,
        0,
        (side3 / 2) * ratio - 10 * Math.sqrt(3),
        30,
        10 * Math.sqrt(3) - (side3 / 2) * ratio,
        30,
      ]);
      item.beginFill(colorVal);
      item.drawPolygon(polygon1);
      item.endFill();
      isFinish = true;
      itemArr.push({ item, type, color: colorVal, isFinish });
      crash[type]++;
      inside[type].push({ item, type, color: colorVal, isFinish, advance });
      check(type, inside[type].length - 1);
      ticker.stop();
    }
  });
  ticker.start();
};

const render = () => {
  let isFirst = false;
  if (!flag) {
    flag = true;
    isFirst = true;
  }
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < inside[i].length; j++) {
      let target;
      if (inside[i][j].advance) {
        let y = inside[i][j].item.pivot.y;
        target = y - inside[i][j].advance * 30;
        gsap.to(inside[i][j].item.pivot, { duration: 0.2, y: target });
        let dis = y - target;
        let forward = dis / 12;
        let t = 0;
        let polygon = new PIXI.Polygon();
        gsap.to(polygon, {
          duration: 0.2,
          onUpdate: () => {
            t += forward;
            let ratio = y / diso_init.value;
            polygon.points = [
              (-side3 / 2) * ratio + t / 2,
              0,
              (side3 / 2) * ratio - t / 2,
              0,
              (side3 / 2) * ratio - 10 * Math.sqrt(3) - t / 2,
              30,
              10 * Math.sqrt(3) - (side3 / 2) * ratio + t / 2,
              30,
            ];
            inside[i][j].item.clear();
            inside[i][j].item.beginFill(inside[i][j].color);
            inside[i][j].item.drawPolygon(polygon);
            inside[i][j].item.endFill();
          },
        });
        setTimeout(() => {
          let ratio = target / diso_init.value;
          inside[i][j].item.clear();
          let polygon1 = new PIXI.Polygon([
            (-side3 / 2) * ratio,
            0,
            (side3 / 2) * ratio,
            0,
            (side3 / 2) * ratio - 10 * Math.sqrt(3),
            30,
            10 * Math.sqrt(3) - (side3 / 2) * ratio,
            30,
          ]);
          inside[i][j].item.beginFill(inside[i][j].color);
          inside[i][j].item.drawPolygon(polygon1);
          inside[i][j].item.endFill();
          app.stage.addChild(inside[i][j].item);
          inside[i][j].item.pivot.y = target;
          inside[i][j].advance = 0;
        }, 200);
      }
    }
  }
  score.value += record1.length;
  if (
    score.value >= 10 &&
    score.value < 30 &&
    score.value - record1.length < 10
  ) {
    clearInterval(timer);
    v += 0.25;
    interval -= 300;
    timer = setInterval(() => {
      generate(v);
    }, interval);
  } else if (
    score.value >= 30 &&
    score.value < 50 &&
    score.value - record1.length < 30
  ) {
    clearInterval(timer);
    v += 0.25;
    interval -= 300;
    timer = setInterval(() => {
      generate(v);
    }, interval);
  } else if (
    score.value >= 50 &&
    score.value < 80 &&
    score.value - record1.length < 50
  ) {
    clearInterval(timer);
    v += 0.25;
    interval -= 300;
    timer = setInterval(() => {
      generate(v);
    }, interval);
  } else if (score.value >= 80 && score.value - record1.length < 80) {
    clearInterval(timer);
    v += 0.25;
    interval -= 300;
    timer = setInterval(() => {
      generate(v);
    }, interval);
  }
  record1 = [];
  if (isFirst) {
    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < inside[i].length; j++) {
          check(i, j);
        }
      }
      flag = false;
    }, 500);
  }
};

const check = (type, j) => {
  let arr1 = [110, 110, 110, 110, 110, 110];
  let arr2 = [0, 0, 0, 0, 0, 0];
  checkInternal(type, j);
  if (record1.length < 3) {
    record1 = [];
    return;
  }
  for (let { x, y } of record1) {
    app.stage.removeChild(inside[x][y].item);
    arr1[x] = arr1[x] < y ? arr1[x] : y;
    arr2[x]++;
    crash[x]--;
  }
  for (let x = 0; x < 6; x++) {
    if (arr1[x] < 6) {
      inside[x].splice(arr1[x], arr2[x]);
      for (let y = arr1[x]; y < inside[x].length; y++) {
        inside[x][y].advance += arr2[x];
      }
    }
  }
  render();
};

const checkInternal = (type, j) => {
  if (!isHave({ x: type, y: j })) {
    record1.push({ x: type, y: j });
  }
  let len = inside[type].length;
  let left = (type - 1 + 6) % 6;
  let right = (type + 1) % 6;
  let down = j - 1 >= 0 ? j - 1 : null;
  let up = j + 1 < len ? j + 1 : null;
  let left_len = inside[left].length;
  let right_len = inside[right].length;
  let color = inside[type][j].color;

  if (
    left_len > j &&
    inside[left][j].color == color &&
    !isHave({ x: left, y: j })
  ) {
    record1.push({ x: left, y: j });
    checkInternal(left, j);
  }
  if (
    right_len > j &&
    inside[right][j].color == color &&
    !isHave({ x: right, y: j })
  ) {
    record1.push({ x: right, y: j });
    checkInternal(right, j);
  }
  if (
    down != null &&
    inside[type][down].color == color &&
    !isHave({ x: type, y: down })
  ) {
    record1.push({ x: type, y: down });
    checkInternal(type, down);
  }
  if (
    up &&
    inside[type][up].color == color &&
    !isHave({ x: type, y: up })
  ) {
    record1.push({ x: type, y: up });
    checkInternal(type, up);
  }
};

const isHave = (obj) => {
  if (!record1.length) return false;
  for (let e of record1) {
    if (e.x == obj.x && e.y == obj.y) return true;
  }
  return false;
};
</script>

<style scoped>

canvas {
  position: absolute;
}
button {
  width: 30px;
  height: 30px;
  z-index: 10;
  border: none;
  position: absolute;
}
button:hover {
  cursor: pointer;
}
.left {
  left: 420px;
  top: 485px;
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}
.right {
  left: 550px;
  top: 485px;
  clip-path: polygon(0 0, 0 100%, 100% 50%);
}
.score {
  position: absolute;
  /* background-color: #b10808; */
  width: 100px;
  height: 50px;
  left: 450px;
  top: 475px;
  font-size: 40px;
  text-align: center;
  line-height: 40px;
}
.start {
  width: 100px;
  height: 30px;
  position: absolute;
  z-index: 10;
}
</style>
