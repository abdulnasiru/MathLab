import { GameObject } from "../engine/GameObject.js";
import { Vector2 } from "../math/Vector2.js";
export class Asteroid extends GameObject{
  constructor(x,y,size=20){
    super(x,y);
    this.size=size;
    this.mass=size/10;
    this.rotation=Math.random()*Math.PI*2;
    this.rotationSpeed=(Math.random()-0.5)*0.05;
    let speed=5+Math.random()*3;
    let angle=Math.random()*Math.PI*2;
    this.velocity=new Vector2(
      Math.cos(angle)*speed,
      Math.sin(angle)*speed
    );
    this.points=[];
    this.createShape();
    this.wobble=Math.random()*Math.PI*2;
    this.radius=this.size;
    this.health=Math.ceil(size/20);
    this.scoreValue=this.size*100;
    this.hitTimer=0;
    this.craters=[];
    for(let i=0;i<8;i++){
      this.craters.push({
        x:(Math.random()-0.5)*this.radius*1.5,
        y:(Math.random()-0.5)*this.radius*1.5,
        radius:Math.random()*this.radius*0.15+2
      });
    }
    this.generateCraters();
    this.surfacePoints=[];
    for(let i=0;i<50;i++){
      this.surfacePoints.push(
        {x:(Math.random()-0.5)*this.radius*2,
          y:(Math.random()-0.5)*this.radius*2,
          size:Math.random()*2
        }
      );
    }
    this.cracks=[];
    this.generateCracks();
    this.speckles=[];
    for(let i=0;i<this.radius*3;i++){
      const angle=Math.random()*Math.PI*2;
      const distance=Math.random()*this.radius*0.9;
      this.speckles.push({
        x:Math.cos(angle)*distance,
        y:Math.sin(angle)*distance,
        radius:Math.random()*1.5
      });
    }
  }

  createShape(){
    const vertices=16;
    for(let i=0;i<vertices;i++){
      const angle=(Math.PI*2/vertices)*i;
      const radius=this.size*(0.7+Math.random()*0.4);
      this.points.push({
        x:Math.cos(angle)*radius,
        y:Math.sin(angle)*radius
      });
    }
  }

    generateCraters(){
      const amount=Math.floor(this.radius/3);
      for(let i=0;i<amount;i++){
        const angle=Math.random()*Math.PI*2;
        const distance=Math.random()*this.radius*0.7;
        this.craters.push({
          x:Math.cos(angle)*distance,
          y:Math.sin(angle)*distance,
          radius:Math.random()*this.radius*0.12+2
        });
      }
    }

  takeDamage(){
    this.health--;
    this.hitTimer=10;
    if(this.health<=0){
      this.destroyed=true;
    }
  }

  generateCracks(){
    const amount=Math.floor(this.radius/8);
    for(let i=0;i<amount;i++){
      const startAngle=Math.random()*Math.PI*2;
      const length=Math.random()*this.radius*0.4+this.radius*0.15;
      const segments=3+Math.floor(Math.random()*4);
      this.cracks.push({
        startAngle, segments
      });
    }
  }

  drawAsteroidPath(){
    context.beginPath();
    this.points.forEach((point, index)=>{
      const x=Math.cos(point.angle)*point.distance;
      const y=Math.sin(point.angle)*point.distance;
      if(index===0){
        context.moveTo(x,y);
      }else{
        context.lineTo(x,y);
      }
    });
    context.closePath();
  }

  update(){
    this.position.add(this.velocity);
    this.rotation+=this.rotationSpeed;
    if(this.hitTimer){
      this.hitTimer--;
    }
     
  }

  render(context,camera){
    this.renderWrapEffect(context, camera);
    const screen=camera.apply(this.position);
    context.save();
    context.translate(
      screen.x,
      screen.y
    );

    context.rotate(
      this.rotation
    );

    for(const crater of this.craters){
      context.beginPath();
      context.arc(
        crater.x,
        crater.y,
        crater.radius,
        0,Math.PI*2
      );
      context.fillStyle="rgba(20,20,20,0.45)";
      context.fill();
      context.beginPath();
      context.arc(
        -this.radius*0.35,
        -this.radius*0.35,
        this.radius*0.45,
        0,Math.PI*2
      );
      context.fillStyle="rgba(255,255,255,0.12)";
      context.fill();
    }
      context.fillStyle="rgba(0,0,0,0.18)";
      for(const p of this.surfacePoints){
        context.beginPath();
        context.arc(
          p.x,p.y,
          p.size,0,
          Math.PI*2
        );
      }

if(this.size>=20){
    this.scoreValue=10;
  }
  else if(this.size>=10){
    this.scoreValue=20;
  }
  else{this.scoreValue=30;}

    context.beginPath();
    for(let i=0;i<this.points.length;i++){
      const point=this.points[i];
      if(i===0){
        context.moveTo(
          point.x,
          point.y
        );
      }else{
        context.lineTo(
          point.x,
          point.y
        );
      } 
    }
    const gradient=context.createRadialGradient(
      -this.radius*0.4,
      -this.radius*0.4,
      this.radius*0.15,
      0,0,
      this.radius
    );
    gradient.addColorStop(0,"#d7d7d7");
    gradient.addColorStop(0.25, "#b0b0b0");
    gradient.addColorStop(0.55, "#777");
    gradient.addColorStop(0.85,"#444");
    gradient.addColorStop(1, "#1a1a1a");
    context.fillStyle=gradient;
    context.fill();
    context.beginPath();
    context.strokeStyle="rgba(255,255,255,0.03)";
    context.lineWidth=3;
    context.stroke();
    context.closePath();

    context.strokeStyle="rgba(30,30,30,0.55)";
    context.lineWidth=1.5;
    for(const crack of this.cracks){
      let angle=crack.startAngle;
      let distance=this.radius*0.15;
      context.beginPath();
      let x=Math.cos(angle)*distance;
      let y=Math.sin(angle)*distance;
      context.moveTo(x,y);
      for(let i=0;i<crack.segments;i++){
        angle+=crack.length/crack.segments;
        x=Math.cos(angle)*distance;
        y:Math.sin(angle)*distance;
        context.lineTo(x,y);
      }
      context.stroke();
      context.strokeStyle="rgba(255,255,255,0.08)";
      context.lineWidth=0.5;
      context.stroke();
    }

    context.fillStyle="rgba(255,255,255,0.08)";
    for(const dot of this.speckles){
      context.beginPath();
      context.arc(
        dot.x, dot.y, 
        dot.radius,0,
        Math.PI*2
      );
      context.fill();
    }

    if(this.hitTimer>0){
      context.strokeStyle="#b8b8b8";
    }else{
    context.strokeStyle="rgba(255,255,255,0.05)";
    context.fill();
    }
    context.lineWidth=2;
    context.stroke();

    context.restore();
  }

}