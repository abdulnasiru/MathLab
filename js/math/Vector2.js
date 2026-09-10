export class Vector2{
  constructor(x=0,y=0){
    this.x=x;
    this.y=y;
  }
  
  add(vector){
    this.x+=vector.x;
    this.y+=vector.y;
    return this;
  }

  subtract(vector){
    this.x-=vector.x;
    this.y-=vector.y;
    return this;
  }

 multiply(number){
      this.x*=number;
      this.y*=number;
      return this;
  }

  divide(number){
    if(number!==0){
      this.x/=number;
      this.y/=number;
    }
    return this;
  }

  length(){
    return Math.sqrt(
      this.x*this.x+this.y*this.y
    );
  }

  normalize(){
    let len=this.length();
    if(len>0){
      this.divide(len);
    }
    return this;
  }

  dot(vector){
    return(
      this.x*vector.x+this.y*vector.y
    );
  }

  cross(vector){
    return(
      this.x*vector.y-this.y*vector.x
    );
  }

  distance(vector){
    return this.subtract(vector).length();
  }

  clone(){
    return new Vector2(
      this.x,
      this.y
    );
  }

}