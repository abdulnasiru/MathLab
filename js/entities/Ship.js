import { GameObject } from "../engine/GameObject.js";
import {Input} from "../input/Input.js";
import { Particle } from "../effects/Particle.js";
import { Vector2 } from "../math/Vector2.js";
import { Bullet } from "./Bullet.js";
import { EngineParticle } from "./EngineParticle.js";
import { Pulse } from "./Pulse.js";

export class Ship extends GameObject{
  constructor(x,y,game){
    super(x,y);
    this.game=game;
    this.width=90;
    this.height=80;
    this.rotation=0;
    this.enginePower=0.1;
    this.rotationSpeed=0.12;
    this.maxSpeed=15;
    this.velocity=new Vector2(0,0);

    this.bank=0;
    this.targetBank=0;
    this.maxBank=Math.PI/10;
    this.bankSmoothness=0.12;

    this.acceleration=0.8;
    this.friction=0.9;
    this.thrusting=false;
    this.fireRate=15;
    this.fireCooldown=0;
    this.muzzleFlash=0;
    this.invisible=false;
    this.invisibleTimer=0;
    this.gameOver=false;
    this.thrustPower=100;
    this.life=true;
    this.respawnTimer=0;
    this.alive=true;
    this.visible=true;
    this.blinkTimer=0;
    this.pulseCooldown=0;
    this.maxPulseCooldown=300;
    this.pulseRate=300;
    this.canPulse=true;
    this.pulseEnergy=100;
    this.maxPulseEnergy=100;
    this.pulseCost=50;
    this.pulseRecharge=0.15;
    this.currentWeapon="SINGLE";

  }

  getForwardVector(){
    return new Vector2(
      Math.cos(this.rotation),Math.sin(this.rotation)
    );
  }
  getRightVector(){
    return new Vector2(
      -Math.sin(this.rotation),Math.cos(this.rotation)
    );
  }

  update(input){
    if(this.game.gameOver){
      return;
    }
    if(!this.alive){
      this.respawnTimer--;
      if(this.respawnTimer<=0){
        this.respawn();
      }
      return;
    }
    if(this.invisibleTimer>0){
        this.invisibleTimer--;
        this.blinkTimer++;
      }

      let moveX=input.moveX || 0;
      let moveY=input.moveY || 0;
      const steering=Math.max(-1,Math.min(1,moveX));

    if(input.keys["KeyA"]||input.keys["ArrowLeft"] ||
       input.touch.left || moveX<-0.2){
      this.rotation-=this.rotationSpeed;
    }

  if(input.keys["KeyD"]||input.keys["ArrowRight"] ||
     input.touch.right || moveX>0.2){
    this.rotation+=this.rotationSpeed;
  }
  this.targetBank=steering*this.maxBank;
  this.bank+=(this.targetBank-this.bank)*this.bankSmoothness;

  this.acceleration=new Vector2(0,0);
  
if(input.keys["KeyW"]||input.keys["ArrowUp"] ||
   input.touch.up || moveY<-0.2){
    const forward=this.getForwardVector();
  this.acceleration.x=forward.x*this.enginePower;
  this.acceleration.y=forward.y*this.enginePower;

  if(Math.random()<0.5){
    let particlePosition=new Vector2(
      this.position.x+Math.cos(this.rotation)*25,
      this.position.y+Math.sin(this.rotation)*25
    );
    let flame=new EngineParticle(
      particlePosition.x,
      particlePosition.y,
      this.rotation
    );
    this.game.add(flame);

    const thrustPower=0.15;
    this.velocity.x+=forward.x*thrustPower;
    this.velocity.y+=forward.y*thrustPower;
    this.position.add(this.velocity);
    this.velocity.multiply(0.99);
    
    const maxSpeed=10;
    const speed=Math.sqrt(
      this.velocity.x**2+this.velocity.y**2
    );
    
    if(speed>maxSpeed){
      this.velocity.x=(this.velocity.x/speed)*maxSpeed;
      this.velocity.y=(this.velocity.y/speed)*maxSpeed;
    }

  if(this.muzzleFlash>0){
      this.muzzleFlash--;
    }

  this.thrusting=true;
  this.createEngineParticle();
  }else{
  this.thrusting=false;
}

}  
if(this.fireCooldown>0){
  this.fireCooldown--;
}

  if(input.keys["Space"] || input.touch.fire || input.fire && 
    this.fireCooldown<=0){
      if(this.currentWeapon==="SINGLE"){
        this.firePulse();
      }
      else if(this.currentWeapon==="TWIN"){
        this.fireTwinCannons();
      }
    }
if(input.keys["KeyT"]){
  this.fireTwinCannons();
}

if(input.keys["KeyQ"] && this.fireCooldown<=0){
  this.switchWeapon();
  this.fireCooldown=20;
}

if((input.keys["KeyE"] || input.touch.pulse || input.pulse) && this.pulseCooldown<=0 && this.pulseEnergy>=this.pulseCost){
  this.createPulse();
  this.pulseEnergy-=this.pulseCost;
  this.pulseCooldown=this.pulseRate;
}
if(this.pulseCooldown>0){
  this.pulseCooldown--;
}
if(this.pulseEnergy<this.maxPulseEnergy){
  this.pulseEnergy+=this.pulseRecharge;
}

  if(this.velocity.length()>this.maxSpeed){
    this.velocity.normalize();
    this.velocity.multiply(this.maxSpeed);
  }

  if(this.fireCooldown>0){
    this.fireCooldown--;
  }

  this.lives--;
  if(this.lives>0){
    setTimeout(() => {
      this.ship.position.x=this.camera.position.x;
      this.ship.position.y=this.camera.position.y;
      this.ship.velocity.x=0;
      this.ship.velocity.y=0;
      
    }, 1500);
  }

  if(this.invisible){
    this.invisibleTimer--;
    if(this.invisibleTimer<=0){
      this.invisibleTimer=false;
    }
  }

  if(this.invisible && Math.floor(this.invisibleTimer/5)%2===0){
    return;
  }

  if(this.lives<=0){
    this.gameOver=true;
  }

  super.update();

}

respawn(){
  this.position.x=this.game.canvas.width/2;
  this.position.y=this.game.canvas.height/2;
  this.velocity.x=0;
  this.velocity.y=0;
  this.alive=true;
  this.visible=true;
  this.invisibleTimer=180;
}

createEngineParticle(){
  const forward=this.getForwardVector();
  const backward=new Vector2(-forward.x,-forward.y);
  const particleVelocity=new Vector2(
    -backward.x*3,-backward.y*3
  );
  const particlePosition=new Vector2(
    this.position.x-forward.x*25,
    this.position.y-forward.y*25
  );
  const particle=new Particle(
    particlePosition.x,
    particlePosition.y,
    particleVelocity,
    "orange"
  );
  this.game.add(particle);
}

die(){
  if(!this.alive) return;
    this.alive=false;
    this.visible=false;
    this.velocity.x=0;
    this.velocity.y=0;
    this.game.loseLife();
    return;
  }

  createPulse(){
    const pulse=new Pulse(
      this.position.x,this.position.y
    );
    this.game.add(pulse);
  }

  fireTwinCannons(){
    const forward=this.getForwardVector();
    const right=this.getRightVector();
    const leftX=this.position.x+forward.x*45-right.x*18;
    const leftY=this.position.y+forward.y*45-right.y*18;
    const rightX=this.position.x+forward.x*45+right.x*18;
    const rightY=this.position.y+forward.y*45+right.y*18;
    const leftBullet=new Bullet(leftX,leftY,this.rotation);
    const rightBullet=new Bullet(rightX,rightY,this.rotation);
    this.game.add(leftBullet);
    this.game.add(rightBullet);
    this.fireCooldown=this.fireRate;
    this.game.audio.play("laser");
  }

  firePulse(){
    const forward=this.getForwardVector();
    const bullet=new Bullet(
    this.position.x+forward.x*30,
    this.position.y+forward.y*30,
    this.rotation
    );
    this.game.add(bullet);
    this.fireCooldown=this.fireRate;
    this.game.audio.play("laser");
  }

  switchWeapon(){
    if(this.currentWeapon==="SINGLE"){
      this.currentWeapon="TWIN";
    }else{
      this.currentWeapon="SINGLE";
    }
  }


  render(context,camera){
    this.renderWrapEffect(context, camera);
    if(!this.visible) return;
    let blinking=false;
    if(this.invisibleTimer>0){
      blinking=Math.floor(this.blinkTimer/10)%2===0;
    }
    context.save();
    if(blinking){context.globalAlpha=0.3;
    }

    const screenPosition=camera.apply(this.position);
    context.translate(
      screenPosition.x,
      screenPosition.y
    );

    context.rotate(this.rotation+this.bank);

    this.renderEngine(context);
    this.renderBody(context);
    this.renderCockpit(context);
    this.renderWings(context);
    this.renderCannons(context);
    this.renderGlow(context);
    this.renderFlames(context);
    context.restore();
    if(this.thrusting){
      this.game.audio.play("thrust");
    }
    }

  renderEngine(context){
    const engineGlow=10+Math.sin(Date.now()*0.01)*4;
    context.save();
    context.shadowColor="#00ccff";
    context.shadowBlur=engineGlow;
    context.beginPath();
    context.roundRect(
      -34,-18,16,12,4
    );
    const engineGradient=context.createLinearGradient(
      -34,0,-18,0
    );
    engineGradient.addColorStop(0,"#222");
    engineGradient.addColorStop(0.5,"#777");
    engineGradient.addColorStop(1,"#cfcfcf");
    context.fillStyle=engineGradient;
    context.fill();
    context.beginPath();
    context.roundRect(
      -34,6,16,12,4
    );
    context.fillStyle=engineGradient;
    context.fill();
    context.restore();
  }

  renderBody(context){
    context.save();
    context.beginPath();
    context.moveTo(55,0);
    context.lineTo(22,-18);
    context.lineTo(-20,-20);
    context.lineTo(-38,-13);
    context.lineTo(-42,0);
    context.lineTo(-38,-13);
    context.lineTo(-20,20);
    context.lineTo(22,18);
    context.closePath();
    const bodyGradient=context.createLinearGradient(-40,-20,55,20);
    bodyGradient.addColorStop(0, "#555");
    bodyGradient.addColorStop(0.25, "#bcbcbc");
    bodyGradient.addColorStop(0.55, "#ffffff");
    bodyGradient.addColorStop(0.8,"#d8d8d8");
    bodyGradient.addColorStop(1,"#666");
    context.fillStyle=bodyGradient;
    context.shadowColor="rgba(80,200,255,0.35)";
    context.shadowBlur=10;
    context.fill();
    context.strokeStyle="rgba(255,255,255,0.7)";
    context.lineWidth=1.5;
    context.stroke();
    context.shadowBlur=0;
    context.beginPath();
    context.moveTo(-30,0);
    context.lineTo(42,0);
    context.strokeStyle="rgba(255,255,255,0.35)";
    context.lineWidth=1;
    context.stroke();
    context.beginPath();
    context.moveTo(45,0);
    context.lineTo(25,-8);
    context.strokeStyle="rgba(255,255,255,0.8)";
    context.lineWidth=2;
    context.stroke();
    context.restore();
  }

  renderCockpit(context){
    context.save();
    context.beginPath();
    context.ellipse(
      15,0,17,11,0,0,Math.PI*2
    );
    const cockpitGradient=context.createRadialGradient(10,-3,1,15,0,18);
    cockpitGradient.addColorStop(0, "#eaffff");
    cockpitGradient.addColorStop(0.35, "#69e6ff");
    cockpitGradient.addColorStop(0.75,"#168ed0")
    cockpitGradient.addColorStop(1, "#063b70");
    context.fillStyle=cockpitGradient;
    context.shadowColor="#44ddff";
    context.shadowBlur=12;
    context.fill();
    context.strokeStyle="rgba(255,255,255,0.65)";
    context.lineWidth=1.5;
    context.stroke();
    context.beginPath();
    context.ellipse(
      10,-4,4,2,-0.3,0,Math.PI*2
    );
    context.fillStyle="rgba(255,255,255,0.75)";
    context.fill();
    const pulse=(Math.sin(Date.now()*0.006)+1)/2;
    context.beginPath();
    context.arc(15,0,3+pulse*1.5,0,Math.PI*2);
    context.fillStyle=`rgba(220,255,255,${0.7+pulse*0.3})`;
    context.shadowColor="#66ffff";
    context.shadowBlur=10+pulse*8;
    context.fill();
    context.restore();
  }

  renderWings(context){
    context.save();
    context.shadowColor="#55ccff";
    context.shadowBlur=8;
    context.beginPath();
    context.moveTo(10,-12);
    context.lineTo(-12,-30);
    context.lineTo(-40,-38);
    context.lineTo(-28,-12);
    context.lineTo(5,-5);
    context.closePath();
    const wingGradient=context.createLinearGradient(-40,-35,15,-5);
    wingGradient.addColorStop(0,"#555");
    wingGradient.addColorStop(0.45,"#bfc4c8");
    wingGradient.addColorStop(1,"#eeeeee");
    context.fillStyle=wingGradient;
    context.fill();
    context.strokeStyle="#666";
    context.lineWidth=1.5;
    context.stroke();
    context.beginPath();
    context.moveTo(10,12);
    context.lineTo(-12,30);
    context.lineTo(-40,38);
    context.lineTo(-28,12);
    context.lineTo(5,5);
    const lowerGradient=context.createLinearGradient(
      -40,35,15,5
    );
    lowerGradient.addColorStop(0,"#555");
    lowerGradient.addColorStop(0.45,"#bfc4c8");
    lowerGradient.addColorStop(1,"#eeeeee");
    context.fillStyle=lowerGradient;
    context.fill();
    context.stroke();
    context.beginPath();
    context.arc(-32,-32,3.5,0,Math.PI*2);
    context.fillStyle="#00ffff";
    context.shadowColor="#00ffff";
    context.shadowBlur=12;
    context.fill();
    context.beginPath();
    context.arc(
      -32,32,3.5,0,Math.PI*2);
    context.fillStyle="#ff3030";
    context.shadowColor="#ff3030";
    context.fill();
    context.restore();
  }

  renderCannons(context){
    context.save();
    const cannonGradient=context.createLinearGradient(
      0,-10,0,10
    );
    cannonGradient.addColorStop(0,"#222");
    cannonGradient.addColorStop(0.5,"#999");
    cannonGradient.addColorStop(1,"#333");
    context.fillStyle=cannonGradient;
    context.fillRect(25,-15,18,5);
    context.fillRect(25,10,18,5);
    context.fillStyle="#00ffff";
    context.fillRect(40,-16,5,7);
    context.fillRect(40,-9,5,7);
    context.strokeStyle="#00ffff";
    context.lineWidth=1;
    context.beginPath();
    context.arc(44,-12.5,3,0,Math.PI*2);
    context.stroke();
    context.beginPath();
    context.arc(
      44,12.5,3,0,Math.PI*2
    );
    context.stroke();
    context.restore();
  }

  renderGlow(context){
    context.save();
    context.beginPath();
    context.moveTo(55,0);
    context.lineTo(22,-18);
    context.lineTo(-20,-20);
    context.lineTo(-42,0);
    context.lineTo(-20,20);
    context.lineTo(22,18);
    context.closePath();
    context.strokeStyle="rgba(100,220,255,0.7)";
    context.lineWidth=1.5;
    context.shadowColor="#44ccff";
    context.shadowBlur=14;
    context.stroke();
    context.restore();
  }

  renderFlames(context){
  if(!this.thrusting) return;
  context.save();
  const flameLength=18+Math.sin(Date.now()*0.03)*7;
  context.shadowColor="#ff9900";
  context.shadowBlur=20;
  context.beginPath();
  context.moveTo(-30,-13);
  context.lineTo(-30-flameLength,-7);
  context.lineTo(-30,-3);
  context.closePath();
  const flameGradient=context.createLinearGradient(
    -30,0,-30-flameLength,0
  );
  flameGradient.addColorStop(0,"#ffffff");
  flameGradient.addColorStop(0.35,"#ffff55");
  flameGradient.addColorStop(0.7,"#ff8a00");
  flameGradient.addColorStop(1,"rgba(255,40,0,0)");
  context.fillStyle=flameGradient;
  context.fill();
  context.beginPath();
  context.moveTo(-30,13);
  context.lineTo(-30-flameLength,7);
  context.lineTo(-30,3);
  context.closePath();
  context.fill();
  context.shadowColor="#66ffff";
  context.shadowBlur=16;
  context.fillStyle="#66ffff";
  context.beginPath();
  context.arc(-30,-8,2.5,0,Math.PI*2);
  context.fill();
  context.beginPath();
  context.arc(
    -30,8,2.5,0,Math.PI*2);
  context.fill();
  context.restore();
  }
}
