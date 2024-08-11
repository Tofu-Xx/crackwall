<script setup lang="ts">
const cvs = $ref<HTMLCanvasElement>()
const ctx = $computed(() => cvs!.getContext('2d')!)

type Point = [number, number]
interface Polar {
  origin: Point
  r: number
  theta: number
}

const tasks: Function[] = $ref([])

function init() {
  const { width: W, height: H } = cvs!.getBoundingClientRect()
  cvs!.width = W
  cvs!.height = H
  ctx.strokeStyle = '#8888'
}

function draw(e: MouseEvent) {
  const { offsetX, offsetY } = e

  // 相对于中心点的坐标差值
  // const dx =  offsetX- cvs!.width/2;
  // const dy =  offsetY- cvs!.height/2;

  const root: Polar = {
    origin: [offsetX, offsetY],
    r: 15,
    // theta:  Math.atan2(dy, dx) - Math.PI
    // theta:random(0,Math.PI*2)
    theta: Math.PI / 2 * 3,
  }
  branch(root)
}

function branch(root: Polar, deepth = 0) {
  if (root.r < 0.8)
    return
  const end = lineTo(root)
  if (deepth < 6 || random() < 0.6) {
    tasks.push(() =>
      branch({ origin: end, r: random(root.r * 0.8, root.r * 1.04), theta: random(root.theta, root.theta + 0.1) }, deepth + 1),
    )
  }
  if (deepth < 6 || random() < 0.6) {
    tasks.push(() =>
      branch({ origin: end, r: random(root.r * 0.8, root.r * 1.04), theta: random(root.theta, root.theta - 0.1) }, deepth + 1),
    )
  }
}

function frame() {
  const t = [...tasks]
  tasks.length = 0
  t.forEach(f => f())
}

(function loop(deepth = 0) {
  window.requestAnimationFrame(() => {
    if (deepth % 3 === 0)
      frame()
    loop(deepth + 1)
  })
})()

function random(a: number = 0, b: number = 1) {
  return Math.random() * (b - a) + a
}

function line(start: Point, end: Point) {
  ctx.beginPath()
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function lineTo(p: Polar) {
  const { r, theta, origin: [x, y] } = p
  const end: Point = [x + r * Math.cos(theta), y + r * Math.sin(theta)]
  line(p.origin, end)
  return end
}

onMounted(init)
</script>

<template>
  <canvas ref="cvs" h100vh w100vw bg="gray500 op5" @click="draw" @contextmenu.prevent="ctx.clearRect(0, 0, cvs!.width, cvs!.height);tasks = []" />
</template>
