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
    this.width=50;
    this.height=70;
    this.rotation=-Math.PI/2;
    this.enginePower=0.1;
    this.rotationSpeed=0.12;
    this.maxSpeed=15;
    this.velocity=new Vector2(0,0);
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

    if(input.keys["KeyA"]||input.keys["ArrowLeft"] || input.touch.left || moveX<-0.2){
      this.rotation-=this.rotationSpeed;
    }

  if(input.keys["KeyD"]||input.keys["ArrowRight"] || input.touch.right || moveX>0.2){
    this.rotation+=this.rotationSpeed;
  }


  this.acceleration=new Vector2(0,0);
  
if(input.keys["KeyW"]||input.keys["ArrowUp"] || input.touch.up || moveY<-0.2){
  this.acceleration.x=Math.cos(this.rotation)*this.enginePower;
  this.acceleration.y=Math.sin(this.rotation)*this.enginePower;

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

      let moveX=input.moveX;
      let moveY=input.moveY;

    const thrustPower=0.15;
    this.velocity.x+=Math.cos(this.rotation)*thrustPower;
    this.velocity.y+=Math.sin(this.rotation)*thrustPower;
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
  let backward=this.rotation+Math.PI;
  let particleVelocity=new Vector2(
    Math.cos(backward)*3,
    Math.sin(backward)*3
  );

  let particlePosition=new Vector2(
    this.position.x-Math.cos(this.rotation)*25,
    this.position.y-Math.sin(this.rotation)*25
  );

  let particle=new Particle(
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
    const leftX=this.position.x-18;
    const rightX=this.position.x+18;
    const cannonY=this.position.y-50;
    const leftBullet=new Bullet(leftX,cannonY,this.rotation);
    const rightBullet=new Bullet(rightX,cannonY,this.rotation);
    this.game.add(leftBullet);
    this.game.add(rightBullet);
    this.fireCooldown=this.fireRate;
    this.game.audio.play("laser");
  }

  firePulse(){
    const bullet=new Bullet(
    this.position.x+Math.cos(this.rotation)*30,
    this.position.y+Math.sin(this.rotation)*30,
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
      blinking=Math.floor(this.blinkTimer/10)%2 === 0;
    }
    context.save();
    if(blinking){context.globalAlpha=0.3;
    }

    const screenPosition=camera.apply(this.position);

    context.translate(
      screenPosition.x,
      screenPosition.y
    );

    context.rotate(this.rotation+Math.PI/2);

    this.renderEngine(context);
    this.renderBody(context);
    this.renderCockpit(context);
    this.renderWings(context);
    this.renderCannons(context);
    this.renderGlow(context);
    this.renderFlames(context);

    context.restore();


    if(this.thrusting){
      this.velocity.x*=0.99;
      this.velocity.y*=0.99;
      this.game.audio.play("thrust");
    }

      const flame=20+Math.sin(performance.now()*0.03)*6;
      context.beginPath();
      context.moveTo(-6,20);
      context.lineTo(0,flame+20);
      context.lineTo(6,20);
      context.closePath();
      context.fillStyle="orange";
      context.fill();
    }

  renderEngine(context){
    context.shadowColor="#00ccff";
    context.shadowBlur=15;
    context.beginPath();
    context.moveTo(-6,16);
    context.lineTo(6,16);
    context.lineTo(4,22);
    context.lineTo(-4,22);
    context.fillStyle="#555";
    context.closePath();
    context.fill();
    context.shadowBlur=0;
  }

  renderBody(context){
    context.beginPath();
    context.moveTo(0,-80);
    context.lineTo(25,25);
    context.lineTo(12,16);
    context.lineTo(0,30);
    context.lineTo(-12,16);
    context.lineTo(-25,25);
    context.closePath();
    const bodyGradient=context.createLinearGradient(-20,0,20,0);
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.45, "#d8d8d8");
    bodyGradient.addColorStop(0.7, "#808080");
    bodyGradient.addColorStop(1,"#4f4f4f");
    context.fillStyle=bodyGradient;
    context.strokeStyle="rgba(255,255,255,0.7)";
    context.lineWidth=1;
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-8,-15);
    context.lineTo(-3,18);
    context.strokeStyle="rgba(255,255,255,0.8)";
    context.lineWidth=2;
    context.stroke();
    context.beginPath();
    context.moveTo(10,-60);
    context.lineTo(10,18);
    context.strokeStyle="rgba(0,0,0,0.25)";
    context.lineWidth=2;
    context.stroke();
    context.beginPath();
    context.arc(0,-76,2,0,Math.PI*2);
    context.fillStyle="white";
    context.shadowBlur=10;
    context.shadowColor="white";
    context.fill();
    context.shadowBlur=0;
  }

  renderCockpit(context){
    context.beginPath();
    context.ellipse(
      0,-10,8,14,0,0,Math.PI*2
    );
    const cockpitGradient=context.createRadialGradient(0,-10,1,0,-10,10);
    cockpitGradient.addColorStop(0, "#dff8ff");
    cockpitGradient.addColorStop(0.4, "#6fd7ff");
    cockpitGradient.addColorStop(1, "#0b6db0");
    context.fillStyle=cockpitGradient;
    context.fill();
    context.strokeStyle="rgba(255,255,255,0.45)";
    context.lineWidth=1.5;
    context.stroke();
    context.beginPath();
    context.ellipse(
      -2,-15,2,6,Math.PI/6,0,Math.PI*2
    );
    context.fillStyle="rgba(255,255,255,0.65)";
    context.fill();
    context.beginPath();
    context.arc(0,-10,3,0,Math.PI*2);
    context.shadowBlur=12,
    context.shadowColor="#66ffff"
    context.fillStyle="#bbffff";
    context.fill();
    context.shadowBlur=0;
    const pulse=(Math.sin(Date.now()*0.006)+1)/2;
    context.shadowBlur=8+pulse*10;
    context.fillStyle=`rgba(220,255,255,${0.7+pulse*0.3})`;
    const scan=Math.sin(Date.now()*0.01)*5;
    context.beginPath();
    context.moveTo(-5,-10+scan);
    context.lineTo(5,-10+scan);
    context.strokeStyle="rgba(120,255,255,0.45)";
    context.lineWidth=1;
    context.stroke();
    context.beginPath();
    context.arc(
      -2,-3,0.8,0,Math.PI*2
    );
    context.fillStyle="#00ff66";
    context.fill();
    context.beginPath();
    context.arc(
      2,-3,0.8,0,Math.PI*2

    );
    context.fillStyle="#ff4444";
    context.fill();
  }


  renderWings(context){
    context.shadowBlur=12;
    context.beginPath();
    context.moveTo(-18,8);
    context.lineTo(-45,28);
    context.lineTo(-32,34);
    context.lineTo(-10,18);
    context.closePath();
    context.strokeStyle="#555";
    context.lineWidth=2;
    context.stroke();
    const wingGradient=context.createLinearGradient(-45,0,-10,0);
    wingGradient.addColorStop(0,"#555");
    wingGradient.addColorStop(0.5,"#cfcfcf");
    wingGradient.addColorStop(1,"#666");
    context.fillStyle=wingGradient;
    context.fill();
    context.fillStyle="red";
    context.beginPath();
    context.arc(-38,20,4,0,Math.PI*2);
    context.fill();

    context.beginPath();
    context.moveTo(18,8);
    context.lineTo(45,28);
    context.lineTo(32,34);
    context.lineTo(10,18);
    context.closePath();
    context.strokeStyle="#555";
    context.lineWidth=2;
    context.stroke();
    context.fillStyle=wingGradient;
    context.fill();
    context.fillStyle="cyan";
    context.beginPath();
    context.arc(38,20,4,0,Math.PI*2);
    context.fill();
    context.strokeStyle="#444";
    context.lineWidth=1;
    context.beginPath();
    context.moveTo(-18,14);
    context.lineTo(-37,27);
    context.stroke();
    context.shadowBlur=0;
  }

  renderCannons(context){
    context.fillStyle="#666";
    context.fillRect(-21,-42,7,26);
    context.fillRect(14,-42,7,26);
    context.fillStyle="#111";
    context.fillRect(-15,-48,5,8);
    context.fillRect(15,-48,5,8);
    context.beginPath();
    context.arc(-18,-48,3,0,Math.PI*2);
    context.strokeStyle="#00ffff";
    context.lineWidth=1;
    context.stroke();
    if(this.thrusting){
      context.shadowBlur=10;
      context.shadowColor="#00ffff";
    }
    context.fill();
    context.shadowBlur=0;
    
  }

  renderGlow(context){
    context.shadowBlur=15;
    context.shadowColor="#55aaff";
    context.strokeStyle="#88ddff";
    context.lineWidth=2;
    context.stroke();
    context.shadowBlur=0;
  }

  renderFlames(context){
  if(!this.thrusting) return;

  context.shadowBlur=20;
  context.shadowColor="orange";
  context.beginPath();
  context.moveTo(-4,26);
  const flameLength=18+Math.sin(Date.now()*0.03)*5;
  context.lineTo(0,26+flameLength);
  context.lineTo(4,26);
  context.closePath();
  const flameGradient=context.createLinearGradient(
    0,26,0,26+flameLength
  );
  flameGradient.addColorStop(0,"#ffff99");
  flameGradient.addColorStop(0.4,"orange");
  flameGradient.addColorStop(1,"red");
  context.fillStyle=flameGradient;
  context.fill();
  context.beginPath();
  context.moveTo(-2,26);
  context.lineTo(0,26+flameLength*0.75);
  context.lineTo(2,26);
  context.closePath();
  context.fillStyle="#66ffff";
  context.shadowBlur=18;
  context.shadowColor="#44ffff";
  context.fill();
  context.beginPath();
  context.arc(0,28,2,0,Math.PI*2);
  context.fillStyle="white";
  const pulseGlow=18+Math.sin(Date.now()*0.015)*8;
  context.shadowBlur=pulseGlow;
  context.shadowColor="white";
  context.fill();
  context.beginPath();
  context.moveTo(-7,25);
  context.lineTo(-12,29);
  context.lineTo(-7,31);
  context.fillStyle="rgba(0,255,255,0.4)";
  context.fill();
  context.beginPath();
  context.moveTo(7,25);
  context.lineTo(12,29);
  context.lineTo(7,31);
  context.fillStyle="rgba(0,255,255,0.4)";
  context.fill();
  context.shadowBlur=0;
  }
}
