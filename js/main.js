let landscapeRequested=false;
async function requestLandscape(){
  if(landscapeRequested) return;
  landscapeRequested=true;
  try{
    if(screen.orientation && screen.orientation.lock){
      await screen.orientation.lock("landscape");
    }
  }
  catch(error){
    console.log("Landscape mode request unavailable:", error);
  }
}
window.addEventListener("touchstart",requestLandscape,{
  once:true
});

import {Game} from "./engine/Game.js";
import {Star} from "./entities/Star.js";
import {Ship} from "./entities/Ship.js";
import { Universe } from "./world/Universe.js";
import { Asteroid } from "./entities/Asteroid.js";
import { AsteroidField } from "./world/AsteroidField.js";

const canvas=document.getElementById("gameCanvas");
const orientationOverlay=document.getElementById("orientationOverlay");

async function enterFullscreen(){
  try{
    if(!document.fullscreenElement){
      if(document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen();
      }
    }
  }
  catch(error){
    console.log("Fullscreen unavailable:", error);
  }
  try{
    if(screen.orientation && screen.orientation.lock){
      await screen.orientation.lock("landscape")
    }
  }
  catch(error){
    console.log("Landscape lock unavailable:", error);
  }
  resizeCanvas();
}

function exitMathLabFullscreen(){
  if(document.fullscreenElement){
    document.exitFullscreen().catch(()=>{});
  }
}
document.addEventListener("fullscreenchange", ()=>{
  resizeCanvas();
});

function isLandscape(){
  return window.innerWidth>window.innerHeight;
}
function resizeCanvas(){
  if(!isLandscape()) return;
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resizeCanvas();

let gameStarted=false;
function waitForLandscape(){
  if(!isLandscape()){
    return;
  }
setTimeout(()=>{
  if(!isLandscape()) return;
  resizeCanvas();
  startMathLab();
},150);}

async function startMathLab(){
  if(gameStarted) return;
  gameStarted=true;
  resizeCanvas();

  const game=new  Game(canvas);
  const ship=new Ship(
    canvas.width/2,
    canvas.height/2,
    game
  );
  game.ship=ship;
  game.weaponButton.ship=ship;
  game.add(ship);
  game.camera.follow(ship);
  const stars=[];
  function randomStarColor(){
    const colors=[
    "white","white","white","lightblue","pink","yellow","orange","lightgreen"
    ];
    return colors[Math.floor(Math.random()*colors.length)];
  }

  for(let i=0;i<100;i++){
  const star=new Star(
    Math.random()*canvas.width,
    Math.random()*canvas.height,
    Math.random()*3+1,
    randomStarColor(),
  );
  stars.push(star);
  game.add(star);
  }

  const universe=new Universe(game);
  game.universe=universe;
  universe.generate();
  const asteroidField=new AsteroidField(game);
  asteroidField.generate();
  const asteroid=new Asteroid(
    600,400,50
  );
  game.add(asteroid);
  game.start();

}

window.addEventListener("resize",()=>{
  if(!isLandscape()){return;}
  if(!gameStarted){
    waitForLandscape();
    return;
  }
  resizeCanvas();
});
window.addEventListener("orientationchange",waitForLandscape);
requestLandscape();
waitForLandscape();