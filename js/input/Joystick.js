export class Joystick{
  constructor(){
    this.radius=0;
    this.baseX=0;
    this.baseY=0;
    this.knobX=0;
    this.knobY=0;
    this.knobRadius=0;
    this.active=false;
    this.moveX=0;
    this.moveY=0;
    this.targetX=0;
    this.targetY=0;
    this.smoothness=0.25;
    this.resize();
    this.setupControls();
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  setupControls(){
    this.touchId=null;
    this.deadZone=0.10;
    this.steeringPower=1.40;
    window.addEventListener(
      "touchstart",(event)=>{
        const canvas=document.querySelector("canvas");
        if(!canvas || this.active) return;
        const rect=canvas.getBoundingClientRect();
        for(const touch of event.changedTouches){
          const x=touch.clientX-rect.left;
          const y=touch.clientY-rect.top;
        const distance=Math.hypot(
          x-this.baseX,y-this.baseY
        );
        if(distance<this.radius*2){
          this.active=true;
          this.touchId=touch.identifier;
          this.targetX=this.baseX;
          this.targetY=this.baseY;
        }
      }
    },{passive:true}
    );
    window.addEventListener("touchmove",(event)=>{
      if(!this.active || this.touchId===null) return;
      const touch=Array.from(event.touches).find(
        (item)=>item.identifier===this.touchId
      );
      if(!touch) return;
      const canvas=document.querySelector("canvas");
      if(!canvas) return;
      let rect=canvas.getBoundingClientRect();
      let dx=(touch.clientX-rect.left)-this.baseX;
      let dy=(touch.clientY-rect.top)-this.baseY;
      let distance=Math.hypot(dx,dy);
      if(distance>this.radius){
        dx=(dx/distance)*this.radius;
        dy=(dy/distance)*this.radius;
      }
      this.targetX=this.baseX+dx;
      this.targetY=this.baseY+dy;
      let rawX=dx/this.radius;
      let rawY=dy/this.radius;
      if(Math.abs(rawX)<this.deadZone) rawX=0;
      if(Math.abs(rawY)<this.deadZone) rawY=0;
      this.moveX=Math.sign(rawX)*Math.pow(Math.abs(rawX),
    this.steeringPower);
      this.moveY=Math.sign(rawY)*Math.pow(Math.abs(rawY),
    this.steeringPower);
    },{passive:true});
    const releaseJoystick=(event)=>{
      if(this.touchId===null) return;
      const released=Array.from(event.changedTouches).some(
        (touch)=>touch.identifier===this.touchId
      );
      if(!released) return;
      this.active=false;
      this.touchId=null;
      this.targetX=this.baseX;
      this.targetY=this.baseY;
      this.moveX=0;
      this.moveY=0;
    };
    window.addEventListener("touchend",releaseJoystick);
    window.addEventListener("touchcancel",releaseJoystick);
    }


  resize(){
    const width=window.innerWidth;
    const bottomOffset=width<700?80:40;
    this.radius=Math.min(width*0.04,34);
    const margin=width<700?24:32;
    this.baseX=this.radius+margin;
    this.baseY=window.innerHeight-this.radius-bottomOffset;
    this.knobRadius=this.radius*0.45;
    this.targetX=this.baseX;
    this.targetY=this.baseY;
    this.knobX=this.baseX;
    this.knobY=this.baseY;
  }

  update(){
    this.knobX+=(this.targetX-this.knobX)*this.smoothness;
    this.knobY+=(this.targetY-this.knobY)*this.smoothness;
  }

  render(context){
    context.save();
    context.beginPath();
    context.arc(
      this.baseX,this.baseY,
      this.radius,0,
      Math.PI*2
    );

    const gradient=context.createRadialGradient(
      this.baseX,this.baseY,
      this.radius*0.2,
      this.baseX,this.baseY,this.radius
    );
    gradient.addColorStop(0,"rgba(70,70,90,0.95)");
    gradient.addColorStop(1,"rgba(20,20,30,0.95)");
    context.fillStyle=gradient;
    context.fill();
    context.lineWidth=4;
    context.strokeStyle="rgba(255,255,255,0.18)";
    context.stroke();

    context.beginPath();
    context.arc(
      this.baseX,this.baseY,
      this.radius+8,0,
      Math.PI*2
    );
    context.strokeStyle="rgba(0,255,255,0.15)";
    context.lineWidth=8;
    context.stroke();

    if(this.active){
      context.save();
      context.shadowBlur=20;
      context.shadowColor="#00e5ff";
      context.restore();
    }

    context.strokeStyle="rgba(255,255,255,0.35)";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(this.baseX,this.baseY-this.radius+15);
    context.lineTo(this.baseX-8,this.baseY-this.radius+25);
    context.moveTo(this.baseX,this.baseY-this.radius+15);
    context.lineTo(this.baseX+8,this.baseY-this.radius+25);
    context.stroke();

    context.strokeStyle="rgba(255,255,255,0.35)";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(this.baseX,this.baseY+this.radius-15);
    context.lineTo(this.baseX-8,this.baseY+this.radius-25);
    context.moveTo(this.baseX,this.baseY+this.radius-15);
    context.lineTo(this.baseX+8,this.baseY+this.radius-25);
    context.stroke();

    context.strokeStyle="rgba(255,255,255,0.35)";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(this.baseX-this.radius+15,this.baseY);
    context.lineTo(this.baseX-this.radius+25,this.baseY-8);
    context.moveTo(this.baseX-this.radius+15,this.baseY);
    context.lineTo(this.baseX-this.radius+25,this.baseY+8);
    context.stroke();

    context.strokeStyle="rgba(255,255,255,0.35)";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(this.baseX+this.radius-15,this.baseY);
    context.lineTo(this.baseX+this.radius-25,this.baseY-8);
    context.moveTo(this.baseX+this.radius-15,this.baseY);
    context.lineTo(this.baseX+this.radius-25,this.baseY+8);
    context.stroke();

    context.beginPath();
    context.arc(
      this.knobX,this.knobY,
      this.active
      ?this.knobRadius+3
      :this.knobRadius,0,
      Math.PI*2
    );

    const knobGradient=context.createRadialGradient(
      this.knobX-8,this.knobY-8,
      5,this.knobX,this.knobY,
      this.knobRadius
    );

    knobGradient.addColorStop(0,"#7cfbff");
    knobGradient.addColorStop(1,"#00bcd4");
    context.fillStyle=knobGradient;
    context.fill();
    context.lineWidth=3;
    context.strokeStyle="rgba(255,255,255,0.35)";
    context.stroke();

    if(this.active){
      context.restore();
    }

    context.restore();
  }
}