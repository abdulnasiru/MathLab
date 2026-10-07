import { GameObject } from "../engine/GameObject.js";
import { Vector2 } from "../math/Vector2.js";
export class Star extends GameObject{
  constructor(x,y,size=2,depth=1,ship,colors=["#FFFFFF","#FFE9A3","#A8D8FF","#FFD6F5","#FFF4CC"]){
    super(x,y);
    this.ship=ship;
    this.depth=depth;
    this.z=500+Math.random()*2500;
    this.size=size;
    this.radius=size;
    this.color=colors[Math.floor(Math.random()*colors.length)];
    this.speed=this.depth*8+1;
    this.opacity=this.depth;
    this.horizontalSpeed=(Math.random()-0.5)*this.depth;
    this.brightness=Math.random();
    this.twinkle=0.01+Math.random()*0.02;
    this.twinkleSpeed=Math.random()*0.05+0.01;
    this.twinkleOffset=Math.random()*Math.PI*2;
    this.position=new Vector2(x,y);
    this.type=Math.random();
  }

  update(){
  }

  render(context,camera){
    const focalLength=500;
    const perspective=focalLength/(focalLength+this.z);
    const relativeX=this.position.x-camera.position.x;
    const relativeY=this.position.y-camera.position.y;
    const screenX=relativeX*perspective+camera.width/2;
    const screenY=relativeY*perspective+camera.height/2;
    const projectedSize=Math.max(0.3,this.size*perspective);
    if(this.z<=1){
      return;
    }
      //const screenPosition=camera.apply(this.position, this.depth);
      context.save();
      context.translate(
        screenX,screenY
      );
      this.brightness+=Math.sin(performance.now()*this.twinkleSpeed+this.twinkleOffset)*this.twinkle;
      this.brightness=Math.max(0.3,Math.min(1,this.brightness));
      const glowRadius=Math.max(1,projectedSize*4);
      context.beginPath();
      const glow=context.createRadialGradient(
        0, 0, 0, 0,0,glowRadius
      );

       glow.addColorStop(0,this.color);
      glow.addColorStop(1,"transparent");
      context.shadowBlur=10*perspective;
      context.shadowColor=this.color;
      context.fillStyle=glow;
      context.globalAlpha=this.brightness*this.opacity;
      context.beginPath();
      context.arc(
        0,0,glowRadius,0,Math.PI*2
      );
      context.fill();
      context.globalAlpha=this.opacity;
      context.fillStyle=this.color;
      context.shadowBlur=0;
      
      if(this.type<0.2){
        context.beginPath();
        context.arc(
          0,0,projectedSize,0,Math.PI*2
        );
        context.fill();
      }else{
      context.rotate(Math.PI/4);
       context.beginPath();
      context.moveTo(0,-projectedSize*2);
      context.lineTo(projectedSize*0.5,0);
      context.lineTo(0,projectedSize*2);
      context.lineTo(-projectedSize*0.5,0);
      context.closePath();
      context.fill();
      } 
    context.globalAlpha=1;
    context.restore();
  }
}