const width = 8;
const board = document.getElementById("board");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

const gameOverBox = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

let score = 0;
let timeLeft = 15;

const weapons = [
    {name:"M13", class:"m13"},
    {name:"Krig", class:"krig"},
    {name:"Fennec", class:"fennec"},
    {name:"Holger", class:"holger"},
    {name:"Rytec", class:"rytec"},
    {name:"Switchblade", class:"switchblade"}
];

let squares = [];

let dragged = null;
let replaced = null;

/* CREATE BOARD */

function createBoard(){

    for(let i=0;i<width*width;i++){

        const square = document.createElement("div");

        square.setAttribute("draggable",true);
        square.setAttribute("id",i);

        let randomWeapon =
            weapons[Math.floor(Math.random()*weapons.length)];

        square.classList.add("tile",randomWeapon.class);
        square.innerText = randomWeapon.name;

        board.appendChild(square);

        squares.push(square);
    }
}

createBoard();

/* DRAG */

squares.forEach(square =>
    square.addEventListener("dragstart",()=>{
        dragged=square;
    })
);

squares.forEach(square =>
    square.addEventListener("dragover",e=>e.preventDefault())
);

squares.forEach(square =>
    square.addEventListener("drop",()=>{
        replaced=square;
    })
);

squares.forEach(square =>
    square.addEventListener("dragend",dragEnd)
);

/* SWAP */

function swap(a,b){

    let tempClass = a.className;
    let tempText = a.innerText;

    a.className = b.className;
    a.innerText = b.innerText;

    b.className = tempClass;
    b.innerText = tempText;
}

/* VALIDATE MOVE */

function dragEnd(){

    if(!dragged || !replaced) return;

    let validMoves = [
        parseInt(dragged.id)-1,
        parseInt(dragged.id)+1,
        parseInt(dragged.id)-width,
        parseInt(dragged.id)+width
    ];

    if(validMoves.includes(parseInt(replaced.id))){

        swap(dragged,replaced);

        if(!checkAnyMatch()){
            swap(dragged,replaced);
        }
    }

    dragged=null;
    replaced=null;
}

/* CHECK MATCHES */

function checkAnyMatch(){

    let found = false;

    // ROWS

    for(let i=0;i<61;i++){

        let row6=[i,i+1,i+2,i+3,i+4,i+5];
        let row5=[i,i+1,i+2,i+3,i+4];
        let row4=[i,i+1,i+2,i+3];
        let row3=[i,i+1,i+2];

        if(i%8<=2 && isMatch(row6)){
            rocketExplosion(i);
            found=true;
        }

        else if(i%8<=3 && isMatch(row5)){
            rocketExplosion(i);
            found=true;
        }

        else if(i%8<=4 && isMatch(row4)){
            bombExplosion(i);
            found=true;
        }

        else if(i%8<=5 && isMatch(row3)){
            destroy(row3);
            found=true;
        }
    }

    // COLS

    for(let i=0;i<40;i++){

        let col6=[i,i+8,i+16,i+24,i+32,i+40];
        let col5=[i,i+8,i+16,i+24,i+32];
        let col4=[i,i+8,i+16,i+24];
        let col3=[i,i+8,i+16];

        if(isMatch(col6)){
            rocketExplosion(i);
            found=true;
        }

        else if(isMatch(col5)){
            rocketExplosion(i);
            found=true;
        }

        else if(isMatch(col4)){
            bombExplosion(i);
            found=true;
        }

        else if(isMatch(col3)){
            destroy(col3);
            found=true;
        }
    }

    return found;
}

/* MATCH */

function isMatch(arr){

    return arr.every(index =>
        squares[index] &&
        squares[index].innerText !== "" &&
        squares[index].innerText === squares[arr[0]].innerText
    );
}

/* DESTROY */

function destroy(arr){

    arr.forEach(index=>{

        squares[index].classList.add("explode");

        setTimeout(()=>{

            squares[index].className="tile";
            squares[index].innerText="";

        },200);
    });

    addScore(arr.length);
}

/* BOMB */

function bombExplosion(center){

    let targets = [
        center,
        center-1,
        center+1,
        center-8,
        center+8,
        center-9,
        center-7,
        center+7,
        center+9
    ];

    targets.forEach(index=>{

        if(squares[index]){

            squares[index].classList.add("explode");

            setTimeout(()=>{

                squares[index].className="tile";
                squares[index].innerText="";

            },200);
        }
    });

    addScore(4);
}

/* ROCKET */

function rocketExplosion(center){

    let targets=[];

    for(let i=0;i<15;i++){

        let random =
            Math.floor(Math.random()*64);

        targets.push(random);
    }

    targets.forEach(index=>{

        if(squares[index]){

            squares[index].classList.add("explode");

            setTimeout(()=>{

                squares[index].className="tile";
                squares[index].innerText="";

            },200);
        }
    });

    addScore(6);
}

/* SCORE */

function addScore(blocks){

    score += blocks * 10;

    scoreDisplay.innerText = score;

    timeLeft += blocks;

    timerDisplay.innerText = timeLeft;
}

/* MOVE DOWN */

function moveDown(){

    for(let i=55;i>=0;i--){

        if(squares[i+8].innerText===""){

            squares[i+8].className =
    squares[i].className;

squares[i+8].classList.remove("fall");

void squares[i+8].offsetWidth;

squares[i+8].classList.add("fall");

            squares[i+8].innerText =
                squares[i].innerText;

            squares[i].className="tile";
            squares[i].innerText="";
        }
    }

    for(let i=0;i<8;i++){

        if(squares[i].innerText===""){

            let randomWeapon =
                weapons[Math.floor(Math.random()*weapons.length)];

            squares[i].className =
                "tile " + randomWeapon.class;

            squares[i].innerText =
                randomWeapon.name;
        }
    }
}

/* TIMER */

const countdown = setInterval(()=>{

    timeLeft--;

    timerDisplay.innerText=timeLeft;

    if(timeLeft<=0){

        clearInterval(countdown);

        gameOver();
    }

},1000);

/* GAME LOOP */

const gameLoop = setInterval(()=>{

    checkAnyMatch();

    moveDown();

},200);

/* GAME OVER */

function gameOver(){

    clearInterval(gameLoop);

    finalScore.innerText = score;

    gameOverBox.style.display="flex";
}

/* RESTART */

function restartGame(){

    location.reload();
}