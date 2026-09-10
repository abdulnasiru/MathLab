export class Input{
  constructor(){
  this.controlMode="joystick";
  this.moveX=0;
  this.moveY=0;
  this.fire=false;
  this.pulse=false;
  this.keys={};
  this.touch={
    up:false,
    left:false,
    right:false,
    fire:false,

  };

window.addEventListener("keydown",(event)=>{
  this.keys[event.code]=true;
  
});

window.addEventListener("keyup",(event)=>{
  this.keys[event.code]=false;
});
  }

  
  changeControl(mode){
    this.controlMode=mode;
  }
  
}