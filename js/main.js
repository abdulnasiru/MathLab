let landscapeRequested=false;

async function requestLandscape(){
  if(landscapeRequested) return;
  try{
    if(screen.orientation && screen.orientation.lock){
      await screen.orientation.lock("landscape");
      landscapeRequested=true;
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
const orientationTitle=document.getElementById("orientationTitle");
const orientationMessage=document.getElementById("orientationMessage");
const orientationSubmessage=document.getElementById("orientationSubmessage");
const orientationFullscreenButton=document.getElementById("orientationFullscreenButton");

function updateOrientationScreen(){
  const isLandscape=window.matchMedia("(orientation:landscape)").matches;
  const isFullscreen=!!document.fullscreenElement;
  if(isFullscreen){
    orientationOverlay.style.display="none";
    return;
  }
  if(isLandscape){
    orientationOverlay.style.display="flex";
    orientationTitle.textContent="MathLab Space";
    orientationMessage.textContent="Landscape Mode Ready";
    orientationSubmessage.textContent="Enter fullscreen to continue";
    orientationFullscreenButton.style.display="block";
    orientationFullscreenButton.style.visibility="visible";
    orientationFullscreenButton.style.opacity="1";
  }
  else{
    orientationOverlay.style.display="flex";
    orientationTitle.textContent="MathLab Space";
    orientationMessage.textContent="Rotate Your Device";
    orientationSubmessage.textContent="Landscape mode required";
    orientationFullscreenButton.style.display="none";
    orientationFullscreenButton.style.visibility="hidden";
    orientationFullscreenButton.style.opacity="0";
  }
}

let mathLabFullscreenActive=false;
let fullscreenRequested=false;

async function enterFullscreen(){
  if(fullscreenRequested){ return;}
  try{
    if(!document.fullscreenElement){
      if(document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen({
          navigationUI:"hide"
        });
    }}
    if(screen.orientation && screen.orientation.lock){
      try{
        await screen.orientation.lock("landscape");
      }
      catch(orientationError){
        console.warn("Landscape lock unavailable:", orientationError);
      }
    }
    fullscreenRequested=true;
    mathLabFullscreenActive=true;
  }
  catch(error){
    console.log("Fullscreen unavailable:", error);
  }
  await requestLandscape();
  resizeCanvas();
  orientationOverlay.style.display="none";
}
  
orientationFullscreenButton.addEventListener("click",()=>{
  enterFullscreen();
});
window.addEventListener("resize",updateOrientationScreen);
window.addEventListener("orientationchange",updateOrientationScreen);
document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement){
    fullscreenRequested=false;
    mathLabFullscreenActive=false;
    orientationOverlay.style.display="block";
  updateOrientationScreen();
  }
});
updateOrientationScreen();

window.enterMathLabFullscreen=enterFullscreen;
document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement){
    fullscreenRequested=false;
    orientationOverlay.style.display="block";
    updateOrientationScreen();
  }
});

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
  const width=window.innerWidth;
  const height=window.innerHeight;
  canvas.width=width;
  canvas.height=height;
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
waitForLandscape();