import { Vector2 } from "../math/Vector2.js";
export class Camera{
  constructor(game,width,height){
    this.game=game;
    this.position=new Vector2(0,0);
    this.width=window.innerWidth;
    this.height=window.innerHeight;
    this.target=null;
    this.smoothness=0.08;
    this.lookAheadStrength=30;
    this.shakeStrength=0;
    this.shakeDuration=0;
    this.offset=new Vector2(0,0);
    this.deadZone=100;
    this.focalLength=700;
    this.resize();
  }

  follow(object){
    this.target=object;
  }

  resize(){
    this.width=window.innerWidth;
    this.height=window.innerHeight;
  }

  update(){
    if(this.target){
      let lookAheadX=this.target.velocity.x*this.lookAheadStrength;
      let lookAheadY=this.target.velocity.y*this.lookAheadStrength;
      const targetX=this.target.position.x+lookAheadX-this.width/2;
      const targetY=this.target.position.y+lookAheadY-this.height/2;
      this.position.x+=(targetX-this.position.x)*this.smoothness;
      this.position.y+=(targetY-this.position.y)*this.smoothness;
    }

    if(this.shakeDuration>0){
      this.offset.x=(Math.random()-0.5)*this.shakeStrength;
      this.offset.y=(Math.random()-0.5)*this.shakeStrength;
      this.shakeDuration--;
    }else{
      this.offset.x=0;
      this.offset.y=0;
    }
  }
  
  apply(position, depth=1){
    return {
      x:position.x-this.position.x*depth+this.offset.x,
      y:position.y-this.position.y*depth+this.offset.y
    };
  }

  project(position,depth=1){
    const perspective=this.focalLength/(this.focalLength+depth);
    return{
      x:(position.x-this.position.x)*perspective+
      this.width/2+this.offset.x,
      y:(position.y-this.position.y)*perspective+
      this.width/2+this.offset.y,
      scale:perspective
    };
  }

  shake(power,frames){
    this.shakeStrength=power;
    this.shakeDuration=frames;
  }
}