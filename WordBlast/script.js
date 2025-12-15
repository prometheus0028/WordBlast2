const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const gameOverScreen = document.getElementById('game-over');
const input_mob=document.getElementById('mobile-Input');


canvas.width = 800;
canvas.height = 600;


let score = 0;
let isGameOver = false;
let spawnRate = 2000; 
let lastSpawnTime = 0;


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
    "dependency", "immutability", "responsiveness",
];


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

function spawnEnemy() {
    const text = wordList[Math.floor(Math.random() * wordList.length)];
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = -20; 
    enemies.push(new Enemy(x, y, text));
}

function gameOver() {
    isGameOver = true;
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function handleInput(key) {
    if (isGameOver) return;
    key=key.toLowerCase();
    for ( i=0; i<enemies.length;i++){
        if (enemies[i].text[0]?.toLowerCase()===key) {
            enemies[i].text=enemies[i].text.slice(1);
            if (enemies[i].text===""){
                enemies.splice(i,1);
                score+=10;
                scoreElement.innerText=score;
            }
            break;
        }
    }
}

window.addEventListener('keydown', (e) => {
    handleInput(e.key);
});

canvas.addEventListener('touchstart', () => {
    mobileInput.focus();
});

mobileInput.addEventListener('input', () => {
    const value=mobileInput.value;
    if (value.length>0) {
        handleInput(value[value.length-1]);
        mobileInput.value="";
    }
});

function gameLoop(timestamp) {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (timestamp - lastSpawnTime > spawnRate) {
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

    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);