import { Asteroid } from "../entities/Asteroid.js";
export class AsteroidField{
  constructor(game){
    this.game=game;
    this.asteroids=[];
    this.maxAsteroids=30;
    this.spawnDistance=1500;
    this.count=25;
  }
  update(){
    this.spawnAroundPlayer();
  }

  spawnAroundPlayer(){
    const ship=this.game.ship;
    if(!ship) return;
    while(this.asteroids.length<this.maxAsteroids){
      const angle=Math.random()*Math.PI*2;
      const distance=this.spawnDistance+Math.random()*1000;
      const x=ship.position.x+Math.cos(angle)*distance;
      const y=ship.position.y+Math.sin(angle)*distance;
      const size=20+Math.random()*60;
      const asteroid=new Asteroid(x,y,size);
      this.asteroids.push(asteroid);
      this.game.add(asteroid);
    }
  }

  removeDestroyed(){
    this.asteroids=this.asteroids.filter(asteroid=>!asteroid.destroyed);
  }

    generate(){
    for(let i=0;i<this.count;i++){
      const x=Math.random()*8000-4000;
      const y=Math.random()*8000-4000;
      const size=20+Math.random()*60;
      const asteroid=new Asteroid(
        x,
        y,
        size
      );
      this.asteroids.push(
        asteroid
      );
      this.game.add(
        asteroid
      );
    }
  }
  
  render(context, camera){
   asteroid.render(context, this.light);
  }
}
