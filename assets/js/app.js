const inner_container = document.querySelector('.inner-container');
inner_container.style.display = 'none';

window.onload = function () {

    let bordWidth;
    let bordHeight;

    if (window.innerWidth > 576) {
        bordWidth = window.innerHeight * 0.7;
        bordHeight = window.innerHeight * 0.8;
    } else if (window.innerWidth > 375) {
        bordWidth = window.innerWidth - 30;
        bordHeight = (window.innerWidth * 1.8) - 30;
    } else {
        bordWidth = window.innerWidth - 30;
        bordHeight = (window.innerWidth * 1.3) - 30;
    }
    // bord = window.innerWidth / 2;
    const game_area = document.querySelector('#game-area');
    const floor = document.querySelector('#floor');
    const startPause = document.getElementById('startPause');
    const Message = document.getElementById('Message');
    const score = document.getElementById('score');
    const restart = document.getElementById('restart');
    const next = document.getElementById('next');
    const timer = document.getElementById('timer');
    const gamelevel = document.getElementById('level');
    const left = document.getElementById('left');
    const right = document.getElementById('right');

    inner_container.style.width = bordWidth + 'px';
    inner_container.style.height = bordHeight + 'px';
    inner_container.style.display = 'unset';

    // block create variable--------------
    const gameAreaWidth = game_area.offsetWidth;
    const gameAreaHeight = game_area.offsetHeight;


    // const random = (min, max) => {
    //     return Math.abs((Math.random() * (max - min)) + min)
    // }

    let currentlevel = 1;
    let numberOfBlocks_Xaccess = 4;
    let numberOfBlocks_Yaccess = currentlevel;
    const blockWidth = (gameAreaWidth / numberOfBlocks_Xaccess) - (numberOfBlocks_Xaccess * numberOfBlocks_Xaccess);
    const blockHeight = 15;
    let blockItem;
    let block = [];
    const leftPosition = gameAreaWidth / 2;

    const userWidth = floor.offsetWidth;
    const userHeight = floor.offsetHeight;
    let userPosition = [leftPosition - (userWidth / 2), gameAreaHeight - 30];
    let UserpositionSpeed = 7;

    const radius = 7.5;
    let ballPotion = [leftPosition - radius, gameAreaHeight - ((userHeight * 2) + (radius * 5))];

    let speed = 5;
    let xDirection = speed;
    let yDirection = speed;
    let allBlocks;
    let numScore = 0;
    let numHit = 0;
    let level = 1;
    let intervalID;
    let inetrvalMove;

    // message ------------
    const mess = {
        win: "Congratulations! you win",
        lost: "Game over",
        finish: "Congratulations! you finish the game",
    };


    // functional area ---------------
    // reload game ----------
    function reload() {
        numScore -= numHit;
        if (numScore < 0) { numScore = 0; }
        score.innerHTML = numScore;
        block = [];
        numberOfBlocks_Yaccess = level;
        userPosition[0] = leftPosition - (userWidth / 2);
        userPosition[1] = gameAreaHeight - 30;
        ballPotion[0] = leftPosition - radius;
        ballPotion[1] = gameAreaHeight - ((userHeight * 2) + (radius * 5));

        // prev block remove
        let allBlocksInGAme = document.querySelectorAll('#game-area div');
        allBlocksInGAme.forEach((item) => {
            if (item.className === "" || item.className === "block") {
                game_area.removeChild(item);
            }
        })

        createBlock();
        drawball();
        drawUser();
        restart.classList.add('displayNone');
        Message.classList.add('displayNone');
        next.classList.add('displayNone');
        startPause.classList.toggle('displayNone');
        startIconChange();
        ball.style.background = '#fff'; // ball color
    }

    // level up -----------
    function levelUp() {
        block = [];
        currentlevel++;
        numberOfBlocks_Yaccess = currentlevel;
        level = currentlevel;
        gamelevelCur(level);

        if (level > 4 && level < 6) {
            speed = 7;
        } else if (level > 6) {
            speed = 10;
        } else if (level < 4) {
            speed = 5;
        }
        xDirection = speed;
        yDirection = speed;

        next.classList.add('displayNone');
        numHit = 0;
        userPosition[0] = leftPosition - (userWidth / 2);
        userPosition[1] = gameAreaHeight - 30;
        ballPotion[0] = leftPosition - radius;
        ballPotion[1] = gameAreaHeight - ((userHeight * 2) + (radius * 5));
        createBlock();
        drawball();
        drawUser();

        restart.classList.add('displayNone');
        Message.classList.add('displayNone');
        startPause.classList.toggle('displayNone');
        startIconChange();
        ball.style.background = '#fff'; // ball color

        // prev block remove
        let allBlocksInGAme = document.querySelectorAll('#game-area div');
        allBlocksInGAme.forEach((item) => {
            if (item.className === "") {
                game_area.removeChild(item);
            }
        })
    }

    // block create class--------------
    class Block {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = blockWidth;
            this.height = blockHeight;
            this.left = x;
            this.right = x + blockWidth;
            this.top = y;
            this.bottom = y + blockHeight;
        }
    }

    // block create loop--------------
    function createBlock() {
        for (let i = 0; i < numberOfBlocks_Yaccess; i++) {
            for (let j = 0; j < numberOfBlocks_Xaccess; j++) {
                let xAccess = ((blockWidth + 10) * j) + 20;
                let yAccess = (30 * i) + 30;
                blockItem = new Block(xAccess, yAccess);
                block.push(blockItem);
            }
        }

        // block create div add style add--------------
        block.forEach((element) => {
            let blockDiv = document.createElement('div');
            blockDiv.className = 'block';
            blockDiv.style.width = element.width + "px";
            blockDiv.style.height = element.height + "px";
            blockDiv.style.left = element.x + "px";
            blockDiv.style.top = element.y + "px";
            game_area.appendChild(blockDiv);
        });
    }

    createBlock();


    //  floor------------
    function drawUser() {
        floor.style.width = userWidth + 'px';
        floor.style.height = userHeight + 'px';
        floor.style.left = userPosition[0] + 'px';
        floor.style.top = userPosition[1] + 'px';
    }

    drawUser();

    //ball section -----------------
    const ball = document.createElement('div');
    ball.className = 'ball';
    game_area.appendChild(ball);

    function drawball() {
        ball.style.left = ballPotion[0] + 'px';
        ball.style.top = ballPotion[1] + 'px';
    }
    drawball();

    function gameRun() {
        score.classList.remove('displayNone');
        timer.classList.remove('displayNone');
        gamelevel.classList.remove('displayNone');
        numHit = 0;

        let t = 3;
        const timerId = setInterval(() => {
            if (t <= 0) { clearInterval(timerId); }
            timer.innerHTML = t;
            t--;
        }, 1000)

        setTimeout(() => {
            left.classList.remove('displayNone');
            right.classList.remove('displayNone');

            timer.classList.add('displayNone');
            if (timer.className == '') return;

            // move--------
            document.addEventListener('keydown', floorMove);

            left.addEventListener('mousedown', () => {
                clearInterval(inetrvalMove);
                inetrvalMove = setInterval(() => {
                    leftmove();
                }, 50);
            });

            right.addEventListener('mousedown', () => {
                clearInterval(inetrvalMove);
                inetrvalMove = setInterval(() => {
                    rightmove();
                }, 50);
            });
            left.addEventListener('mouseup', () => { clearInterval(inetrvalMove); });
            right.addEventListener('mouseup', () => { clearInterval(inetrvalMove); });

            left.addEventListener('touchstart', (e) => {
                e.preventDefault();
                clearInterval(inetrvalMove);
                inetrvalMove = setInterval(() => {
                    leftmove();
                }, 50);
            });

            right.addEventListener('touchstart', (e) => {
                e.preventDefault();
                clearInterval(inetrvalMove);
                inetrvalMove = setInterval(() => {
                    rightmove();
                }, 50);
            });
            left.addEventListener('touchend', () => { clearInterval(inetrvalMove); });
            right.addEventListener('touchend', () => { clearInterval(inetrvalMove); });

            function leftmove() {
                if (userPosition[0] < 2) return;
                userPosition[0] -= UserpositionSpeed;
                drawUser();
            }
            function rightmove() {
                if (userPosition[0] >= gameAreaWidth - userWidth - 2) return;
                userPosition[0] += UserpositionSpeed;
                drawUser();
            }

            function floorMove(e) {
                if (e.key === 'ArrowRight') {
                    rightmove();
                } else if (e.key === 'ArrowLeft') {
                    leftmove();
                }
            }

            // ball move -----
            function ballmove() {
                ballPotion[0] += xDirection;
                ballPotion[1] -= yDirection;
                checkForBoudaries();
                drawball();
            }
            // inerval ------------------
            clearInterval(intervalID);
            intervalID = setInterval(ballmove, 25);

            function checkForBoudaries() {

                // block position ---------------
                for (let i = 0; i < block.length; i++) {
                    if ((ballPotion[0] > block[i].left && ballPotion[0] < block[i].right) && (ballPotion[1] > block[i].top && ballPotion[1] < block[i].bottom)) {
                        allBlocks = Array.from(document.querySelectorAll('.block'));
                        allBlocks[i].classList.remove('block');
                        block.splice(i, 1);
                        changDirection();
                        new Audio('./assets/sound/hit.mp3').play();
                        numHit++;
                        scorefunc(1);
                        if (block.length === 0) {
                            clearInterval(intervalID);
                            document.removeEventListener('keydown', floorMove)
                            message(mess.win);
                            next.classList.remove('displayNone');

                            if (level === 10) {
                                message(mess.finish);
                                startPause.classList.add('displayNone');
                                next.classList.add('displayNone');
                                restart.addEventListener('click', () => {
                                    window.location.reload();
                                })
                            }
                        }
                    }
                }


                // user position check --------- 
                if (ballPotion[0] > userPosition[0] && ballPotion[0] < (userPosition[0] + userWidth) && ballPotion[1] > userPosition[1] - (radius * 2)) {
                    changDirection2();
                    new Audio('./assets/sound/user.mp3').play();
                }

                if (ballPotion[0] >= gameAreaWidth - radius * 2 || ballPotion[0] <= 0 || ballPotion[1] <= 0) {
                    changDirection();
                }

                if (ballPotion[1] >= gameAreaHeight - radius * 2) {
                    clearInterval(intervalID);
                    document.removeEventListener('keydown', floorMove)
                    message(mess.lost);
                    ball.style.background = 'red'; // ball color
                }

            }

            // direction change ---------
            function changDirection() {
                if (xDirection === -speed && yDirection === speed) {
                    yDirection = -speed;
                    xDirection = -speed;
                    return;
                }
                if (xDirection === speed && yDirection === -speed) {
                    yDirection = speed;
                    return;
                }
                if (xDirection === speed && yDirection === speed) {
                    xDirection = -speed;
                    return;
                }
                if (xDirection === -speed && yDirection === -speed) {
                    xDirection = speed;
                    return;
                }
            }

            // user hit ---------
            function changDirection2() {
                if (xDirection === -speed && yDirection === -speed) {
                    xDirection = -speed;
                    yDirection = speed;
                    return;
                }
                if (xDirection === speed && yDirection === -speed) {
                    xDirection = speed;
                    yDirection = speed;
                    return;
                }
            }

            // message -----------
            function message(m) {
                Message.classList.remove('displayNone');
                Message.innerHTML = m;

                restart.classList.remove('displayNone');
                startPause.classList.toggle('displayNone');
                left.classList.add('displayNone');
                right.classList.add('displayNone');
                clearInterval(inetrvalMove);
            }

            //score --------
            function scorefunc(num) {
                if (numScore < 0) {
                    numScore = 0;
                } else {
                    numScore = numScore + num;
                }
                score.innerHTML = numScore;
            }

        }, 5000)
    }

    // level check
    function gamelevelCur(lev) {
        gamelevel.innerHTML = lev;
    }

    // when click play -----------
    startPause.addEventListener('click', startIconChange);

    function startIconChange() {
        if (!Message.className.includes('displayNone')) return;
        if (!timer.className.includes('displayNone')) return;

        startPause.classList.toggle('active');

        if (startPause.className.includes('active')) {
            startPause.innerHTML = `<i class="fas fa-pause"></i>`;
            gameRun();
        } else {
            startPause.innerHTML = `<i class="fas fa-play"></i>`;
            clearInterval(intervalID);
        }
    }

    // restart ---------------------
    restart.addEventListener('click', reload);

    // next section
    next.addEventListener('click', levelUp);
}

// this is from subhajit maity