export class FireButton{
  constructor(){
   this.pressed=false;
   this.pulse=0;
   this.touchId=null;
   this.resize();
   this.handleTouchStart=this.handleTouchStart.bind(this);
   this.handleTouchEnd=this.handleTouchEnd.bind(this);
   window.addEventListener("touchstart",this.handleTouchStart,
    {passive:true}
   );
   window.addEventListener("touchend",this.handleTouchEnd,
    {passive:true}
   );
   window.addEventListener("touchcancel",this.handleTouchEnd,
    {passive:true}
   );
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  resize(){
    const width=window.innerWidth;
    const height=window.innerHeight;
    this.radius=Math.max(
      18,Math.min(width*0.055,28)
    );
    const margin=width<600?25:40;
    const bottomOffset=width<600?100:40;
    this.x=width-this.radius-margin;
    this.y=height-this.radius-bottomOffset;
  }

  handleTouchStart(event){
    if(this.touchId!==null) return;
    const canvas=document.querySelector("canvas");
    if(!canvas) return;
    const rect=canvas.getBoundingClientRect();
    for(const touch of event.changedTouches){
      const x=touch.clientX-rect.left;
      const y=touch.clientY-rect.top;
      const distance=Math.hypot(
        x-this.x,y-this.y
      );
      if(distance<=this.radius*1.5){
        this.touchId=touch.identifier;
        this.pressed=true;
        break;
      }
    }
  }

  handleTouchEnd(event){
    for(const touch of event.changedTouches){
      if(touch.identifier===this.touchId){
        this.touchId=null;
        this.pressed=false;
        break;
      }
    }
  }

  update(){
    this.pulse+=this.pressed?0.18:0.055;
  }

  render(context){
    const pulse=Math.sin(this.pulse);
    let radius=this.radius*(
      this.pressed?0.94:1+pulse*0.025
    );
    if(!this.pressed){
      radius+=Math.sin(this.pulse)*2;
    }else{radius-=4;}
    if(this.pressed){
      radius-=4;
    }else{radius+=Math.sin(this.pulse)*2;}
    context.save();
    context.globalAlpha=this.pressed?0.85:0.4;
    context.strokeStyle=this.pressed?
    "#ff4545":"#a8b8d5";
    context.lineWidth=this.pressed?2.5:2;
    context.beginPath();
    context.arc(
      this.x,this.y,radius+7,
      0,Math.PI*2
    );
    context.stroke();
    const markLength=this.pressed?7:5;
    const inner=radius+4;
    const outer=inner+markLength;
    context.globalAlpha=0.85;
    context.strokeStyle="#ffd5d5";
    context.lineWidth=2;
    context.lineCap="round";
    context.beginPath();
    context.moveTo(this.x,this.y-outer);
    context.lineTo(this.x,this.y-inner);
    context.moveTo(this.x,this.y-inner);
    context.lineTo(this.x,this.y+outer);
    context.moveTo(this.x-outer,this.y);
    context.lineTo(this.x-inner,this.y);
    context.moveTo(this.x+inner,this.y);
    context.lineTo(this.x+outer,this.y);
    context.stroke();
    context.globalAlpha=this.pressed?0.3:0.18;
    context.shadowColor="#ff2020";
    context.shadowBlur=this.pressed?28:16;
    context.fillStyle="#ff2020";

    context.beginPath();
    context.arc(
      this.x,this.y,
      radius,0,Math.PI*2
    );
    context.fill();
    context.globalAlpha=this.pressed?1:0.9;
    context.shadowBlur=this.pressed?18:9;
    const gradient=context.createRadialGradient(
      this.x-radius*0.25,this.y-radius*0.3,
      1,this.x,this.y,
      radius
    );
    gradient.addColorStop(0,"#ffb0b0");
    gradient.addColorStop(0.3,"#ff4545");
    gradient.addColorStop(0.75,"#c20d27");
    gradient.addColorStop(1,"#480719");
    context.fillStyle=gradient;
    context.beginPath();
    context.arc(
      this.x,this.y,
      radius*0.76,0,
      Math.PI*2
    );
    context.fill();
    context.shadowBlur=this.pressed?12:5;
    context.fillStyle="#fff0f0";
    context.beginPath();
    context.arc(
      this.x,this.y,this.pressed?2.5:2,0,Math.PI*2
    );
    context.fill();
    context.restore();
  }
}