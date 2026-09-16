export class GameOver{
  constructor(game){
    this.game=game;
    this.canvas=game.canvas;
    this.newGameButton={
      x:0,
      y:0,
      width:300,
      height:70
    };
    this.mouse={
      x:0,
      y:0
    }
    this.clicked=false;
    game.canvas.addEventListener("pointerdown",(event)=>{
      const rect=this.canvas.getBoundingClientRect();
      game.mouse.x=(event.clientX-rect.left)*(this.canvas.width/rect.width);
      game.mouse.y=(event.clientY-rect.top)*(this.canvas.height/rect.height);
      this.clicked=true;
    });
  }

  update(){
    const button=this.newGameButton;
    if(this.clicked && this.game.mouse.x>button.x && this.game.mouse.x<button.x + button.width &&
      this.game.mouse.y>button.y && this.game.mouse.y<button.y + button.height
    ){
      this.game.restart();
      this.clicked=false;
      return;
    }
    if(this.game.input.keys["Enter"] || this.game.input.keys["NumpadEnter"]){
      this.game.restart();
      this.game.input.keys["Enter"]=false;
      this.game.input.keys["NumpadEnter"]=false;
  }
  this.clicked=false;
  }

  render(context){
    let width=context.canvas.width;
    let height=context.canvas.height;
    const centerX=width/2;
    const background=context.createLinearGradient(
      0,0,width,height
    );
    background.addColorStop(0,"#020617");
    background.addColorStop(0.5,"#090d2b");
    background.addColorStop(1,"#02020d");
    context.fillStyle=background;
    context.fillRect(0,0,width,height);
    context.save();
    for(let i=0;i<90;i++){
      const x=(i*137.37)%width;
      const y=(i*73.91)%height;
      const size=1+((i&17)%3)*0.5;
      const alpha=0.25+((i*13)%70)/100;
      context.globalAlpha=alpha;
      context.fillStyle="#ffffff";
      context.beginPath();
      context.arc(x,y,size,0,Math.PI*2);
      context.fill();
    }
    context.restore();
    const glow=context.createRadialGradient(
      centerX,height*0.45,10,centerX,height*0.45,
      Math.min(width,height)*0.55
    );
    glow.addColorStop(0,"rgba(0,255,255,0.12)");
    glow.addColorStop(0.45,"rgba(40,70,180,0.08)");
    glow.addColorStop(1,"rgba(0,0,0,0)");
    context.fillStyle=glow;
    context.fillRect(0,0,width,height);

    const titleSize=Math.min(width*0.09,72);
    context.save();
    context.textAlign="center";
    context.textBaseline="middle";
    context.font=`bold ${titleSize}px Arial`;
    context.shadowColor="#ff304f";
    context.shadowBlur=25;
    context.fillStyle="#ffffff";
    context.fillText(
      "GAME OVER",centerX,height*0.30
    );
    context.restore();

    const subtitleSize=Math.min(width*0.032,24);
    context.save();
    context.textAlign="center";
    context.font=`${subtitleSize}px Arial`;
    context.fillStyle="#aeb8d4";
    context.fillText("Your space journey has ended.",
      centerX,height*0.45
    );
    context.restore();

    context.save();
    const lineWidth=Math.min(width*0.28,260);
    const lineGradient=context.createLinearGradient(
      centerX-lineWidth/2,0,
      centerX+lineWidth/2,0
    );
    lineGradient.addColorStop(0,"rgba(0,255,255,0)");
    lineGradient.addColorStop(0.5,"#00ffff");
    lineGradient.addColorStop(1,"rgba(0,255,255,0)");
    context.fillStyle=lineGradient;
    context.fillRect(centerX-lineWidth/2,
      height*0.44,lineWidth,2);
      context.restore();

    this.newGameButton.width=Math.min(width*0.55,320);
    this.newGameButton.height=Math.min(height*0.11,72);
    this.newGameButton.x=centerX-this.newGameButton.width/2;
    this.newGameButton.y=height*0.58;

    context.save();
    context.shadowColor="#00ffff";
    context.shadowBlur=20;
    context.fillStyle="#10243f";
    context.beginPath();
    context.roundRect(
      this.newGameButton.x,this.newGameButton.y,
      this.newGameButton.width,this.newGameButton.height
    );
    context.strokeStyle="#00ffff";
    context.strokeRect(
      this.newGameButton.x,this.newGameButton.y,
      this.newGameButton.width,
      this.newGameButton.height,18
    );
    context.fill();
    context.shadowBlur=0;
    context.strokeStyle="#00ffff";
    context.lineWidth=2.5;
    context.stroke();
    const buttonFontSize=Math.min(width*0.055,30);
    context.font=`bold ${buttonFontSize}px Arial`;
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillStyle="#ffffff";
    context.shadowColor="#00ffff";
    context.shadowBlur=12;
    context.fillText(
      "NEW GAME",
      centerX,this.newGameButton.y+this.newGameButton.height/2
    );
    context.restore();
    context.save();
    context.textAlign="center";
    context.font=`${Math.min(width*0.028,18)}px Arial`;
    context.fillStyle="#7f8ba8";
    context.fillText(
      "ENTER TO RETRY",centerX,
      this.newGameButton.y+this.newGameButton.height+42
    );
    context.restore();
    context.save();
    context.textAlign="center";
    context.font=`${Math.min(width*0.022,15)}px Arial`;
    context.fillStyle="#4f5b75";
    context.fillText(
      "MATHLAB SPACE", centerX,
      height*0.91
    );
    context.restore();

  }
}