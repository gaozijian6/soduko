<template>
    <div class="main">
        <canvas ref="pixiCanvas"></canvas>
        <!-- <div class="flag"></div> -->
        <div class="num">{{ n }}</div>
    </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
export default {
name:'tangram',
data() {
    return {
      n:0,
      side:100,
      arr:[{x:200,y:-50,isHave:false},{x:100,y:0,isHave:false},{x:400,y:100,isHave:false},{x:600+100*Math.sqrt(2),y:0,isHave:false},{x:300,y:100,isHave:false},{x:600,y:0,isHave:false},{x:600+50*Math.sqrt(2),y:0,isHave:false}],
      targetX:100,
      targetY:200,
      trangle1:null,
      trangle2:null,
      trangle3:null,
      trangle4:null,
      trangle5:null,
      square:null,
      parall:null

    }
},
mounted() {
    const canvas = this.$refs.pixiCanvas;

        const app = new PIXI.Application({
  view: canvas,
  width: 1600,
  height: 1000,
  backgroundColor: 0xafefff,
  antialias:true
});
let targetX=this.targetX
let targetY=this.targetY
let m=0

let target=new PIXI.Graphics()
target.beginFill(0x000000)
target.drawPolygon([0,0, 100,100, 500,100, 600,200, 600,50*Math.sqrt(2), 600+100*Math.sqrt(2),50*Math.sqrt(2), 600+100*Math.sqrt(2),100*Math.sqrt(2), 600+200*Math.sqrt(2),0, 600+100*Math.sqrt(2),-100*Math.sqrt(2), 600+100*Math.sqrt(2),-50*Math.sqrt(2), 600,-50*Math.sqrt(2), 600,-200, 500,-100, 100,-100])
target.endFill()
target.alpha=0.5
app.stage.addChild(target)
target.position.set(100,200)


if(true){

let flag=document.querySelector('.flag')
// flag.style.left=this.targetX+300+'px'
// flag.style.top=this.targetY+100+'px'

// 红色三角
  if(true){
    let trangle1=new PIXI.Graphics()
    trangle1.beginFill(0xE74C3C)
    trangle1.drawPolygon([0,0,4*this.side,0,2*this.side,2*this.side])
    trangle1.endFill()
    trangle1.pivot.set(2*this.side,0)
    trangle1.position.set(2*this.side,2*this.side)
    app.stage.addChild(trangle1)
    trangle1.interactive=true
    trangle1.isFinish=false
    trangle1.n=0
  
let offset = { x: 0, y: 0 };
trangle1.on('pointerdown', onDragStart);
trangle1.on('pointermove', onDragMove);
trangle1.on('pointerup', onDragEnd);
trangle1.on('pointerupoutside', onDragEnd);
trangle1.on('click',()=>{
  if(!trangle1.flag&&!trangle1.isRotate&&!trangle1.isFinish){
    trangle1.isRotate=true
      gsap.to(trangle1,0.3,{rotation:trangle1.rotation+45/180*Math.PI})
      trangle1.n++
      setTimeout(() => {
        trangle1.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-trangle1.x,y:event.data.global.y-trangle1.y}
  trangle1.dragging = true
}
function onDragMove(event) {
  if (trangle1.dragging&&!trangle1.isFinish) {
    trangle1.x = event.data.global.x -offset.x
    trangle1.y = event.data.global.y -offset.y
    trangle1.flag=true
  }
  if(trangle1.x<310+targetX&&trangle1.x>290+targetX&&trangle1.y<110+targetY&&trangle1.y>90+targetY&&trangle1.n%8==4){
    trangle1.x=300+targetX
    trangle1.y=100+targetY
    trangle1.isFinish=true
    

  }
  if(trangle1.x<610+targetX&&trangle1.x>590+targetX&&trangle1.y<10+targetY&&trangle1.y>-10+targetY&&trangle1.n%8==2){
    trangle1.x=600+targetX
    trangle1.y=targetY
    trangle1.isFinish=true
  
  }
}

function onDragEnd() {
  trangle1.dragging = false;
  if(trangle1.isFinish){
    m++
    trangle1.removeAllListeners()

  }
    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    trangle1.flag=false
  }, 0);
}

  }

// 橙色三角
    if(true){
      let trangle2=new PIXI.Graphics()
    trangle2.beginFill(0xE67E22)
    trangle2.drawPolygon([0,0,0,4*this.side,2*this.side,2*this.side])
    trangle2.endFill()
    trangle2.pivot.set(0,2*this.side)
    trangle2.position.set(0,4*this.side)
app.stage.addChild(trangle2)
    trangle2.interactive=true
    trangle2.n=0
    trangle2.isFinish=false


    let offset = { x: 0, y: 0 };
trangle2.on('pointerdown', onDragStart);
trangle2.on('pointermove', onDragMove);
trangle2.on('pointerup', onDragEnd);
trangle2.on('pointerupoutside', onDragEnd);
trangle2.on('click',()=>{
  if(!trangle2.flag&&!trangle2.isRotate&&!trangle2.isFinish){
    trangle2.isRotate=true
      gsap.to(trangle2,0.3,{rotation:trangle2.rotation+45/180*Math.PI})
      trangle2.n++
      setTimeout(() => {
        trangle2.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-trangle2.x,y:event.data.global.y-trangle2.y}
  trangle2.dragging = true
}
function onDragMove(event) {
  if (trangle2.dragging&&!trangle2.isFinish) {
    trangle2.x = event.data.global.x -offset.x
    trangle2.y = event.data.global.y -offset.y
    trangle2.flag=true
    if(trangle2.x<310+targetX&&trangle2.x>290+targetX&&trangle2.y<110+targetY&&trangle2.y>90+targetY&&trangle2.n%8==6){
    trangle2.x=300+targetX
    trangle2.y=100+targetY
    trangle2.isFinish=true
  
  }
  if(trangle2.x<610+targetX&&trangle2.x>590+targetX&&trangle2.y<10+targetY&&trangle2.y>-10+targetY&&trangle2.n%8==4){
    trangle2.x=600+targetX
    trangle2.y=targetY
    trangle2.isFinish=true
   
  }
  }
}

function onDragEnd() {
  trangle2.dragging = false;
  if(trangle2.isFinish){
    m++
    trangle2.removeAllListeners()

  }

    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    trangle2.flag=false
  }, 0);
}
    }


// 绿色三角
    if(true){
      let trangle3=new PIXI.Graphics()
    trangle3.beginFill(0x2ECC71)
    trangle3.drawPolygon([0,0,0,2*this.side,-this.side,this.side])
    trangle3.endFill()
    trangle3.pivot.set(0,this.side)
    trangle3.position.set(4*this.side,3*this.side)
app.stage.addChild(trangle3)
    trangle3.interactive=true
    trangle3.n=0
    trangle3.isFinish=false

    
    let offset = { x: 0, y: 0 };
trangle3.on('pointerdown', onDragStart);
trangle3.on('pointermove', onDragMove);
trangle3.on('pointerup', onDragEnd);
trangle3.on('pointerupoutside', onDragEnd);
app.stage.addListener
trangle3.on('click',()=>{
  if(!trangle3.flag&&!trangle3.isRotate&&!trangle3.isFinish){
    trangle3.isRotate=true
      gsap.to(trangle3,0.3,{rotation:trangle3.rotation+45/180*Math.PI})
      trangle3.n++
      setTimeout(() => {
        trangle3.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-trangle3.x,y:event.data.global.y-trangle3.y}
  trangle3.dragging = true
}
function onDragMove(event) {
  if (trangle3.dragging&&!trangle3.isFinish) {
    trangle3.x = event.data.global.x -offset.x
    trangle3.y = event.data.global.y -offset.y
    trangle3.flag=true
    if(trangle3.x<410+targetX&&trangle3.x>390+targetX&&trangle3.y<-90+targetY&&trangle3.y>-110+targetY&&trangle3.n%8==6){
    trangle3.x=400+targetX
    trangle3.y=targetY-100
    trangle3.isFinish=true
   
  }
  if(trangle3.x<110+targetX&&trangle3.x>90+targetX&&trangle3.y<10+targetY&&trangle3.y>-10+targetY&&trangle3.n%8==6){
    trangle3.x=100+targetX
    trangle3.y=targetY
    trangle3.isFinish=true
   
  }
  }
}

function onDragEnd() {
  trangle3.dragging = false;
  if(trangle3.isFinish){
    m++
    trangle3.removeAllListeners()

  }

    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    trangle3.flag=false
  }, 0);
}
  


    }
    // 蓝色三角
    if(true){
      let trangle4=new PIXI.Graphics()
    trangle4.beginFill(0x3498DB)
    trangle4.drawPolygon([0,0,this.side,this.side,-this.side,this.side])
    trangle4.endFill()
    trangle4.pivot.set(0,this.side)
    trangle4.position.set(2*this.side,500)
app.stage.addChild(trangle4)
    trangle4.interactive=true
    trangle4.n=0
    trangle4.isFinish=false

    let offset = { x: 0, y: 0 };
trangle4.on('pointerdown', onDragStart);
trangle4.on('pointermove', onDragMove);
trangle4.on('pointerup', onDragEnd);
trangle4.on('pointerupoutside', onDragEnd);
trangle4.on('click',()=>{
  if(!trangle4.flag&&!trangle4.isRotate&&!trangle4.isFinish){
    trangle4.isRotate=true
      gsap.to(trangle4,0.3,{rotation:trangle4.rotation+45/180*Math.PI})
      trangle4.n++
      setTimeout(() => {
        trangle4.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-trangle4.x,y:event.data.global.y-trangle4.y}
  trangle4.dragging = true
}
function onDragMove(event) {
  if (trangle4.dragging&&!trangle4.isFinish) {
    trangle4.x = event.data.global.x -offset.x
    trangle4.y = event.data.global.y -offset.y
    trangle4.flag=true
    if(trangle4.x<410+targetX&&trangle4.x>390+targetX&&trangle4.y<-90+targetY&&trangle4.y>-110+targetY&&trangle4.n%8==4){
    trangle4.x=400+targetX
    trangle4.y=targetY-100
    trangle4.isFinish=true
    
  }
  if(trangle4.x<110+targetX&&trangle4.x>90+targetX&&trangle4.y<10+targetY&&trangle4.y>-10+targetY&&trangle4.n%8==4){
    trangle4.x=100+targetX
    trangle4.y=targetY
    trangle4.isFinish=true
    
  }
  }
}

function onDragEnd() {
  trangle4.dragging = false;
  if(trangle4.isFinish){
    m++
    trangle4.removeAllListeners()

  }

    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    trangle4.flag=false
  }, 0);
}
  
    }

// 紫色正方
    if(true){
      let square=new PIXI.Graphics()
    square.beginFill(0x9B59B6)
    square.drawPolygon([0,0,this.side,this.side,0,2*this.side,-this.side,this.side])
    square.endFill()
    square.pivot.set(0,this.side)
    square.position.set(3*this.side,4*this.side)
app.stage.addChild(square)
    square.interactive=true
    square.n=0
    square.isFinish=false

    let offset = { x: 0, y: 0 };
square.on('pointerdown', onDragStart);
square.on('pointermove', onDragMove);
square.on('pointerup', onDragEnd);
square.on('pointerupoutside', onDragEnd);
app.stage.addListener
square.on('click',()=>{
  if(!square.flag&&!square.isRotate&&!square.isFinish){
    square.isRotate=true
      gsap.to(square,0.3,{rotation:square.rotation+45/180*Math.PI})
      square.n++
      setTimeout(() => {
        square.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-square.x,y:event.data.global.y-square.y}
  square.dragging = true
}
function onDragMove(event) {
  if (square.dragging&&!square.isFinish) {
    square.x = event.data.global.x -offset.x
    square.y = event.data.global.y -offset.y
    square.flag=true
    if(square.x<610+targetX+50*Math.sqrt(2)&&square.x>590+targetX+50*Math.sqrt(2)&&square.y<10+targetY&&square.y>-10+targetY&&square.n%2==1){
    square.x=600+targetX+50*Math.sqrt(2)
    square.y=targetY
    square.isFinish=true
   
  }
  }
  
}

function onDragEnd() {
  square.dragging = false;
  if(square.isFinish){
    m++
    square.removeAllListeners()
  }

    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    square.flag=false
  }, 0);
}
this.square=square
    }


// 黄色三角
    if(true){
      let trangle5=new PIXI.Graphics()
    trangle5.beginFill(0xF1C40F)
    trangle5.drawPolygon([0,0,0,2*this.side,-2*this.side,2*this.side])
    trangle5.endFill()
    trangle5.pivot.set(-this.side,this.side)
    trangle5.position.set(3*this.side,500)
app.stage.addChild(trangle5)
    trangle5.interactive=true
    trangle5.n=0
    trangle5.isFinish=false

    let offset = { x: 0, y: 0 };
trangle5.on('pointerdown', onDragStart);
trangle5.on('pointermove', onDragMove);
trangle5.on('pointerup', onDragEnd);
trangle5.on('pointerupoutside', onDragEnd);
trangle5.on('click',()=>{
  if(!trangle5.flag&&!trangle5.isRotate&&!trangle5.isFinish){
    trangle5.isRotate=true
      gsap.to(trangle5,0.3,{rotation:trangle5.rotation+45/180*Math.PI})
      trangle5.n++
      setTimeout(() => {
        trangle5.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-trangle5.x,y:event.data.global.y-trangle5.y}
  trangle5.dragging = true
}
function onDragMove(event) {
  if (trangle5.dragging&&!trangle5.isFinish) {
    trangle5.x = event.data.global.x -offset.x
    trangle5.y = event.data.global.y -offset.y
    trangle5.flag=true
  
    if(trangle5.x<610+targetX+100*Math.sqrt(2)&&trangle5.x>590+targetX+100*Math.sqrt(2)&&trangle5.y<10+targetY&&trangle5.y>-10+targetY&&trangle5.n%8==7){
    trangle5.x=600+targetX+100*Math.sqrt(2)
    trangle5.y=targetY
    trangle5.isFinish=true
  
  }
  }
}

function onDragEnd() {
  trangle5.dragging = false;
  if(trangle5.isFinish){
    m++
    trangle5.removeAllListeners()
  }
    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    trangle5.flag=false
  }, 0);
}
    }
   
// 平行四边
 if(true){
  let parall=new PIXI.Graphics()
    parall.beginFill(0x34495E)
    parall.drawPolygon([0,0,2*this.side,0,this.side,this.side,-this.side,this.side])
    parall.endFill()
    parall.pivot.set(50,50)
    parall.position.set(150,550)
app.stage.addChild(parall)
    parall.interactive=true
    parall.n=0
    parall.isFinish=false

    let offset = { x: 0, y: 0 };
parall.on('pointerdown', onDragStart);
parall.on('pointermove', onDragMove);
parall.on('pointerup', onDragEnd);
parall.on('pointerupoutside', onDragEnd);
app.stage.addListener
parall.on('click',()=>{
  if(!parall.flag&&!parall.isRotate&&!parall.isFinish){
    parall.isRotate=true
      gsap.to(parall,0.3,{rotation:parall.rotation+45/180*Math.PI})
      parall.n++
      setTimeout(() => {
        parall.isRotate=false
      }, 300);
    }
})

function onDragStart(event) {
  offset={x:event.data.global.x-parall.x,y:event.data.global.y-parall.y}
  parall.dragging = true
}
function onDragMove(event) {
  if (parall.dragging&&!parall.isFinish) {
    parall.x = event.data.global.x -offset.x
    parall.y = event.data.global.y -offset.y
    parall.flag=true
    if(parall.x<160+targetX&&parall.x>140+targetX&&parall.y<-40+targetY&&parall.y>-60+targetY&&parall.n%4==0){
    parall.x=150+targetX
    parall.y=targetY-50
    parall.isFinish=true
    
  }
  }
}

function onDragEnd() {
  parall.dragging = false;
  if(parall.isFinish){
    m++
    parall.removeAllListeners()
  }
    if(m==7){
      alert('游戏成功')
    }
  setTimeout(() => {
    parall.flag=false
  }, 0);
}
   
this.parall=parall
 }

}


},
methods: {

},

}
</script>

<style lang="less" scoped>
.main{
    canvas{
        width: 1600px;
        height: 1000px;
        position: absolute;
        z-index: 1;
    }
    .flag{
        width: 10px;
        height: 10px;
        background-color: black;
        position: absolute;
        z-index: 10;
    }
    .num{
        position: absolute;
        left: 800px;
    }
}

</style>