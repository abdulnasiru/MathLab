import { Nebula } from "../entities/Nebula.js";
import {Star} from "../entities/Star.js";
import { ShootingStar } from "../states/ShootingStar.js";
export class Universe {
  constructor(game){
    this.game=game;
    this.stars=[];
    this.starCount=250;
    this.minDepth=300;
    this.maxDepth=4000;
    this.nebulas=[];
    this.nebulaRadius=1800;
    this.nebulaCount=5;
    this.shootingStars=[];
    this.starNearDistance=80;
    this.starFarDistance=3000;
    this.starDepthSpeed=1.5;
    this.generate();
    this.generateAroundPlayer();
    this.generateNebulas();
    for(let i=0;i<3;i++){
      this.shootingStars.push(
        new ShootingStar(this.game)
      );
    }
  }

  generate(){
    for(let i=0;i<this.starCount;i++){
      const x=Math.random()*4000-2000;
      const y=Math.random()*4000-2000;
      const size=Math.random()*2+1;
      const depth=this.minDepth+Math.random()*(this.maxDepth-this.minDepth);
      const star=new Star(x,y,size,depth);
      star.depth=depth;
      this.stars.push(star);
      star.z=this.starNearDistance+Math.random()*
      (this.starFarDistance-this.starNearDistance);
      this.stars.push(star);
    }
  }

  generateAroundPlayer(){
    if(!this.game.ship){
      return;
    }
    const ship=this.game.ship;
    for(let i=0;i<100;i++){
      const angle=Math.random()*Math.PI*2;
      const distance=1500+Math.random()*2000;
      const x=ship.position.x+Math.cos(angle)*distance;
      const y=ship.position.y+Math.sin(angle)*distance;
      const size=Math.random()*2+1;
      const depth=this.minDepth+Math.random()*(this.maxDepth-this.minDepth);
      const star=new Star(
        x,y,size,depth
      );
      star.z=this.starNearDistance+Math.random()*
      (this.starFarDistance-this.starNearDistance);
      this.stars.push(star);
    }
  }

  generateNebulas(){
    const colors=[
      "#5B6CFF", "#8A2BE2", "#00BCD4", "#FF5FCF"
    ];
    for(let i=0;i<this.nebulaCount;i++){
      this.nebulas.push(
        new Nebula(
          Math.random()*8000-4000,
          Math.random()*8000-4000,
          400+Math.random()*500,
          colors[
            Math.floor(Math.random()*colors.length)
          ], 0.05+Math.random()*0.1
        )
      );
    }
  }

  spawnNebula(){
    const angle=Math.random()*Math.PI*2;
    const distance=1200+Math.random()*600;
    const x=this.game.ship.position.x+Math.cos(angle)*distance;
    const y=this.game.ship.position.y+Math.sin(angle)*distance;
    const colors=["#5B6CFF","#8A2BE2","#00BCDA","#FF5FCF"];
    this.nebulas.push(
      new Nebula(
        x,y,250+Math.random()*300,
        colors[Math.floor(Math.random()*colors.length)],
        0.05+Math.random()*0.1
      )
    );
    this.nebulas=this.nebulas.filter(nebula=>{
      const dx=nebula.position.x-this.game.ship.position.x;
      const dy=nebula.position.y-this.game.ship.position.y;
      return (Math.hypot(dx,dy)<5000);
    });
  }

  updateNebulas(){
    let nearby=0;
    for(const nebula of this.nebulas){
      const dx=nebula.position.x-this.game.ship.position.x;
      const dy=nebula.position.y-this.game.ship.position.y;
      const distance=Math.hypot(dx,dy);
      if(distance<this.nebulaRadius){
        nearby++;
      }
    }
      if(nearby<8 ){
        this.spawnNebula();
    }
  }

  updateStarDepth(){
    if(!this.game.ship){
      return;
    }
    const ship=this.game.ship;
    const velocity=ship.velocity;
    const speed=Math.hypot(velocity.x,velocity.y);
    const forward=ship.getForwardVector();
    const forwardSpeed=velocity.x*forward.x+velocity.y*forward.y;
    const depthMovement=Math.max(0,forwardSpeed)*this.starDepthSpeed;
    const ambientMovement=0.15;
    const movement=ambientMovement+depthMovement;
    for (const star of this.stars){
      star.z-=movement;
      if(star.z<=this.starNearDistance){
        star.z=this.starFarDistance-Math.random()*500;
        const angle=Math.random()*Math.PI*2;
        const distance=1000+Math.random()*2500;
        star.position.x=ship.position.x+Math.cos(angle)*distance;
        star.position.y=ship.position.y+Math.sin(angle)*distance;
      }
    }
  }

  recycleStars(){
    if(!this.game.ship){return;}
    const ship=this.game.ship;
    const forward=ship.getForwardVector();
    const right=ship.getRightVector();
    for(const star of this.stars){
      if(star.depth>0){
        continue;
      }
      const side=(Math.random()-0.5)*3000;
      const distance=this.maxDepth;
      star.position.x=ship.position.x+forward.x*distance+right.x*side;
      star.position.y=ship.position.y+forward.y*distance+right.y*side;
      star.depth=this.maxDepth;
    }
  }

  update(){
  const camera=this.game.camera;
  this.updateStarDepth();
  for(const nebula of this.nebulas){
    nebula.update();
  }
  this.updateNebulas();
  for(const shooting of this.shootingStars){
    shooting.update();
  }
  this.recycleStars();
  for(const star of this.stars){
    const dx=star.position.x-camera.position.x;
    const dy=star.position.y-camera.position.y;
    const distance=Math.sqrt(dx*dx+dy*dy);
    if(distance>4000){
      const angle=Math.random()*Math.PI*2;
      const radius=1800+Math.random()*1000;
      star.position.x=camera.position.x+Math.cos(angle)*radius;
      star.position.y=camera.position.y+Math.sin(angle)*radius;
    }
  } 
}

render(context, camera){
  for(const nebula of this.nebulas){
  const dx=nebula.position.x-this.game.ship.position.x;
  const dy=nebula.position.y-this.game.ship.position.y;
    const distance=Math.sqrt(dx*dx+dy*dy);
    if(distance<2500){
    nebula.render(context,camera);
    }
  }
  for(const star of this.stars){
    star.render(context, camera);
  }
  for(const shooting of this.shootingStars){
    shooting.render(context);
  }
}
}