export class WeaponButton{
  constructor(ship){
    this.ship=ship;
    let bottomOffset=40;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=20*scale;

    this.weaponButtonX=0;
    this.weaponButtonY=0;
    this.touchId=null;
    this.resize();
    this.pressed=false;
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
    return distance<=this.radius;
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
    canvas.addEventListener("mousedown",(event)=>{
      const rect=canvas.getBoundingClientRect();
      const x=event.clientX-rect.left;
      const y=event.clientY-rect.top;
      if(this.containsPoint(x,y)){
        this.press("mouse");
      }
    });
    canvas.addEventListener("mouseup",()=>{
      this.release("mouse");
    });
    canvas.addEventListener("touchstart",(event)=>{
      for(const touch of event.changedTouches){
        const rect=canvas.getBoundingClientRect();
        const x=touch.clientX-rect.left;
        const y=touch.clientY-rect.top;
        if(this.containsPoint(x,y)){
          event.preventDefault();
          this.press(touch.identifier);
          break;
        }
      }
    },{passive:false});
    canvas.addEventListener("touchend",(event)=>{
      for(const touch of event.changedTouches){
        if(this.touchId===touch.identifier){
          event.preventDefault();
          this.release(touch.identifier);
          break;
        }
      }
    },{passive:false});
    canvas.addEventListener("touchcancel",(event)=>{
      for(const touch of event.changedTouches){
        if(this.touchId===touch.identifier){
          this.release(touch.identifier);
          break;
        }
      }
    },{passive:false});   
  }

  resize(){
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=20*scale;
    this.weaponButtonX=window.innerWidth-this.radius-45;
    this.weaponButtonY=window.innerHeight/2-20;
  }

  render(context,x,y,radius){
   const visualRadius=this.pressed?50:25;
    context.save();
    context.shadowBlur=this.pressed?40:20;
    context.shadowColor="#00ffff";
    context.globalAlpha=0.25;
    context.beginPath();
    context.arc(
      this.weaponButtonX,this.weaponButtonY,
      visualRadius+10,0,
      Math.PI*2
    );
    context.fillStyle=this.pressed?"#00bfff":"rgba(0,255,255,0.25)";
    context.fill();
    context.globalAlpha=1;

    context.shadowBlur=this.pressed?40:20;
    context.shadowColor="#c084ff";
    context.beginPath();
    for(let i=0;i<6;i++){
      const angle=Math.PI/3*i-Math.PI/6;
      const px=x+radius*Math.cos(angle);
      const py=y+radius*Math.sin(angle);
      if(i===0){
        context.moveTo(px,py);
      }else{context.lineTo(px,py);}
    }

    context.lineWidth=3;
    context.strokeStyle="#c084ff";
    context.stroke();
    context.fillStyle=this.pressed?"#d8b4fe":"#24163d";
    context.fill();
    context.shadowBlur=0;
    context.fillStyle="white";
    context.font="bold 12px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    const text=this.ship.currentWeapon==="SINGLE"
    ?"SINGLE":"TWIN";

    context.fillText(text,this.weaponButtonX,
      this.weaponButtonY-5);

    context.restore();
  }
}