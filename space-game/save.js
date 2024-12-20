// 스테이지 번호 변수 추가
let currentStage = 1;
const MAX_STAGE = 3; // 최대 스테이지 수

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
    clear() {
        this.listeners = {};
    }
}

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = "";
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }

    rectFromGameObject() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }    
    
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = "Hero";
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
        this.life = 3;
        this.points = 0;
    }
    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 발사
            this.cooldown = 500; // 쿨다운 500ms
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);
                }
            }, 100);
        }
    }

    canFire() {
        return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }

    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    }

    incrementPoints() {
        this.points += 100;
    }
}

class HeroSub extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 33;
        this.height = 25;
        this.type = "HeroSub";
        this.cooldown = 1000; // 발사 간격 (1초)
        this.lastFire = Date.now();
    }

    fire() {
        const now = Date.now();
        if (now - this.lastFire >= this.cooldown) {
            gameObjects.push(new Laser(this.x + 12, this.y - 10)); // 레이저 발사
            this.lastFire = now;
        }
    }
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 9;
        this.height = 33;
        this.type = "Laser";
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id);
            }
        }, 100);
    }

    rectFromGameObject() {
        return {
            x: this.x,
            y: this.y,
            width: this.width, // 레이저의 폭
            height: this.height // 레이저의 높이
        };
    }
    
}

class Explosion extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 98;
        this.type = "Explosion";
        this.img = laserGreenShotImg; // 폭발 이미지
        setTimeout(() => {
            this.dead = true; // 일정 시간이 지나면 삭제
        }, 500);
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                clearInterval(id);
            }
        }, 300);
    }
}

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 500; // 보스 크기
        this.height = 300;
        this.img = bossImg;
        this.speed = 15;
        this.health = 30; // 체력 30
        this.dead = false; // 보스 상태
    }

    move() {
        // 양옆으로 이동
        this.x += this.speed;
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.speed *= -1; // 벽에 닿으면 반대 방향으로 이동
        }
    
        // 아래로 이동
        if (!this.movingDown && Math.random() < 0.9) { 
            this.movingDown = true;
            this.moveDownStep = 20; // 한 번에 내려갈 거리 설정
        }
    
        if (this.movingDown) {
            this.y += 2; // 아래로 이동
            this.moveDownStep -= 2; // 이동 거리 감소
            if (this.moveDownStep <= 0) {
                this.movingDown = false;
                if (Math.random() < 0.1) {
                    this.y -= 50; // 위로 이동
                }
            }
        }
    }

    takeDamage(damage = 1) {
        this.health -= damage;
        if (this.health <= 0) {
            this.dead = true;
            eventEmitter.emit(Messages.GAME_END_WIN); // 보스가 죽으면 승리 이벤트
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.font = "20px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(`HP: ${this.health}`, this.x + this.width / 2, this.y - 10); // 체력 표시
    }

    rectFromGameObject() {
        return {
            x: this.x,
            y: this.y,
            width: this.width, // 레이저의 폭
            height: this.height // 레이저의 높이
        };
    }
}


let onKeyDown = function (e) {
    switch (e.keyCode) {
        case 37: // 왼쪽 화살표
        case 39: // 오른쪽 화살표
        case 38: // 위쪽 화살표
        case 40: // 아래쪽 화살표
        case 32: // 스페이스바
            e.preventDefault();
            break;
    }
};

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};

let heroImg,
    enemyImg,
    laserImg,
    laserGreenShotImg,
    canvas,
    ctx,
    gameObjects = [],
    hero,
    lifeImg,
    starBackground;
    eventEmitter = new EventEmitter();

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    });
}

function intersectRect(r1, r2) {
    return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y
    );
}

function initGame() {
    gameObjects = [];
    createEnemies(currentStage); // 현재 스테이지에 맞는 적 생성
    createHero();

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 30;
        heroSub1.y -= 30;
        heroSub2.y -= 30;
    });
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 30;
        heroSub1.y += 30;
        heroSub2.y += 30;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 30;
        heroSub1.x -= 30;
        heroSub2.x -= 30;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 30;
        heroSub1.x += 30;
        heroSub2.x += 30;
    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    // 보스와 히어로의 충돌 처리
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        if (first instanceof Boss) {
            first.takeDamage();
            second.dead = true;
        } else if (second instanceof Boss) {
            second.takeDamage();
            first.dead = true;
        } else {
            first.dead = true;
            second.dead = true;
            hero.incrementPoints();
        }
    });

    // 보스와 히어로의 충돌 처리
    eventEmitter.on(Messages.COLLISION_BOSS_HERO, (_, { boss }) => {
        // 히어로 생명 3 감소
        hero.life -= 3;

        // 히어로가 죽었는지 확인
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
        }
    });


    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        if (enemy instanceof Boss) {
            hero.decrementLife();
            if (isHeroDead()) {
                eventEmitter.emit(Messages.GAME_END_LOSS);
            }
        } else {
            enemy.dead = true;
            hero.decrementLife();
            if (isHeroDead()) {
                eventEmitter.emit(Messages.GAME_END_LOSS);
            }
        }
    });

    eventEmitter.on(Messages.GAME_END_WIN, () => {
        if (currentStage < MAX_STAGE) {
            currentStage++;
            resetStage();
        } else {
            // 3스테이지에서 보스가 제거된 경우에만 게임 승리
            const remainingBoss = gameObjects.find((go) => go instanceof Boss && !go.dead);
            if (!remainingBoss) {
                endGame(true);
            }
        }
    });

    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false);
    });

    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
        if (isHeroDead() || currentStage > MAX_STAGE) {
            currentStage = 1; // 게임 초기화
            resetGame();
        }
    });
}

// 보스 등장 로직 추가
function createEnemies(stage) {
    if (stage === MAX_STAGE) {
        // 보스 생성
        const boss = new Boss(canvas.width / 2 - 150, 50); // 위치 조정
        gameObjects.push(boss);
    } else {
        // 일반 적 생성
        const MONSTER_TOTAL = 5 + stage; // 스테이지마다 적 수 증가
        const MONSTER_WIDTH = MONSTER_TOTAL * 98;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2;
        const STOP_X = START_X + MONSTER_WIDTH;
        for (let x = START_X; x < STOP_X; x += 98) {
            for (let y = 0; y < 50 * 5; y += 50) {
                const enemy = new Enemy(x, y);
                enemy.img = enemyImg;
                enemy.speed = 2 + stage; // 스테이지마다 적 속도 증가
                gameObjects.push(enemy);
            }
        }
    }
}

function isEnemiesDead() {
    const remainingEnemies = gameObjects.filter(
        (go) => (go.type === "Enemy" || go instanceof Boss) && !go.dead
    );
    return remainingEnemies.length === 0;
}

function resetStage() {
    gameObjects = [];
    createEnemies(currentStage);

    // 히어로 위치 초기화
    hero.x = canvas.width / 2 - 45;
    hero.y = canvas.height - canvas.height / 4;

    // 서브 히어로 위치 초기화
    heroSub1.x = hero.x - 50;
    heroSub1.y = hero.y + 30;
    heroSub2.x = hero.x + 120;
    heroSub2.y = hero.y + 30;

    // 게임 오브젝트 배열에 히어로와 서브 히어로 유지
    gameObjects.push(hero, heroSub1, heroSub2);
}

function drawStage() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(`Stage: ${currentStage}`, 10, 30);
}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );

    heroSub1 = new HeroSub(
        canvas.width / 2 + 75,
        canvas.height - (canvas.height / 4) + 30
    );

    heroSub2 = new HeroSub(
        canvas.width / 2 - 100,
        canvas.height - (canvas.height / 4) + 30
    );

    hero.img = heroImg;
    heroSub1.img = heroImg;
    heroSub2.img = heroImg;
    gameObjects.push(hero, heroSub1, heroSub2);
}

function drawLife() {
    const START_POS = canvas.width - 180;
    for (let i = 0; i < hero.life; i++) {
        ctx.drawImage(
            lifeImg,
            START_POS + (45 * (i + 1)),
            canvas.height - 37);
    }
}

function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + hero.points, 10, canvas.height - 20);
}

function drawText(message, x, y) {
    ctx.fillText(message, x, y);
}

function drawGameObjects(ctx) {
    gameObjects.forEach((obj) => {
        obj.draw(ctx);
        if (obj instanceof Boss) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText(`HP: ${obj.health}`, obj.x + obj.width / 2, obj.y - 10);
        }
    });
}

function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    const heroSubs = gameObjects.filter((go) => go.type === "HeroSub");
    const bosses = gameObjects.filter((go) => go instanceof Boss && typeof go.rectFromGameObject === "function");

    // 히어로 서브 공격 처리
    heroSubs.forEach((sub) => sub.fire());

    // 레이저와 적/보스 충돌 처리
    lasers.forEach((laser) => {
        enemies.forEach((enemy) => {
            if (intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: laser,
                    second: enemy,
                });
                const explosion = new Explosion(enemy.x, enemy.y);
                gameObjects.push(explosion);
            }
        });
    });

    lasers.forEach((laser) => {
        bosses.forEach((boss) => {
            if (intersectRect(laser.rectFromGameObject(), boss.rectFromGameObject())) {
                boss.takeDamage(1); // 데미지 1 감소
                laser.dead = true; // 레이저 삭제
                const explosion = new Explosion(laser.x, laser.y); // 충돌 위치에 폭발 효과
                gameObjects.push(explosion);
            }
        });
    });    

    // 적과 히어로 충돌 처리
    enemies.forEach((enemy) => {
        if (intersectRect(hero.rectFromGameObject(), enemy.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }
    });

    // 보스와 히어로 충돌 처리
    bosses.forEach((boss) => {  
        if (intersectRect(hero.rectFromGameObject(), boss.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_BOSS_HERO, { boss });
        }
    });

    // 파괴된 객체 제거
    gameObjects = gameObjects.filter((go) => !go.dead);

    // 게임 종료 조건 확인
    if (isHeroDead()) {
        eventEmitter.emit(Messages.GAME_END_LOSS);
    } else if (isEnemiesDead()) {
        eventEmitter.emit(Messages.GAME_END_WIN);
    }
}

function isHeroDead() {
    return hero.life <= 0;
}

function endGame(win) {
    clearInterval(gameLoopId);
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win) {
            displayMessage("Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew", "green");
            currentStage = MAX_STAGE + 1; // MAX_STAGE 이상으로 설정하여 승리 상태로 간주
        } else {
            displayMessage("You died !!! Press [Enter] to start a new game Captain Pew Pew");
        }
    }, 200);
}

function startGameLoop() {
    if (!gameLoopId) { // 게임 루프가 이미 실행 중인 경우 중복 실행 방지
        gameLoopId = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(starBackground, 0, 0, canvas.width, canvas.height);

            // 보스 및 게임 객체 업데이트
            gameObjects.forEach(obj => {
                if (obj instanceof Boss) {
                    obj.move();
                }
            });

            drawGameObjects(ctx);
            updateGameObjects();
            drawPoints();
            drawLife();
            drawStage(); // 현재 스테이지 표시
        }, 100);
    }
}

function stopGameLoop() {
    if (gameLoopId) {
        clearInterval(gameLoopId); // 게임 루프 중지
        gameLoopId = null; // ID 초기화
    }
}


function resetGame() {
    stopGameLoop(); // 기존 게임 루프 중지
    eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지

    currentStage = 1; // 게임 초기화
    initGame(); // 게임 초기 상태 실행
    startGameLoop(); // 게임 루프 시작
}


function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}



window.addEventListener("keydown", onKeyDown);

window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (evt.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
    else if (evt.key === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
});

let gameLoopId = null; // 게임 루프 ID 초기화

window.onload = async () => {
    // 텍스처 로드
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    laserGreenShotImg = await loadTexture("assets/laserGreenShot.png");
    lifeImg = await loadTexture("assets/life.png");
    bossImg = await loadTexture("assets/boss.png");
    starBackground = await loadTexture("assets/starBackground.png");

    // 게임 시작
    initGame();
    startGameLoop(); // 게임 루프 시작
};