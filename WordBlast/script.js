const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const bestscoreelement=document.getElementById('best-score');
const gameOverScreen = document.getElementById('game-over');


canvas.width = 800;
canvas.height = 600;


let score = 0;
let isGameOver = false;
let spawnRate = 2000; 
let lastSpawnTime = 0;
let best=localStorage.getItem("best-score");
best=best?parseInt(best):0;
bestscoreelement.innerText=best;

let boss_online=false; 
let boss=null; 
let nextBossScore=1000;

const wordList = [
    "code", "bug", "fix", "git", "push", "pull", "merge", 
    "java", "node", "html", "css", "react", "vue", "data",
    "loop", "if", "else", "var", "let", "const", "array",
    "function", "object", "class", "method", "scope", "return",
    "string", "number", "boolean", "switch", "event", "listener",
    "react", "vue", "script", "style", "json", "api", "promise",
    "commit", "merge", "branch", "clone", "debug",
     "asynchronous", "synchronous", "polymorphism", "encapsulation",
    "inheritance", "abstraction", "multithreading", "concurrency",
    "serialization", "deserialization", "authentication",
    "authorization", "cryptography", "virtualization",
    "microservices", "containerization", "orchestration",
    "middleware", "architecture", "optimization",
    "recursion", "backtracking", "memoization",
    "normalization", "denormalization",
    "dependency", "immutability", "responsiveness"
];
const bossWords = [ "Supercalifragilisticexpialidocious", 
    "Pneumonoultramicroscopicsilicovolcanoconiosis", 
    "Antidisestablishmentarianism" ];

let enemies = [];

class Enemy {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.speed = 1 + Math.random(); 
        this.color = '#0f0';
    }

    draw() {
        ctx.font = '20px Courier New';
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    update() {
        this.y += this.speed;
    }
}

class Boss { constructor(text) { 
    this.text=text; 
    this.maxhealth=text.length;
    this.health=this.maxhealth; 
    this.x=canvas.width/2-200; 
    this.y=60; this.speed=0.3; 
} 
    draw() { 
        ctx.font='24px Courier New'; 
        ctx.fillStyle='#ff5555'; 
        ctx.fillText(this.text,this.x,this.y); 
        ctx.fillStyle='#333'; 
        ctx.fillRect(this.x,this.y+10,400,10); 
        ctx.fillStyle='#ff0000'; 
        ctx.fillRect( this.x, this.y+10, (this.health/this.maxhealth)*400, 10 ); 
    } 
    update() { 
        this.y+=this.speed; 
    } 
}

function spawnEnemy() {
    const text = wordList[Math.floor(Math.random() * wordList.length)];
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = -20; 
    enemies.push(new Enemy(x, y, text));
}
function spawnBoss() { 
    boss_online=true; 
    enemies=[]; 
    const word=bossWords[Math.floor(Math.random()*bossWords.length)]; 
    boss=new Boss(word); 
}
function gameOver() {
    isGameOver = true;
    finalScoreElement.innerText = score;
    if (score>best) {
        best=score;
        localStorage.setItem("best-score",best);
        bestscoreelement.innerText=best;
    }
    gameOverScreen.classList.remove('hidden');
}


window.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    const key = e.key.toLowerCase();

    if (boss_online && boss) { 
        if (boss.text[0]?.toLowerCase() === key) { 
            boss.text=boss.text.slice(1); 
            boss.health--; if (boss.health<=0) { 
                boss_online=false; 
                boss=null; 
                nextBossScore+=1000; 
            } 
        } 
        return; 
    }

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].text[0] && enemies[i].text[0].toLowerCase() === key) {
            enemies[i].text = enemies[i].text.slice(1);

            if (enemies[i].text === "") {
                enemies.splice(i, 1);
                score += 10;
                scoreElement.innerText = score;
                if (score>=nextBossScore) { spawnBoss(); } 
            }
            break;
        }
    }
});

function gameLoop(timestamp) {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (!boss_online &&timestamp - lastSpawnTime > spawnRate) {
        spawnEnemy();
        lastSpawnTime = timestamp;

        if (spawnRate > 500) spawnRate -= 10;
    }


    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.update();
        enemy.draw();

        if (enemy.y > canvas.height) {
            gameOver();
        }
    }
    if (boss_online && boss) { 
        boss.update();
        boss.draw(); 
        if (boss.y > canvas.height) { gameOver(); }
    }

    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);