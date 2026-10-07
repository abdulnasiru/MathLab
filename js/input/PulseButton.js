export class PulseButton{
  constructor(x,y,radius){
    this.pressed=false;
    this.pulse=0;
    this.touchId=null;
    this.resize();
    this.setupControls();
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  setupControls(){
    window.addEventListener("touchstart",(event)=>{
      const canvas=document.querySelector("canvas");
      if(!canvas) return;
      const rect=canvas.getBoundingClientRect();
      for(const touch of event.changedTouches){
        const x=touch.clientX-rect.left;
        const y=touch.clientY-rect.top;
        const distance=Math.hypot(x-this.x,y-this.y);
        if(distance<=this.hitRadius && this.touchId===null){
          this.touchId=touch.identifier;
          this.pressed=true;
        }
      }
    });
    window.addEventListener("touchend",(event)=>{
      for(const touch of event.changedTouches){
        if(touch.identifier===this.touchId){
          this.touchId=null;
          this.pressed=false;
        }
      }
    });
    window.addEventListener("touchcancel",(event)=>{
      for(const touch of event.changedTouches){
        if(touch.identifier===this.touchId){
          this.touchId=null;
          this.pressed=false;
        }
      }
    });
    window.addEventListener("mousedown",(event)=>{
      const canvas=document.querySelector("canvas");
      if(!canvas) return; 
      const rect=canvas.getBoundingClientRect();
      const x=event.clientX-rect.left;
      const y=event.clientY-rect.top;
      const distance=Math.hypot(x-this.x,y-this.y);
        if(distance<=this.hitRadius){
          this.pressed=true;
        }
      }
    );
    window.addEventListener("mouseup",()=>{
      this.pressed=false;
    });
  }

  resize(){
   const width=window.innerWidth;
   const height=window.innerHeight;
    const scale=Math.min(width/400,1.2);
    this.radius=Math.max(18,22*scale);
    this.hitRadius=this.radius*1.25;
    const margin=width<600?55:60;
    const gap=75;
    this.x=width-margin-this.radius-gap;
    const bottomOffset=width<600?100:40;
    this.y=height-this.radius-bottomOffset;
  }

  update(){
    this.pulse+=0.08;
  }

  drawBolt(context,x,y,size){
    context.beginPath();
    context.moveTo(x+size*0.15,y-size);
    context.lineTo(x-size*0.45,y-size*0.10);
    context.lineTo(x-size*0.05,y-size*0.10);
    context.lineTo(x-size*0.35,y+size);
    context.lineTo(x+size*0.50,y);
    context.lineTo(x+size*0.08,y);
    context.closePath();
    context.fill();
  }

  render(context){
   const breathing=Math.sin(this.pulse)*1.5;
   const radius=this.pressed?this.radius-2:this.radius+breathing;
   context.save();
    context.shadowColor="#00ffff";
    context.shadowBlur=this.pressed?20:10;
    context.globalAlpha=this.pressed?0.30:0.16;
    context.beginPath();
    context.arc(
      this.x,this.y,
      radius+4,0,Math.PI*2
    );
    context.fillStyle="#00eaff";
    context.fill();
    context.globalAlpha=1;
    const gradient=context.createRadialGradient(
      this.x-radius*0.25,this.y-radius*0.25,
      radius*0.1,this.x,this.y,radius
    );
    if(this.pressed){
      gradient.addColorStop(0,"#ffffff");
      gradient.addColorStop(0.35,"#8fffff");
      gradient.addColorStop(0.75,"#00d9ff");
      gradient.addColorStop(1,"#008cff");
    }
    else{
    gradient.addColorStop(0,"#dfffff");
    gradient.addColorStop(0.35,"#65faff");
    gradient.addColorStop(0.75,"#00cfff");
    gradient.addColorStop(1,"#008cff");
  }

    context.beginPath();
    context.arc(
      this.x,this.y,radius,0,Math.PI*2
    );
    context.fillStyle=gradient;
    context.fill();
    context.shadowBlur=0;
    context.strokeStyle="rgba(120,255,255,0.55)";
    context.lineWidth=1.5;
    context.beginPath();
    context.arc(this.x,this.y,radius+2,0,Math.PI*2);
    context.stroke();
    const arcRotation=this.pulse*0.7;
    context.strokeStyle="rgba(255,255,255,0.75)";
    context.lineWidth=2;
      context.beginPath();
      context.arc(
        this.x,this.y,radius+4,arcRotation,
        arcRotation+Math.PI*0.65
      );
      context.stroke();
    context.fillStyle="white";
    context.beginPath();
    context.moveTo(this.x+3,this.y-radius*0.55);
    context.lineTo(this.x-radius*0.18,this.y-radius*0.05);
    context.lineTo(this.x+radius*0.05,this.y-radius*0.05);
    context.lineTo(this.x-radius*0.18,this.y+radius*0.55);
    context.lineTo(this.x+radius*0.32,this.y+radius*0.02);
    context.lineTo(this.x+radius*0.05,this.y+radius*0.02);
    context.closePath();
    context.fill();
    if(this.pressed){
      context.globalAlpha=0.35;
      context.strokeStyle="#ffffff";
      context.lineWidth=1.5;
      context.beginPath();
      context.arc(
        this.x,this.y,radius+9+
        Math.sin(this.pulse*2)*2,0,Math.PI*2
      );
      context.stroke();
    }

    context.restore();
  }
}