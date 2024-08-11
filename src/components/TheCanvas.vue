<script setup lang="ts">
const cvs = $ref<HTMLCanvasElement>()
const ctx = $computed(() => cvs!.getContext('2d')!)

type Point = [number,number]
interface Polar{   
  origin:Point,
  r:number,
  theta:number
}

const tasks :Function[] = []

function init  () {
  const {width:W,height:H} = cvs!.getBoundingClientRect()
  cvs!.width= W
  cvs!.height= H
  ctx.strokeStyle = '#8888'
}

function draw(e: MouseEvent){
  const {offsetX,offsetY}=e
  const root:Polar = {
    origin:[offsetX,offsetY],
    r:40,
    theta:random(0,Math.PI*2)
  }
  branch(root)
}


function branch(root:Polar,deepth=0){
  if(root.r<10) return
  const end=lineTo(root)
 if(deepth<2||random()<.5) {
 tasks.push(()=>
 branch({origin:end,r:random(root.r*.8,root.r),theta:random(root.theta,root.theta+1)},deepth+1)
)}
 if(deepth<2||random()<.5){
 tasks.push(()=>
 branch({origin:end,r:random(root.r*.8,root.r),theta:random(root.theta,root.theta-1)},deepth+1)
)}
}

function frame(){
  const t = [...tasks]
  tasks.length = 0
  t.forEach(f=>f())
}

(function loop(deepth=0){
  window.requestAnimationFrame(()=>{
  if(deepth%3===0) frame()
  loop(deepth+1)
  })
})()

function random(a:number=0,b:number=1){
  return Math.random()*(b-a) + a
}

function line(start:Point,end:Point){
  ctx.beginPath()
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function lineTo(p:Polar){
  const {r,theta, origin:[x,y]} = p
  const end:Point = [x + r * Math.cos(theta),y + r * Math.sin(theta)]
  line(p.origin,end)
  return end
}

onMounted(init)

</script>

<template>
  <canvas ref="cvs" h100vh w100vw bg="gray500 op5" @click="draw"></canvas>
</template>