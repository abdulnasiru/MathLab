export class PulseButton{
  constructor(x,y,radius){
    let bottomOffset=40;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=20*scale;
    const spacing=this.radius*2+32;
    const margin=window.innerWidth<600?25:40;
    const bottom=window.innerHeight-this.radius-40;
    this.x=window.innerWidth-this.radius-margin-spacing;
    this.y=window.innerHeight-this.radius-bottomOffset;
    this.pressed=false;
    this.pulse=0;
    this.setupControls();
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  setupControls(){
    window.addEventListener("touchstart",(event)=>{
      for(const touch of event.touches){
        let rect=document.querySelector("canvas").getBoundingClientRect();
        let distance=Math.hypot((touch.clientX-rect.left)-this.x,
        (touch.clientY-rect.top)-this.y);
        if(distance<this.radius){
          this.pressed=true;
        }
      }
    });
    window.addEventListener("touchend",()=>{
      this.pressed=false;
    });
    window.addEventListener("mousedown",(event)=>{
      let rect=document.querySelector("canvas").getBoundingClientRect();
        let distance=Math.hypot((event.clientX-rect.left)-this.x,
        (event.clientY-rect.top)-this.y);
        if(distance<this.radius){
          this.pressed=true;
        }
      }
    );
    window.addEventListener("mouseup",()=>{
      this.pressed=false;
    });
  }

  resize(){
    let bottomOffset=50;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/200,1.4);
    this.radius=10*scale;
    const bottom=window.innerHeight-this.radius-20;
    const margin=window.innerWidth<600?50:100;
    const spacing=this.radius*2+40;
    this.x=window.innerWidth-this.radius-margin-spacing;
    this.y=window.innerHeight-this.radius-bottomOffset;
  }

  update(){
    this.pulse+=0.08;
  }

  render(context){
   this.radius=this.pressed?55:45;
    context.save();
    context.shadowBlur=this.pressed?40:20;
    context.shadowColor="#00ffff";
    context.globalAlpha=0.25;
    context.beginPath();
    context.arc(
      this.x,this.y,
      this.radius+10,0,
      Math.PI*2
    );
    context.fillStyle=this.pressed?"#00bfff":"rgba(0,255,255,0.25)";
    context.fill();
    context.globalAlpha=1;

    context.beginPath();
    context.arc(
      this.x,this.y,this.radius,0,Math.PI*2
    );
    context.lineWidth=3;
    context.strokeStyle="#00ffff";
    context.stroke();
    context.fillStyle=this.pressed?"#00ffff":"#0066ff";
    context.fill();
    context.shadowBlur=0;
    context.fillStyle="white";
    context.font="bold 22px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(
      "PULSE",this.x,this.y+5
    );

    context.restore();
  }
}