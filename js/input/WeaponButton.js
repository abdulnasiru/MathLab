export class WeaponButton{
  constructor(ship){
    this.ship=ship;
    this.pressed=false;
    this.pulse=0;
    this.weaponButtonX=0;
    this.weaponButtonY=0;
    this.touchId=null;
    this.resize();
    this.setupControls();
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  containsPoint(x,y){
    const distance=Math.hypot(
      x-this.weaponButtonX,
      y-this.weaponButtonY
    );
    return distance<=this.radius*1.5;
  }

  press(id){
    if(this.pressed) return;
    this.pressed=true;
    this.touchId=id;
    this.ship.switchWeapon();
  }

  release(id){
    if(this.touchId===id){
    this.pressed=false;
    this.touchId=null;
    }
  }

  setupControls(){
    const canvas=document.querySelector("canvas");
    if(!canvas) return;
    canvas.addEventListener("mousedown",(event)=>{
      const rect=canvas.getBoundingClientRect();
      const x=event.clientX-rect.left;
      const y=event.clientY-rect.top;
      if(this.containsPoint(x,y)){
        this.press("mouse");
      }
    });
    window.addEventListener("mouseup",()=>{
      this.release("mouse");
    });
    canvas.addEventListener("touchstart",(event)=>{
      if(this.touchId!==null) return;
      const rect=canvas.getBoundingClientRect();
      for(const touch of event.changedTouches){
        const x=touch.clientX-rect.left;
        const y=touch.clientY-rect.top;
        if(this.containsPoint(x,y)){
          event.preventDefault();
          this.press(touch.identifier);
          break;
        }
      }
    },{passive:false});
    window.addEventListener("touchend",(event)=>{
      for(const touch of event.changedTouches){
        if(this.touchId===touch.identifier){
          event.preventDefault();
          this.release(touch.identifier);
          break;
        }
      }
    },{passive:true});
    canvas.addEventListener("touchcancel",(event)=>{
      for(const touch of event.changedTouches){
        if(this.touchId===touch.identifier){
          this.release(touch.identifier);
          break;
        }
      }
    },{passive:true});   
  }

  resize(){
    const width=window.innerWidth;
    const height=window.innerHeight;
    const scale=Math.min(width/300,1.4);
    this.radius=20*scale;
    const bottomOffset=width<600?100:40;
    this.weaponButtonX=width-this.radius-40;
    this.weaponButtonY=height-bottomOffset-this.radius*2-35;
  }

  drawBullet(context,x,y,scale){
    context.save();
    context.translate(x,y);
    context.scale(scale,scale);
    context.shadowColor="#00DFFF";
    context.shadowBlur=this.pressed?13:5;
    const tipGradient=context.createLinearGradient(
      -5,-19,5,-8
    );
    tipGradient.addColorStop(0,"#FFF0B5");
    tipGradient.addColorStop(0.35,"#DDA04A");
    tipGradient.addColorStop(1,"#8C4A21");
    context.beginPath();
    context.moveTo(0,-21);
    context.quadraticCurveTo(5,-17,5,-11);
    context.lineTo(-5,-11);
    context.quadraticCurveTo(-5,-17,0,-21);
    context.closePath();
    context.fillStyle=tipGradient;
    context.fill();
    const bodyGradient=context.createLinearGradient(
      -6,0,6,0
    );
    bodyGradient.addColorStop(0,"#4B657B");
    bodyGradient.addColorStop(0.22,"#C8E2EE");
    bodyGradient.addColorStop(0.45,"#F5FBFF");
    bodyGradient.addColorStop(0.72,"#91B5C8");
    bodyGradient.addColorStop(1,"#354F68");
    context.beginPath();
    context.moveTo(-5,-10);
    context.lineTo(5,-10);
    context.lineTo(5,12);
    context.lineTo(3,16);
    context.lineTo(-3,16);
    context.lineTo(-5,12);
    context.closePath();
    context.fillStyle=bodyGradient;
    context.fill();
    context.shadowBlur=0;
    context.fillStyle="#587A91";
    context.fillRect(-5,3,10,2);
    context.strokeStyle="rgba(255,255,255,0.85)";
    context.lineWidth=1.2;
    context.beginPath();
    context.moveTo(-2.5,-8);
    context.lineTo(-2.5,10);
    context.stroke();
    context.strokeStyle="#00E5FF";
    context.lineWidth=1.2;
    context.beginPath();
    context.moveTo(-4,12);
    context.lineTo(4,12);
    context.stroke();
    context.restore();
  }

  render(context){
    this.pulse+=0.045;
    const x=this.weaponButtonX;
    const y=this.weaponButtonY;
    const radius=this.radius;
    const active=this.ship.currentWeapon==="TWIN";
    const scale=Math.min(window.innerWidth/400,1.4);

    context.save();
    const bulletScale=0.8*scale;
    const separation=7*scale;
    context.shadowColor=active?"#00eaff":"rgba(180,200,220,0.6)";
    context.shadowBlur=active?18:10;
    if(active){
      this.drawBullet(context,x-separation,y,bulletScale);
      this.drawBullet(context,x+separation,y,bulletScale);
    }
    else{
      this.drawBullet(context,x,y,bulletScale);
    }
    context.shadowBlur=0;
    context.fillStyle=active?"#00E5FF":"#B7C7D8";
    context.beginPath();
    context.arc(x,y+this.radius+7,2.5,0,Math.PI*2);
    context.fill();

    context.restore();
  }
}