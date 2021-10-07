// canvas setup
//https://www.youtube.com/watch?v=jl29qI62XPg&list=PLYElE_rzEw_sowQGjRdvwh9eAEt62d_Eu&index=4
//https://codepen.io/franksLaboratory/pen/yLJdOBM
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerLeft = new Image();
playerLeft.src = '../images/ruby_running1.png';
const playerRight = new Image();
playerRight.src = '../images/ruby_running2.png';
const enemyLeft = new Image();
enemyLeft.src = '../images/kit_kat.png';

let score = 0;
let gameFrame = 0;
let enemySpeedStart = 0;
let bubbleModAmount = 50;
let gameOver = false;
ctx.font = '50px Georgia';

// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(e) {
    mouse.click = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
})

canvas.addEventListener('mouseup',function(e){
    mouse.click = false;
})

const bubblePop1 = document.createElement('audio');
bubblePop1.src = "./sounds/pop.ogg";

const bubblePop2 = document.createElement('audio');
bubblePop2.src =  "./sounds/Plop.ogg";

// player
class Player {
    
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 30;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 500;
        this.spriteHeight = 340;
        this.radiusIncreasedAt = 0;
        this.spriteScale = .30;
        this.spriteSource = playerLeft;

    }
    
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        
        if (gameFrame % 15 === 0) {
            this.frame++;

        }
        if (this.frame>3) {this.frame=0};
        
        if (mouse.x != this.x) {
            this.x -= dx/30;
        }
        if (mouse.y != this.y) {
            this.y -= dy/30;
        }
        if (score>0 && score % 5 == 0 && this.radiusIncreasedAt < score) {
            this.radiusIncreasedAt = score;
            this.radius = Math.min(this.radius * 1.10,200);
            this.spriteScale = Math.min(this.spriteScale/.9,1)
            this.spriteWidth = this.spriteWidth ;
            this.spriteHeight = this.spriteHeight ;
            enemySpeedStart = enemySpeedStart + .025;
            
                
        } else {
            this.radiusIncreased = false;
        }
        
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        
        let gradient = ctx.createRadialGradient(this.x, this.y, this.radius/2, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'gray');
        gradient.addColorStop(1, 'white');
        

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);
        // ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);


        if (this.x >= mouse.x) {
            this.spriteSource = playerLeft;
        } else {
            this.spriteSource = playerRight;
        };
        
        ctx.drawImage(this.spriteSource, 
                    (this.frameX + this.frame) * this.spriteWidth, 
                    this.frameY * this.spriteHeight, 
                    this.spriteWidth, 
                    this.spriteHeight, 
                    0-250 * this.spriteScale, 
                    0-180 * this.spriteScale, 
                    this.spriteWidth * this.spriteScale, 
                    this.spriteHeight * this.spriteScale);
        
        
        ctx.restore();

    
    
    }

}


const player = new Player();

const bubblesParams = {
    speed: Math.random() * 5 + 1 + (enemySpeedStart),
    bubbleModAmount: 40
}

// bubbles
const bubblesArray = [];
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        // this.x = canvas.width/2;
        this.y = canvas.height + 100;
        this.radius = 30;
        this.speed = bubblesParams.speed;
        this.distance;
        this.counted = false;
        this.sound = 'sound2';
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound1';
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        this.speed = this.speed + enemySpeedStart;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}


function handleBubbles() {
    if (gameFrame % bubblesParams.bubbleModAmount == 0) {
        bubblesArray.push(new Bubble());
        console.log(bubblesArray.length);
    }

    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }
    for (let i = 0; i < bubblesArray.length; i++){
        // if it goes over the side
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i,1);
            i--;
        } else if (bubblesArray[i]){
            // collision
            if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if (!bubblesArray[i].counted) {
                    if (bubblesArray[i].sound === 'sound1'){
                        bubblesArray[i].sound ? bubblePop1.play() : null;
                    } else {
                        bubblesArray[i].sound ? bubblePop2.play() :null;
                    }
                    score ++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i,1);
                    i--;
                }
            }
        }
    }
}

class Game {
    constructor(){
        this.bubbleAmounts = [15,40,80,100,200]
    }
    update() {
        if (score >= 100) {
            bubblesParams.bubbleModAmount = this.bubbleAmounts[4];
        } else if (score >= 20) {
            bubblesParams.bubbleModAmount = this.bubbleAmounts[3];
        } else if (score >= 10) {
            bubblesParams.bubbleModAmount = this.bubbleAmounts[2];
        } else if (score >= 5) {
            bubblesParams.bubbleModAmount = this.bubbleAmounts[1];
        }
        else if (score >= 0) {
            bubblesParams.bubbleModAmount = this.bubbleAmounts[0];
        }
    }

}

const game = new Game();

const background = new Image();
// background.src = 'background1.png';

function handleBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

class Enemy {
    constructor() {
        this.x = canvas.width - 200;
        this.y = Math.random() + (canvas.height - 150) + 90;
        this.radius = 30;
        this.speed = Math.random() * 4 + 1 + (enemySpeedStart);
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 463;
        this.spriteHeight = 263;
        this.radiusIncreasedAt = 0
        this.spriteScale = .40;
        this.searchSpeedCoefficient = 0.25;
    }
    update() {
        // this.x -= this.speed;
   
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);

        if (this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height +100) + 90;
        }
        if (gameFrame % 5 == 0) {
            this.frame++;
            // reset back to the first frame
            if (this.frame >= 12) this.frame = 0;

        }
        if (this.distance < this.radius + player.radius){
            handleGameOver();
        } else {
            this.x -= this.speed;
            this.y -= dy* this.searchSpeedCoefficient * this.speed/10
        }
    }

    draw() {
        // ctx.fillStyle = 'green';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        ctx.drawImage(enemyLeft, 
            this.frameX  * this.spriteWidth, 
            this.frameY * this.spriteHeight, 
            this.spriteWidth, 
            this.spriteHeight, 
            this.x - 120, 
            this.y-90, 
            this.spriteWidth * this.spriteScale, 
            this.spriteHeight * this.spriteScale);
        ctx.restore();
    }
}

function spawnEnemy(speedMultiplier, searchSpeedCoefficient){
    const enemy = new Enemy();
    enemy.speed = Math.random() * speedMultiplier + 1;
    enemy.searchSpeedCoefficient = searchSpeedCoefficient;
    enemyList.push(enemy);
}
const enemy1 = new Enemy();
const enemyList = [];
// enemyList.push(enemy1);

function handleEnemies() {
    enemyList.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    if (gameFrame === 500) {
        spawnEnemy(6,0);
    }
     else if (gameFrame === 1500) {
        spawnEnemy(7,.025);
    } else if (gameFrame === 4000) {
        spawnEnemy(8,.05);
    }
    // } else if (gameFrame === 4000) {
    //     spawnEnemy(9,.1);
    // }
}

enemyList.forEach(x=>{
    console.log(x.x,x.y);
})

function handleGameOver() {
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, you reached score ' + score, 110, 230);
    gameOver = true;

}

// animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    handleBackground;
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function preventBehavior(e) {
    e.preventDefault();
}

document.addEventListener("touchMove", preventBehavior, {passive: false});

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
    mouse.x = canvas.width/2;
    mouse.y = canvas.height/2;
    console.log('did it')
  });