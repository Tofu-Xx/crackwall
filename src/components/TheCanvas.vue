<script setup lang="ts">
const color = () => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
const len = 15 
const newLen = [0.8, 1.04] 
const theta = [Math.PI / 2 * 3, Math.PI / 2 * 3] 
const newTheta = 0.1 
const minimumLen = 0.8 
const surviveDepth = 6 
const deathRate = 0.6

// const color = () => '#8888'
// const len = 40
// const newLen = [0.8, 1]
// const theta = [0, Math.PI * 2]
// const newTheta = 1
// const minimumLen = 10
// const surviveDepth = 2
// const deathRate = 0.5

const cvsRef = $(useTemplateRef<HTMLCanvasElement>('cvs'))
const ctx = $computed(() => cvsRef!.getContext('2d')!)

const tasks: (() => void)[] = $ref([])

function init() {
  const { width: W, height: H } = cvsRef!.getBoundingClientRect()
  cvsRef!.width = W
  cvsRef!.height = H
}

type Point = [number, number]
interface Polar {
  origin: Point
  r: number
  theta: number
  color: string
}
function draw(e: MouseEvent) {
  const { offsetX, offsetY } = e
  const root: Polar = {
    origin: [offsetX, offsetY],
    r: len,
    theta: random(...theta),
    color: color(),
  }
  branch(root)
}

function branch(root: Polar, deepth = 0) {
  const { r, theta, color } = root
  ctx.strokeStyle = color
  if (r < minimumLen)
    return
  const end = lineTo(root)
  if (deepth < surviveDepth || random() < deathRate) {
    tasks.push(() =>
      branch({ color, origin: end, r: random(r * newLen[0], r * newLen[1]), theta: random(theta, theta + newTheta) }, deepth + 1),
    )
  }
  if (deepth < surviveDepth || random() < deathRate) {
    tasks.push(() =>
      branch({ color, origin: end, r: random(r * newLen[0], r * newLen[1]), theta: random(theta, theta - newTheta) }, deepth + 1),
    )
  }
}

function frame() {
  const t = [...tasks]
  tasks.length = 0
  t.forEach(f => f())
}

(function loop(deepth = 0) {
  requestAnimationFrame(() => {
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
  <canvas ref="cvs" h100vh w100vw bg="gray500 op5" @click="draw" @contextmenu.prevent="ctx.clearRect(0, 0, cvsRef!.width, cvsRef!.height);tasks = []" />
</template>
