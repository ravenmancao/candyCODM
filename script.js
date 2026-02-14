const width = 8;
const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
let score = 0;

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

function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        square.setAttribute("draggable", true);
        square.setAttribute("id", i);

        let randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
        square.classList.add("tile", randomWeapon.class);
        square.innerText = randomWeapon.name;

        board.appendChild(square);
        squares.push(square);
    }
}
createBoard();

squares.forEach(square => square.addEventListener("dragstart", () => dragged = square));
squares.forEach(square => square.addEventListener("dragover", e => e.preventDefault()));
squares.forEach(square => square.addEventListener("drop", () => replaced = square));
squares.forEach(square => square.addEventListener("dragend", dragEnd));

function swap(a,b){
    let tempClass = a.className;
    let tempText = a.innerText;
    a.className = b.className;
    a.innerText = b.innerText;
    b.className = tempClass;
    b.innerText = tempText;
}

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
    }
    dragged=null;
    replaced=null;
}

function checkMatches(){
    for(let i=0;i<61;i++){
        let row=[i,i+1,i+2];
        if(i%8>5) continue;
        if(row.every(index=>squares[index].innerText &&
            squares[index].innerText===squares[i].innerText)){
                row.forEach(index=>{
                    squares[index].classList.add("matched");
                    setTimeout(()=>{
                        squares[index].className="tile";
                        squares[index].innerText="";
                    },300);
                });
                score+=30;
        }
    }

    for(let i=0;i<47;i++){
        let col=[i,i+8,i+16];
        if(col.every(index=>squares[index].innerText &&
            squares[index].innerText===squares[i].innerText)){
                col.forEach(index=>{
                    squares[index].classList.add("matched");
                    setTimeout(()=>{
                        squares[index].className="tile";
                        squares[index].innerText="";
                    },300);
                });
                score+=30;
        }
    }
    scoreDisplay.innerText=score;
}

function moveDown(){
    for(let i=55;i>=0;i--){
        if(squares[i+8].innerText===""){
            squares[i+8].className=squares[i].className;
            squares[i+8].innerText=squares[i].innerText;
            squares[i+8].classList.add("fall");
            squares[i].className="tile";
            squares[i].innerText="";
        }
    }

    for(let i=0;i<8;i++){
        if(squares[i].innerText===""){
            let randomWeapon=weapons[Math.floor(Math.random()*weapons.length)];
            squares[i].classList.add(randomWeapon.class);
            squares[i].innerText=randomWeapon.name;
        }
    }
}

setInterval(()=>{
    checkMatches();
    moveDown();
},200);
