//declaring the variables and loading the animation
var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var reset;
var resetImg;

var gameoverImg;
var gameover;

var trexrunning, trex;
var ground, groundimg, invisibleGround;
var edges;
var diesound, jumpsound, checkpoint;
var cloudImg;
var cloudGroup;
var rand; 
var ob1, ob2, ob3, ob4, ob5, ob6;
var obgroup;
var score;
var trexcollided;

function preload() {
  trexrunning = loadAnimation ("trex1.png", "trex3.png", "trex4.png");
 groundimg = loadImage ("ground2.png");
 cloudImg = loadImage ("cloud.png");
  ob1 = loadImage ("obstacle1.png");
  ob2 = loadImage ("obstacle2.png");
  ob3 = loadImage ("obstacle3.png");
  ob4 = loadImage ("obstacle4.png");
  ob5 = loadImage ("obstacle5.png");
  ob6 = loadImage ("obstacle6.png");
  gameoverImg = loadImage ("gameOver.png");
  resetImg = loadImage ("restart.png");
  trexcollided = loadAnimation ("trex_collided.png");
  diesound = loadSound ("die.mp3");
  jumpsound = loadSound ("jump.mp3");
  checkpoint = loadSound ("checkPoint.mp3");
}


//creates the sprites and img
  function setup(){
    createCanvas(windowWidth,windowHeight);
    obgroup = createGroup();
    cloudGroup = createGroup();
    //designs the trex
    trex = createSprite (50, height/1.8, 20, 20);
      trex.addAnimation ("trexrunning", trexrunning);
      trex.addAnimation ("trexcollided", trexcollided);
    trex.scale = 0.5;

     //designs the ground sprite
      ground = createSprite (width/2, height/1.1, width, 25);
      ground.addImage ("groundimg", groundimg);

 
  //creates the invisible ground
  invisibleGround = createSprite (width/2, height/1.08, width, 10);
  invisibleGround.visible = false;
  
score =0;
  gameover = createSprite(300, height/2, 20, 20);
  gameover.addImage("gameoverImg", gameoverImg);
  gameover.visible = false;
  gameover.scale = 0.5;
  
  
  reset = createSprite (300, height/3, 20, 20);
  reset.addImage ("resetImg", resetImg);
  reset.scale = 0.5;
  reset.visible = false;
  
 trex.debug = true; 
trex.setCollider ("circle", 0, 0, 40);
  
}


  
  
function draw(){
//console.log(frameCount);
//creates the background colour
    background("lightblue");
//creates boundaries for trex
  edges = createEdgeSprites();
  trex.collide(edges);
  
if (gamestate === PLAY){
  score = score + Math.round (getFrameRate()/30);
  ground.velocityX = -(6 + score/100);
  trex.changeAnimation("trexrunning", trexrunning);
  
  
  //if space key is pressed, the trex jumps
  if(touches.length > 0 || keyDown("space") && trex.y > 150){
    jumpsound.play();
    trex.velocityY = -8;
    touches = [];
  }  
    //creates gravity so that the trex can come back down 
    trex.velocityY = trex.velocityY + 0.4; 
    if(score % 500 === 0 && score >0){
      
      checkpoint.play();
    }
      if(obgroup.isTouching(trex)){
        diesound.play();
        trex.changeAnimation("trexcollided",trexcollided);
        gamestate = END;
        }
        //makes the ground infinite  
        if(ground.x<0){
        ground.x=width/2;
      }
        trex.collide(invisibleGround);
      ground.velocityX = -7 ;  
      
  spawnClouds();
      obstacles();

}

  else if (gamestate === END){
          cloudGroup.setLifetimeEach(-2);
          obgroup.setLifetimeEach(-1);
          gameover.visible = true;    
          trex.velocityY = 0;
          obgroup.setVelocityXEach(0);
          cloudGroup.setVelocityXEach(0);
          ground.velocityX = 0;  
          reset.visible = true;
      if (mousePressedOver(reset)){
          gamestate = PLAY; 
          cloudGroup.destroyEach();
          obgroup.destroyEach();
          reset.visible = false;
          gameover.visible = false;
          score = 0;
      }
  
  }

console.log(gamestate);
fill("black");
textSize(22);
text ("Score: " + score, 500, height/3.5);
  
  //makes the sprites visible 
  drawSprites();
}
//modulus code
function spawnClouds(){
  if (frameCount % 60 === 0){
    var cloud = createSprite (580, 50, 30, 30);
    cloud.addImage ("cloud", cloudImg);
    cloud.scale = 1;
    cloud.velocityX = -6;
    rand = Math.round(random(30,height/3));
    cloud.y = rand;
    //console.log(rand);
    cloudGroup.add(cloud);
    cloud.lifetime = 200;
  }
  
}
//creates the obstacles and the cases
function obstacles(){
  if(frameCount % 80 === 0){
  var ob=createSprite(width,height/1.12,50,50);
 
  //makes the variable contain a number between 1 and 6
  var rand = Math.round(random(1,6));
  ob.velocityX= -(6 + score/100);
  ob.scale = 0.6;  
  
  ob.lifetime = 450;  
    
   //a switch to add a random obstacle image to the sprite 
   switch(rand){

          case 1: ob.addImage("ob1", ob1);
          break;
          
          case 2: ob.addImage("ob2", ob2);
          break;
          
          case 3: ob.addImage("ob3", ob3);
          break;
          
          case 4: ob.addImage("ob4", ob4);
          break;
          
          case 5: ob.addImage("ob5", ob5);
          break;
          
          case 6: ob.addImage("ob6", ob6);
          break;
          
          default:  
          break;
                }
 
        //creating an obstacle group
          obgroup.add(ob); 
  }
}

