export class FireButton{
  constructor(){
    let bottomOffset=40;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=10*scale;
    const margin=window.innerWidth<600?25:40;
    const bottom=window.innerHeight-margin;
    this.x=window.innerWidth-this.radius-margin;
    this.y=window.innerHeight-this.radius-bottomOffset;
    this.pressed=false;
    this.setupControls();
    this.pulse=0;
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  setupControls(){
    window.addEventListener("touchstart",(event)=>{
      for(const touch of event.touches){
        let rect=document.querySelector("canvas").getBoundingClientRect();
        const distance=Math.hypot(
          (touch.clientX-rect.left)-this.x,
          (touch.clientY-rect.top)-this.y
        );
        if(distance<this.radius){
          this.pressed=true;
        }
      }
    });
    window.addEventListener("touchend",()=>{
      this.pressed=false;
    });
    
  }

  resize(){
    let bottomOffset=40;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=20*scale;
    const margin=window.innerWidth<600?25:40;
    const bottom=window.innerHeight-margin;
    this.x=window.innerWidth-this.radius-margin;
    this.y=window.innerHeight-this.radius-bottomOffset;
  }


  update(){
    this.pulse+=0.08;
  }

  render(context){
    let radius=this.radius;
    if(!this.pressed){
      radius+=Math.sin(this.pulse)*2;
    }else{radius-=4;}
    if(this.pressed){
      radius-=4;
    }else{radius+=Math.sin(this.pulse)*2;}

    context.save();
    context.strokeStyle="rgba(255,255,255,0.8)";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(this.x-10,this.y);
    context.lineTo(this.x+10,this.y);
    context.moveTo(this.x,this.y-10);
    context.lineTo(this.x,this.y+10);
    context.stroke();

    context.fillStyle="#ffffff";
    context.beginPath();
    context.arc(
      this.x,this.y,
      3,0,Math.PI*2
    );
    context.fill();

    context.shadowBlur=this.pressed?30:15;
    context.shadowColor="#ff3030";

    context.globalAlpha=0.35;
    context.beginPath();
    context.arc(
      this.x,this.y,
      radius,0,
      Math.PI*2
    );
    const gradient=context.createRadialGradient(
      this.x-10,this.y-10,
      5,this.x,this.y,
      radius
    );
    gradient.addColorStop(0,"#ff9b9b");
    gradient.addColorStop(0.4,"#ff3b3b");
    gradient.addColorStop(1,"#7a0000");
    context.fillStyle=gradient;
    context.fill();

    context.strokeStyle="rgba(255,255,255,0.35)";
    context.lineWidth=3;
    context.beginPath();
    context.arc(
      this.x,this.y,
      radius+8,0,
      Math.PI*2
    );
    context.stroke();

    context.globalAlpha=1;
    context.fillStyle="white";
    context.font="28px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(
      "",this.x,this.y
    );
    context.restore();
  }
}