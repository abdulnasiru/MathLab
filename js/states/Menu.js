import { MenuStar } from "./MenuStar.js";
import { ShootingStar } from "./ShootingStar.js";
import { MenuShip } from "../entities/MenuShip.js";
export class Menu{
  constructor(game){
    this.game=game;
    this.canvas=game.canvas;
    this.stars=[];
    for(let i=0;i<120;i++){
      this.stars.push(new MenuStar(this.game));
    }
    this.shootingStar=[];
    for(let i=0;i<3;i++){
      this.shootingStar.push(
        new ShootingStar(game)
      );
    }
    this.helpPanel={
      x:0,
      y:0,
      width:560,
      height:600,
      titleSize:34,
      keySize:25,
      descriptionSize:22,
      rowSpacing:48,
      padding:34
    };
    this.mouse={
      x:0,
      y:0
    }
    this.startButton={
      x:0, 
      y:0,
      width:250,
      height:70
    };
    this.helpButton={
      x:0,
      y:0,
      width:54,
      height:54
    };
    this.fullscreenButton={
      x:0,
      y:0,
      width:230,
      height:50
    };
    this.helpOpen=false;
    this.touchStart=false;
    this.clicked=false;
    this.canvas.addEventListener(
      "pointerdown",(event)=>{
        const rect=this.canvas.getBoundingClientRect();
        const scaleX=this.canvas.width/rect.width;
        const scaleY=this.canvas.height/rect.height;
        this.mouse.x=(event.clientX-rect.left)*scaleX;
        this.mouse.y=(event.clientY-rect.top)*scaleY;
        const x=this.mouse.x;
        const y=this.mouse.y;
        if(this.isInsideButton(this.helpButton,x,y)){
          this.helpOpen=!this.helpOpen;
          return;
        }
        if(this.helpOpen){return;}
        if(this.isInsideButton(this.startButton,x,y)){
          if(window.enterMathLabFullscreen){
            window.enterMathLabFullscreen();
          }
          this.game.startGame();
          return;
        }
        if(this.isInsideButton(
          this.fullscreenButton,x,y
        )){
          if(window.enterMathLabFullscreen){
            window.enterMathLabFullscreen();
          }
          return;
        }
        });
    this.backgroundOffset=0;
    this.buttonPulse=0;
    this.buttonScale=1;
    this.ship=new MenuShip(game);
    window.addEventListener("resize",()=>{
      this.resize();
    });
    this.resize();
  }

resize() {
  const width = this.game.canvas.width;
  const height = this.game.canvas.height;
  if (width < 700 || height < 600) {
    this.resizeSmallScreen();
  } else {
    this.resizeDesktop();
  }
  this.resizeHelpPanel();
}

resizeSmallScreen() {
  const width = this.game.canvas.width;
  const height = this.game.canvas.height;
  const centerX = width / 2;
  this.titleY = height * 0.16;
  this.subtitleY = height * 0.30;
  this.shipX = centerX;
  this.shipY = height * 0.42;
  this.startButton.width = Math.min(width * 0.62, 300);
  this.startButton.height = Math.max(48, height * 0.14);
  this.startButton.x =
    centerX - this.startButton.width / 2;
  this.startButton.y = height * 0.53;
  this.fullscreenButton.width =
    Math.min(width * 0.42, 220);
  this.fullscreenButton.height =
    Math.max(38, height * 0.10);
  this.fullscreenButton.x =
    centerX - this.fullscreenButton.width / 2;
  this.fullscreenButton.y =
    this.startButton.y +
    this.startButton.height +
    12;
  this.footerY = height - 18;
  this.helpButton.width = 64;
  this.helpButton.height = 64;
  this.helpButton.x = 18;
  this.helpButton.y = 18;
}

resizeDesktop() {
  const width = this.game.canvas.width;
  const height = this.game.canvas.height;
  const centerX = width / 2;
  this.titleY = height * 0.18;
  this.subtitleY = height * 0.29;
  this.shipX=centerX;
  this.shipY=height * 0.39;
  this.startButton.width = Math.min(width * 0.55, 320);
  this.startButton.height = 76;
  this.startButton.x =
    centerX - this.startButton.width / 2;
  this.startButton.y = height * 0.55;
  this.fullscreenButton.width = 230;
  this.fullscreenButton.height = 50;
  this.fullscreenButton.x =
    centerX - this.fullscreenButton.width / 2;
  this.fullscreenButton.y =
    this.startButton.y +
    this.startButton.height +
    24;
  this.footerY = height - 24;
  this.helpButton.width = 64;
  this.helpButton.height = 64;
  this.helpButton.x = width - 82;
  this.helpButton.y = 18;
}

resizeHelpPanel() {
  const width = this.game.canvas.width;
  const height = this.game.canvas.height;
  const isSmallScreen =
    width < 700 || height < 600;
  if (isSmallScreen) {
    this.helpPanel.width = Math.min(width * 0.86, 560);
    this.helpPanel.height = Math.min(height * 0.88, 500);
    this.helpPanel.x =
      (width - this.helpPanel.width) / 2;
    this.helpPanel.y =
      (height - this.helpPanel.height) / 2;
    this.helpPanel.titleSize = Math.max(
      22,
      Math.min(width * 0.055, 34)
    );
    this.helpPanel.keySize = Math.max(
      17,
      Math.min(width * 0.045, 25)
    );
    this.helpPanel.descriptionSize = Math.max(
      15,
      Math.min(width * 0.040, 22)
    );
    this.helpPanel.rowSpacing = Math.max(
      34,
      Math.min(height * 0.105, 48)
    );
    this.helpPanel.padding = 24;
  }
   else {
    this.helpPanel.width = 560;
    this.helpPanel.height = 600;
    this.helpPanel.x =
      (width - this.helpPanel.width) / 2;
    this.helpPanel.y =
      (height - this.helpPanel.height) / 2;
    this.helpPanel.titleSize = 34;
    this.helpPanel.keySize = 25;
    this.helpPanel.descriptionSize = 22;
    this.helpPanel.rowSpacing = 48;
    this.helpPanel.padding = 34;
  }
  this.helpPanel.width=Math.min(this.helpPanel.width,width-24);
  this.helpPanel.height=Math.min(this.helpPanel.height,height-24);
  this.helpPanel.x=(width-this.helpPanel.width)/2;
  this.helpPanel.y=(height-this.helpPanel.height)/2;
}
  
  update(){
    for(const star of this.stars){
    star.update();
  }
  this.backgroundOffset+=0.005;
  this.buttonPulse+=0.05;
  this.buttonScale=1+Math.sin(this.buttonPulse)*0.03;
  for(const shooting of this.shootingStar){
    shooting.update();
  }
  this.ship.update();
  if(this.game.input.keys["Enter"] || this.game.input.keys["NumpadEnter"]){
    if(window.enterMathLabFullscreen){
      window.enterMathLabFullscreen();
    }
    this.game.startGame();
  }
  }

  isInsideButton(button,x,y){
    const inside= x>=button.x && 
    x<=button.x + button.width && 
      y>=button.y && 
      y<=button.y + button.height;
      return inside;
  }

  drawButton(context,button,label,options={}){
    const{
      fontSize=24,
      fillStyle="#112244",
      strokeStyle="#00ffff",
      textColor="#ffffff",
      radius=18
    }=options;
  context.save();
  context.shadowColor=strokeStyle;
  context.shadowBlur=12;
  context.fillStyle=fillStyle;
  context.beginPath();
  context.roundRect(
    button.x,button.y,button.width,button.height,radius
  );
  context.fill();
  context.strokeStyle=strokeStyle;
  context.lineWidth=2;
  context.stroke();
  context.shadowBlur=0;
  context.fillStyle=textColor;
  context.font=`bold ${fontSize}px Arial`;
  context.textAlign="center";
  context.textBaseline="middle";
  context.fillText(
    label,button.x+button.width/2,
    button.y+button.height/2
  );
  context.restore();
}

renderHelpPanel(context){
  const width=this.game.canvas.width;
  const height=this.game.canvas.height;
  const isMobile=width<900 && width>height;
  const panelWidth=isMobile?Math.min(width*0.86,620)
  :Math.min(width*0.68,820);
  const panelHeight=isMobile?height*0.86:isMobile?height*0.78
  :Math.min(height*0.72,620);
  const panelX=(width-panelWidth)/2;
  const panelY=(height-panelHeight)/2;
  const panel=this.helpPanel;
  context.save();
  context.globalAlpha=1;
  context.globalCompositeOperation="source-over";
  context.shadowBlur=0;
  context.shadowColor="#00ffff";
  context.fillStyle="rgba(0,0,12,0.82)";
  context.fillRect(0,0,width,height);
  context.fillStyle="#061326";
  context.shadowBlur=24;
  context.strokeStyle="#00ffff";
  context.lineWidth=2;
  context.beginPath();
  context.roundRect(panel.x,panel.y,panel.width,panel.height,28);
  context.fill();
  context.stroke();
  context.shadowBlur=0;
  const titleSize=isMobile?Math.min(width*0.045,26):34;
  const keySize=isMobile?Math.min(width*0.032,19):25;
  const descriptionSize=isMobile?Math.min(width*0.028,17):23;
  context.textAlign="center";
  context.textBaseline="middle";
  context.fillStyle="#ffffff";
  context.font=`bold ${panel.titleSize}px Arial`;

  context.fillText(
    "KEYBOARD CONTROLS", panel.x+panel.width/2,panel.y+panel.padding+
    panel.titleSize/2
  );
  context.strokeStyle="rgba(0,217,255,0.35)";
  context.lineWidth=1;
  context.beginPath();
  context.moveTo(panelX+30,panelY+70);
  context.lineTo(
  panelX+panelWidth-30,panelY+70
  );
  context.stroke();
  context.textAlign="left";
  const controls=[
    ["W", "Accelerate"],["A/D", "Rotate"],
    ["SPACE", "fire weapon"],["E", "Pulse ability"],
    ["Q", "Switch weapon "],["Enter", "Start game"],
    ["T", "Fire twin bullet"]
  ];
  const keyX=panel.x+panel.width*0.16;
  const descriptionX=panel.x+panel.width*0.43;
  const firstRowY=panelY+panelHeight*0.27;
  const controlCount=7;
  this.helpPanel.rowSpacing=Math.min(48,(this.helpPanel.height-150)/controlCount);
  const rowSpacing=isMobile?panelHeight*0.105:42;
  controls.forEach(([key,description],index)=>{
    const currentY=firstRowY+index*rowSpacing;
    const startY=panel.y+panel.padding+panel.titleSize+42;
    context.fillStyle="#00e5ff";
    context.font=`bold ${panel.keySize}px Arial`;
    context.fillText(key,keyX,currentY);
    context.fillStyle="#f1f5ff";
    context.font=`${panel.descriptionSize}px Arial`;
    context.fillText(description,descriptionX,currentY);
  });
  context.strokeStyle="rgba(0,217,255,0.25)";
  context.lineWidth=1;
  context.beginPath();
  context.moveTo(
    panelX+30,panelY+panelHeight-55
  );
  context.lineTo(
    panelX+panelWidth-30,
    panelY+panelHeight-55
  );
  context.stroke();
  context.textAlign="center";
  context.fillStyle="#9fb5d1";
  context.font=`${isMobile?14:18}px Arial`;
  context.fillText("Tap menu to close",
    panel.x+panel.width/2,panel.y+panel.height-28
  );
  context.restore();
}

  render(context,camera){
    const width=this.game.canvas.width;
    const height=this.game.canvas.height;
    const centerX=width/2;
    const titleY=this.titleY;
    const subtitleY=this.subtitleY;
    const buttonY=this.startButton.y;
    const footerY=this.footerY;
    const scale=Math.min(width/1200,height/800);
    const gradient=context.createLinearGradient(
     0,0,width,height,
    );
    gradient.addColorStop(0,"#020024");
    gradient.addColorStop(0.5,"#090979");
    gradient.addColorStop(1,"#000010");
    context.fillStyle=gradient;
    context.fillRect(0,0,
    width,height
    );
    for(const star of this.stars){
      star.render(context);
    }
    for(const shooting of this.shootingStar){
      shooting.render(context);
    }
    context.stroke();
    context.fillStyle="#002244";
    context.beginPath();
    context.arc(
      width/2,height+200,
      300,0,Math.PI*2
    );
    context.fill();
    context.restore();
    this.ship.x=this.shipX;
    this.ship.y=this.shipY;
    this.ship.render(context);
    const titleSize=Math.min(width*0.09,60);
    const float=Math.sin(Date.now()*0.003)*8;
    context.save();
    context.shadowColor="#00ffff";
    context.shadowBlur=20;
    context.fillStyle="#ffffff";
    context.font=`bold ${titleSize}px Arial`;
    context.textAlign="center";
    context.fillText(
      "MATHLAB SPACE", centerX,titleY+float
    );
    context.shadowBlur=0;
    context.font="22px Arial";
    context.fillStyle="#bbbbbb";
    context.fillText(
      "Explore . Survive . Conquer",
      centerX, subtitleY
    );
    context.fill();
    context.restore();
    context.save();
    let pulse=Math.sin(Date.now()/300)*8;
    context.translate(
      this.startButton.x+this.startButton.width/2,
      this.startButton.y+this.startButton.height/2
    );
    context.scale(
      this.buttonScale,this.buttonScale
    );
    context.translate(
      -(this.startButton.x+this.startButton.width/2),
      -(this.startButton.y+this.startButton.height/2)
    );
    this.drawButton(
      context,this.startButton,"START GAME",{
        fontSize:Math.min(width*0.07,32)
      }
    );
    context.restore();
    this.drawButton(
      context,this.fullscreenButton,"ENTER FULLSCREEN",{
        fontSize:Math.min(width*0.035,18),
        borderRadius:18,
        fillStyle:"#0b1830",
        strokeStyle:"#5577aa"
      }
    );
    context.save();
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillStyle="#8d9bb5";
    context.font=`${Math.min(width*0.035,16)}px Arial`;
    context.shadowBlur0;
    context.fillText(
      "Created By Nasiru . Version 1.0",centerX,this.footerY
    );
    context.restore();
    context.save();
    context.globalAlpha=1;
    context.globalCompositeOperation="source-over";
    context.shadowBlur=0;
    context.shadowColor="transparent";
    context.fillStyle="#071426";
    context.strokeStyle="#00e5ff";
    context.lineWidth=2;
    context.font="30px Arial";
    context.beginPath();
    context.roundRect(
      this.helpButton.x,this.helpButton.y,
      this.helpButton.width,this.helpButton.height,14
    );
    context.fill();
    context.stroke();
    context.strokeStyle="#ffffff";
    context.lineWidth=3;
    context.lineCap="round";
    const iconCenterX=this.helpButton.x+this.helpButton.width/2;
    const iconCenterY=this.helpButton.y+this.helpButton.height/2;
    for(let i=-1;i<=1;i++){      
    const lineY=iconCenterY+i*9;
      context.beginPath();
      context.moveTo(iconCenterX-13,lineY);
      context.lineTo(iconCenterX+13,lineY);
      context.stroke();
    }
    context.restore();
    if(this.helpOpen){
      this.renderHelpPanel(context);
    }
  }
}