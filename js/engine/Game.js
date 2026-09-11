console.count("Game update");
import {Camera} from "./Camera.js";
import { Collision } from "./Collision.js";
import {Bullet} from "../entities/Bullet.js";
import { Asteroid } from "../entities/Asteroid.js";
import { Explosion } from "../entities/Explosion.js";
import { Ship } from "../entities/Ship.js";
import { AudioManager } from "./AudioManager.js";
import { Menu } from "../states/Menu.js";
import { Playing } from "../states/Playing.js";
import { Input } from "../input/Input.js";
import { AsteroidField } from "../world/AsteroidField.js";
import { Universe } from "../world/Universe.js";
import { GameOver } from "../states/GameOver.js";
import { TouchControls } from "../input/TouchControls.js";
import { Joystick } from "../input/Joystick.js";
import { InputManager } from "../input/InputManager.js";
import { FireButton } from "../input/FireButton.js";
import { Vector2 } from "../math/Vector2.js";
import { PulseButton } from "../input/PulseButton.js";
import { isTouchDevice } from "../utils/Device.js";
import { WeaponButton } from "../input/WeaponButton.js";

export class Game{
  constructor(canvas){
    this.canvas=canvas;
    this.mouse={
      x:0,
      y:0
    }

    canvas.addEventListener("mousemove",(e)=>{
      const rect=canvas.getBoundingClientRect();
      this.mouse.x=e.clientX-rect.left;
      this.mouse.y=e.clientY-rect.top;
    });
    canvas.addEventListener("click",()=>{
      this.clicked=true;
    });
    canvas.addEventListener("touchstart",(e)=>{
      const rect=canvas.getBoundingClientRect();
      this.mouse.x=e.tuches[0].clientX-rect.left;
      this.mouse.y=e.touches[0].clientY-rect.top;
      this.mouse.clicked=true;
    });

    this.context=canvas.getContext("2d");
    this.objects=[];
    this.camera=new Camera(canvas.width,canvas.height);
    this.running=false;
    this.universe=null;
    this.score=0;
    this.wave=1;
    this.waveStarting=false;
    this.waveMessage="";
    this.waveMessageTimer=0;
    this.lives=3;
    this.pendingObjects=[];
    this.gameOver=false;
    this.waitingForRestart=false;
    this.worldWidth=5000;
    this.worldHeight=5000;
    this.light={
      x:-1,
      y:-1
    };
    this.isTouch=isTouchDevice();

    const length=Math.hypot(this.light.x, this.light.y);
    this.light.x/=length;
    this.light.y/=length;
    this.audio=new AudioManager();
    this.audio.load("laser","assets/audio/laser.mp3");
    this.audio.load("explosion","assets/audio/explosion.mp3");
    this.audio.load("thrust","assets/audio/thrust.mp3");
    this.universe=new Universe(this);
    this.asteroidField=new AsteroidField(this);
    this.state="Menu";
    this.menu=new Menu(this);
    this.gameOverScreen=new GameOver(this);
    this.playing=new Playing(this);
    this.asteroidSpawnTimer=0;
    this.input=new Input();
    this.joystick=new Joystick();
    this.fireButton=new FireButton();
    this.pulseButton=new PulseButton();
    this.weaponButton=new WeaponButton(this.ship);
    this.touchControls=new TouchControls(this.input);
    this.inputManager=new InputManager(this,
      this.input,this.joystick,
      this.fireButton,this.pulseButton);
    this.time=0;
    
    this.touchState={
      steering:{
        active:false,
        pointerID:null,
        startX:0,
        startY:0,
        x:0,
        y:0,
        directionX:0,
        directionY:0
      }
    };

    window.addEventListener("resize",()=>{
      this.joystick.resize();
      this.fireButton.resize();
      this.pulseButton.resize();
      this.weaponButton.resize();
    });

    window.addEventListener("resize",()=>{
      this.canvas.width=window.innerWidth;
      this.canvas.height=window.innerHeight;
      if(this.menu){
        this.menu.resize();
      }
    });
    window.addEventListener("resize",()=>{
      this.camera.resize();
    });

    this.setupTouchControls();
    this.setupMouseControls();
  }

  setupTouchControls(){
    this.canvas.addEventListener(
      "touchstart",(event)=>this.onTouchStart(event),{passive:false}
    );
    this.canvas.addEventListener(
      "touchmove",(event)=>this.onTouchMove(event),{passive:false}
    );
    this.canvas.addEventListener(
      "touchcancel",(event)=>this.onTouchEnd(event)
    );

  }

  onTouchStart(event){
    event.preventDefault();
    const rect=this.canvas.getBoundingClientRect();
    for(const touch of event.changedTouches){
      const x=touch.clientX-rect.left;
      const y=touch.clientY-rect.top;
      if(this.weaponButton.containsPoint(x,y)){
        this.weaponButton.press(touch.identifier);
        return;
      }
    } 

  }
  onTouchMove(event){
    event.preventDefault();

  }

  onTouchEnd(event){
    for(const touch of this.changedTouches){
    this.weaponButton.release(touch.identifier);
    }

  }

  setupMouseControls(){
    this.canvas.addEventListener(
      "mousedown",(event)=>{
        const rect=this.canvas.getBoundingClientRect();
        const x=event.clientX-rect.left;
        const y=event.clientY-rect.top;

        if(this.weaponButton.containsPoint(x,y)){
          this.weaponButton.press("mouse");
        }
      }
    );
    this.canvas.addEventListener(
      "mouseup",()=>{
        this.weaponButton.release("mouse");
      }
    );
  }


  addScore(points){
    this.score+=points;
  }
  startGame(){
    this.score=0;
    this.gameOver=false;
    this.state="Playing";
    this.audio.playMusic("music");
  }

  add(object){
    this.objects.push(object);
  }

  start(){
    this.running=true;
    this.loop();
  }

  loop(){
    if(!this.running)
      return;
    this.update();
    this.render(this.context);
    requestAnimationFrame(
      ()=>this.loop()
    );
  }

  update(deltaTime){
    if(this.state==="Menu"){
      this.menu.update();
        return;
      }
      if(this.state === "GameOver"){
        this.gameOverScreen.update();
        return;
      }

    if(this.lives<=0){
      this.state="GameOver";
    }
    
    this.camera.update();
    if(this.universe){
      this.universe.update();
    }
    if(this.asteroidField){
      this.asteroidField.update();
    }

    for(let i=this.objects.length-1;i>=0;i--){
      let object=this.objects[i];
      object.update(this.input);

      if(object.destroyed || object.life<=0){
        this.objects.splice(i,1);
      }
      if(object instanceof Asteroid){
        this.asteroidField.removeDestroyed();
      }
    }
    this.checkPulses();
    this.inputManager.update();

    if(this.isTouch){
    this.joystick.update();
    this.fireButton.update();
    this.pulseButton.update();
    }

    if(this.waveMessageTimer>0){
      this.waveMessageTimer--;
    }

    this.checkCollisions();

    for(const object of this.pendingObjects){
      this.add(object);
    }
    this.ship.update(this.input);
    this.pendingObjects=[];
    this.asteroidSpawnTimer--;
    if(this.asteroidSpawnTimer<=0){
      this.spawnAsteroidsAroundPlayer()
      this.asteroidSpawnTimer=180;
    }
  
  }

   spawnAsteroidsAroundPlayer(){
    const player=this.ship;
    if(!player) return;
    const distance=1000;
    for(let i=0;i<10;i++){
      const angle=Math.random()*Math.PI*2;
      const x=player.position.x+Math.cos(angle)*distance;
      const y=player.position.y+Math.sin(angle)*distance;
      const size=20+Math.random()*60;
      const asteroid=new Asteroid(x,y, size);
      this.add(asteroid);
    }
  }
      
    checkCollisions(){
      for(let i=0;i<this.objects.length;i++){
        for(let j=i+1;j<this.objects.length;j++){
          const a=this.objects[i];
          const b=this.objects[j];

          if(a.destroyed || b.destroyed)
            continue;
          if(!a.visible || !b.visible)
            continue;
          if(!Collision.check(a,b))
            continue;

          let bullet=null;
          let asteroid=null;
          if(a instanceof Bullet && b instanceof Asteroid){
            bullet=a;
            asteroid=b;
          }
          else if(a instanceof Asteroid && b instanceof Bullet){
            bullet=b;
            asteroid=a;
          }

          if(bullet && asteroid && Collision.check(bullet,asteroid)){
            if(asteroid.size>1){
              for(let i=0;i<2;i++){
                let child=new Asteroid(
                  asteroid.position.x+Math.random()*20-10,
                  asteroid.position.y+Math.random()*20-10,
                  asteroid.size/2
                );
              this.pendingObjects.push(child);
              }
            }
            new Explosion(
              asteroid.position.x,
              asteroid.position.y,
              this
            );
            bullet.destroyed=true;
            this.addScore(asteroid.scoreValue);
            asteroid.takeDamage();
            this.audio.play("explosion");
          }

          if(!this.waveStarting && this.getAsteroidCount() === 0){
            this.startNextWave();
          }

          if(
            a instanceof Ship &&
            b instanceof Asteroid &&
            Collision.check(a,b) && 
            a.invisibleTimer<=0
            
          ){
            if(a.alive){
            a.die();
            this.audio.play("explosion");
            }
            continue;
          }

          if(
            a instanceof Asteroid &&
            b instanceof Ship &&
            Collision.check(a,b) && 
            a.invisibleTimer<=0
            
          ){
            if(b.alive){
            b.die();
            this.audio.play("explosion");
          }
          continue;
          }
      }
      }
      this.objects=this.objects.filter(object=>{
        if(object.destroyed){
          return false;
        }
        if(object.life!==undefined && object.life<=0){
          return false;
          }
          return true;
        
      });    
  }

  loseLife(){
    if(this.gameOver) return;
    this.lives--;
    if(this.lives<=0){
      this.lives=0;
      this.gameOver=true;
      this.state="GameOver";
      return;
    }
      this.ship.respawn();
  }

  restart(){
    this.state="Playing";
    this.gameOver=false;
    this.lives=3;
    this.score=0;
    this.objects=[];
    const ship=new Ship(
    this.canvas.width/2,
    this.canvas.height/2,
    this
);
   this.ship=ship;
   this.weaponButton.ship=ship;
   this.add(ship);
   this.camera.follow(ship);
   this.asteroidField=new AsteroidField(this);

  }

  split(){
        if(this.size>20){
           return[
            new Asteroid(
              this.position.x,
              this.position.y,
              this.size/2
             ),
            new Asteroid(
              this.position.x,
              this.position.y,
              this.size/2
            )
           ];
        }
         return[];
      }

  getAsteroidCount(){
            return this.objects.filter(
              object=>object instanceof Asteroid
            ).length;
          }

  startNextWave(){
   this.waveStarting=true;
   this.wave++;
   setTimeout(()=>{
   this.spawnWave();
   this.waveStarting=false;
   },1500);
   this.waveMessage=`WAVE ${this.wave}`;
   this.waveMessageTimer=120;
  }

  spawnWave(){
  const spawn=this.getSpawnPosition();
   const asteroid=new Asteroid(
   spawn.x,
   spawn.y
   );
   this.add(asteroid);
   }

  getSpawnPosition(){
  const margin=300;
  const side=Math.floor(Math.random()*4);
  const camera=this.camera.position;
  switch(side){
  case 0:
  return{
  x:camera.x+(Math.random()-0.5)*1200,
  y:camera.y-margin
  };
  case 1:
  return{
  x:camera.x+800+margin,
  y:camera.y+(Math.random()-0.5)*800
  };
  case 2:
  return{
  x:camera.x+(Math.random()-0.5)*1200,
  y:camera.y+600+margin
  };
  default:
  return{
  x:camera.x-margin,
  y:camera.y+(Math.random()-0.5)*800
  };
  }
  }

  renderBackground(context){
    const gradient=context.createRadialGradient(
      this.canvas.width/2,
      this.canvas.height/2,
      100,
      this.canvas.width/2,
      this.canvas.height/2,
      this.canvas.width

    );
    gradient.addColorStop(0,"#102040");
    gradient.addColorStop(0.5,"#08111f");
    gradient.addColorStop(1,"#000000");
    context.fillStyle=gradient;
    context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  checkPulses(){
    const pulses=this.objects.filter(obj=>obj.constructor.name==="Pulse");
    const asteroids=this.objects.filter(obj=>obj.constructor.name==="Asteroid");
    for(const pulse of pulses){
      for(const asteroid of asteroids){
        const dx=asteroid.position.x-pulse.position.x;
        const dy=asteroid.position.y-pulse.position.y;
        const distance=Math.sqrt(dx*dx+dy*dy);
        if(distance<pulse.radius && !pulse.hitObjects.has(asteroid)){
          const direction=new Vector2(dx,dy);
          direction.normalize();
          asteroid.velocity.x+=direction.x*pulse.force;
          asteroid.velocity.y+=direction.y*pulse.force;
          pulse.hitObjects.add(asteroid);
        }
      }
    }
  }

  drawUI(context){
    let formattedScore=String(this.score).padStart(6,"0");
    let size=window.innerWidth<600?20:24;
    context.save();
    context.fillStyle="white";
    context.font=`${size}px Arial`;
    context.textAlign="center";
    context.fillText(
      `SCORE  ${this.score}`.padStart(6,"0"),100,60
    );
    context.restore();
  }

  drawPulse(context,ship){
    const width=150;
    const height=15;
    const x=30;
    const y=140;
    let pulseSize=window.innerWidth<600?16:20;
    context.fillStyle="rgba(255,255,255,0.2)";
    context.fillRect(
      x,y,width,height
    );
    let glow=Math.sin(this.time)*10+20;
    context.shadowBlur=glow;
    context.shadowColor="#00ffff";
    context.fillStyle="#00ffff";
    context.fillRect(
      x,y,width*(this.ship.pulseEnergy/this.ship.maxPulseEnergy),
      height
    );
    let readySize=window.innerWidth<600?10:12;
    context.fillStyle="white";
    context.font=`${readySize}px Arial`;
    let status=(this.ship.pulseEnergy/this.ship.maxPulseEnergy)>0.9?" READY":" CHARGING";
    
    context.fillText(
      status,200,157
    );
  }

  render(context,camera){
    if(this.state === "Menu"){
    this.menu.render(context);
    return;
    }
    this.time+=0.05;
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    if(this.state === "GameOver"){
      this.gameOverScreen.render(context);
      return;
    }
  this.renderBackground(context);
  this.universe.render(this.context,this.camera);

    for(const object of this.objects){
      if(object.visible){
      object.render(
        this.context,
        this.camera
      );
    }
  }

  if(this.isTouch){
  this.joystick.render(this.context);
  this.fireButton.render(this.context);
  this.pulseButton.render(this.context);
  this.weaponButton.render(this.context);
  }

  if(this.waveMessageTimer>0){
    let hudSize=window.innerWidth<600?24:40;
    context.save();
    context.font=`${hudSize}px Arial`;
    context.textAlign="center";
    context.fillStyle="white";
    context.fillText(
      this.waveMessage,
      this.canvas.width/2,
      context.height/2
    );
  }

  context.save();
  context.fillStyle="rgba(0,20,50,0.45)";
  context.roundRect(20,20,260,160,20);
  context.fill();

  this.drawUI(context);

  if(this.gameOver){
    context.save();
    context.fillStyle="rgba(0,0,0,0.65)";
    context.fillRect(
      0,0,this.canvas.width,
      this.canvas.height
    );

  context.font="20px Arial";
    context.fillText(
      "SCORE: "+this.score,
      this.canvas.width/2,
      this.canvas.height/2+10
    );
  }

  let livesSize=window.innerWidth<600?24:28;
  context.font=`${livesSize}px Arial`;
  for(let i=0;i<this.lives;i++){
    context.fillStyle="#ff3030";
    context.beginPath();
    context.arc(
      45+i*45,90,
      10,0,Math.PI*2
    );
    context.fill();
  }

  this.drawPulse(context);
  context.font="14px Arial";
  context.fillText("WEAPON: "+this.ship.currentWeapon,30,30);

  context.shadowBlur=0;

  context.restore();
  }
}