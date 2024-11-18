function loadTexture(path)
{
    return new Promise
    ((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () =>
        {
            resolve(img);
        };
    })
}
   
window.onload = async() =>
{
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const heroImg = await loadTexture('assets/player.png');
    const enemyImg = await loadTexture('assets/enemyShip.png');
    const Background = await loadTexture('assets/starBackGround.png');
    ctx.fillStyle = ctx.createPattern(Background, 'repeat');
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(heroImg, canvas.width/2 - 45, canvas.height - (canvas.height / 4));
    ctx.drawImage(heroImg, canvas.width / 2 - 70 - heroImg.width * 0.35, canvas.height - (canvas.height / 4 - 20), heroImg.width * 0.5, heroImg.height * 0.5);
    ctx.drawImage(heroImg, canvas.width / 2 + 100 - heroImg.width * 0.35, canvas.height - (canvas.height / 4 - 20), heroImg.width * 0.5, heroImg.height * 0.5);


    function createEnemies(ctx, canvas, enemyImg)
    {
        const MONSTER_TOTAL = 5;
        const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2;
        const STOP_X = START_X + MONSTER_WIDTH;
        for (let x = START_X; x < STOP_X; x += enemyImg.width)
        {
            for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height)
            {
                ctx.drawImage(enemyImg, x, y);
            }
        }
    }

    function createEnemies2(ctx, canvas, enemyImg) {
        const ROWS = 5; // 피라미드 층수
        const startY = 0; // 피라미드의 시작 y 위치
        const spacing = enemyImg.width + 10; // 적군 간의 간격
    
        for (let row = 0; row < ROWS; row++) {
            // 각 행의 시작 x 위치를 계산하여 중앙에 맞춤
            const startX = (canvas.width - (ROWS - row) * spacing) / 2;
    
            for (let col = 0; col < ROWS - row; col++) {
                const x = startX + col * spacing;
                const y = startY + row * (enemyImg.height + 10);
                ctx.drawImage(enemyImg, x, y);
            }
        }
    }

    createEnemies2(ctx, canvas, enemyImg);
};