export class Joystick{
  constructor(){
    let bottomOffset=40;
    if(window.innerWidth<700){
      bottomOffset=100;
    }
    const margin=window.innerWidth<700?25:40;
    const scale=Math.min(window.innerWidth/300,1.4);
    this.radius=20*scale;
    this.baseX=this.radius+margin;
    this.baseY=window.innerHeight-this.radius-bottomOffset;
    this.knobX=this.baseX;
    this.knobY=this.baseY;
    this.knobRadius=this.radius*0.45;
    this.active=false;
    this.moveX=0;
    this.moveY=0;
    this.setupControls();
    this.targetX=this.baseX;
    this.targetY=this.baseY;
    this.smoothness=0.25;
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  setupControls(){
    window.addEventListener(
      "touchstart",(event)=>{
        let rect=document.querySelector("canvas").getBoundingClientRect();
        const touch=event.touches[0];
        const distance=Math.hypot((touch.clientX-rect.left)-this.baseX,
          (touch.clientY-rect.top)-this.baseY
        );
        if(distance<this.radius*2){
          this.active=true;
        }
      }
    );

    window.addEventListener("touchmove",(event)=>{
      if(!this.active) return;
      const touch=event.touches[0];
      let rect=document.querySelector("canvas").getBoundingClientRect();
      let dx=(touch.clientX-rect.left)-this.baseX;
      let dy=(touch.clientY-rect.top)-this.baseY;
      let distance=Math.hypot(dx,dy);

      if(distance>this.radius){
        dx=(dx/distance)*this.radius;
        dy=(dy/distance)*this.radius;
      }
      this.targetX=this.baseX+dx;
      this.targetY=this.baseY+dy;
      this.moveX=dx/this.radius;
      this.moveY=dy/this.radius;
      const deadZone=0.15;
      if(Math.abs(this.moveX)<deadZone){
        this.moveX=0;
      }
      if(Math.abs(this.moveY)<deadZone){
        this.moveY=0;
      }
    });

    window.addEventListener("touchend",()=>{
      this.active=false;
      this.targetX=this.baseX;
      this.targetY=this.baseY;
      this.moveX=0;
      this.moveY=0;
    });
  }

  resize(){
    let bottomOffset=40;
    if(window.innerWidth<700){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=30*scale;
    const margin=window.innerWidth<700?25:40;
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