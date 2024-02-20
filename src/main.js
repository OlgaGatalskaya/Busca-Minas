//variables globales
let board = document.querySelector('.board');
let boardBody = board.firstElementChild;
console.log(boardBody);
let header = document.querySelector('.header');
let icon = document.querySelector('.div-center');
let image = '/src/img/mine.png';
let flags = document.querySelector('.div-left');
let timer = document.querySelector('.div-right');
let bombs = document.querySelectorAll('.bombs');



let interval;
let seconds = 0;

function updateTime(){
    seconds++;
    if (seconds < 10){
        timer.innerHTML = `00${seconds}`;
    }else if (seconds < 100) {
        timer.innerHTML = `0${seconds}`;
    } else {
        timer.innerHTML = `${seconds}`;
    }
    
}


function makeHeader(width){
    header.style.width = `${width * 26}px`;
    header.style.height = `50px`;
    header.style.border = `3px solid #7b7b7b`
    header.style.margin = `auto`;
    header.style.borderBottom = 'none';
    header.style.borderRightColor = 'white';

}


//hacemos board de nuestro juego
function makeBoard(width, height){

    boardBody.replaceChildren();

    boardBody.style.width = `${width * 20}px`;
    boardBody.style.height = `${height * 20}px`;

    for (let i = 0; i < height; i++){
        let row = boardBody.insertRow(); // añadimos linea
        for (let j = 0; j < width; j++){
            row.insertCell();
        }
    }
}


function shuffle(arr){
    return arr.sort(() => Math.random() - 0.5)
}
let bombsArray;
//Hacemos funcion para poner las bombas aleatoriamente
function makeBombs(bombs, row, col){
    let cellsArray = [...boardBody.querySelectorAll('td')]; //elegimos todos cells y los ponemos en un array
    console.log(cellsArray);
    cellsArray.splice(row * boardBody.rows[0].cells.length + col, 1);
    
    bombsArray = shuffle(cellsArray).slice(0, bombs);
    console.log(bombsArray);
    bombsArray.forEach(cell => {
        cell.dataset.bomb = true;
    }); // ahora ponemos a cada cells con bomba atributo bomb que es true y añadimos imagen

}

//funcion para empezar juego
function startGame(bombs){
    let cell;
    let row;
    let col;
    let gameOverBomb = false;
    let noFlags = false;
    let countBombs = bombs;
    let countFlags = 0;
    if (bombs < 100){
        flags.innerHTML = '0' + bombs;
    }
    makeBombs(bombs, row, col);
    generateNumbers();
        boardBody.oncontextmenu = function (e) {
            e.preventDefault();
            cell = e.target;
            if(cell.dataset.flag  || cell.classList.contains('open')){
                if(countBombs != bombs){
                    countBombs++;
                }
                cell.innerHTML = '';
                delete cell.dataset.flag;
                countFlags--;
                noFlags = false;
            } else {
                if(!noFlags && countFlags < bombs){
                    cell.dataset.flag = 'true';
                    cell.innerHTML = '🚩';
                    cell.style.fontSize = "14px";
                    if (countBombs != 0){
                        countBombs--;
                        countFlags++;
                    }
                }
                
                
            }
            if (countFlags == bombs){
                noFlags = true;
            }
            if (bombs < 100){
                flags.innerHTML = '0' + countBombs;
            }
            if (countBombs < 10){
                flags.innerHTML = '00' + countBombs;
            }
            
        }
        boardBody.onclick = e => {
            if(!interval){
                interval = setInterval(updateTime, 1000);
            }
            
            if(gameOverBomb){
                return;
            }
            if(e.target.matches('td')){
                cell = e.target;
                console.log(cell);
                row = cell.parentElement.rowIndex; //para obtener index de linea
                col = cell.cellIndex // para obtener index de columna
                console.log(`${row} ${col}`);
                if (!cell.dataset.flag){
                    open(cell);
                    if (cell.dataset.bomb){
                        if (interval){
                            interval = clearInterval(interval);
                            seconds=0;
                        }
                        cell.classList.add('bomb');
                        cell.style.backgroundImage = `url(${image})`;
                        cell.style.backgroundRepeat = 'no-repeat';
                        cell.style.backgroundPosition = 'center center';
                        let redColor = document.createElement('div');
                        redColor.classList.add('redBomb');
                        cell.appendChild(redColor);
                        redColor.style.border = 'none';
                        gameOver();
                        bombsArray.forEach(cell => {
                            open(cell);
                            cell.style.backgroundImage =  `url(${image})`;
                            cell.style.backgroundRepeat = 'no-repeat';
                            cell.style.backgroundPosition = 'center';
                            cell.style.width = '20px';
                            cell.style.height = '20px';
                        });
                        gameOverBomb = true;
                        noFlags = true;
                        
                    } else if (cell.dataset.count){
                        cell.classList.add('number');
                    } 
                }
                
            }
        }

}


function open(cell) {
    // si celda esta abierta no hacemos nada
    if (cell.classList.contains('open')) {
        return;
    }
    cell.classList.add('open');
    // si hay numero lo demostramos y paramos
    if (cell.dataset.count) {
        cell.classList.add('number');
        return;
    }
    // si la celda es vasia estamos abriendo alrededor donde no hay bombas
    if (!cell.dataset.count && !cell.dataset.bomb) {
        let row = cell.parentElement.rowIndex;
        let col = cell.cellIndex;
        for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, board.rows.length - 1); i++) {
            for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, board.rows[0].cells.length - 1); j++) {
                open(board.rows[i].cells[j]);
            }
        }
    }
}

function generateNumbers(){
    let cells = board.querySelectorAll('td');

    for (let cell of cells){
        if (cell.dataset.bomb)
        {
            continue;
        }
        let count = 0;
        let row = cell.parentElement.rowIndex;
        let col = cell.cellIndex;

        for (let i = row - 1; i <= row + 1; i++){
            for (let j = col - 1; j <= col + 1; j++){
                if (i < 0 || i >= board.rows.length){
                    continue;
                }
                if (j < 0 || j >= board.rows[i].cells.length){
                    continue;
                }
                if (board.rows[i].cells[j].dataset.bomb)
                {
                    count++;
                }
            }
        }
        if (count > 0){
            cell.dataset.count = count;
            
        }

        if (count == 1){
            cell.classList.add('blue');
        } if (count == 2){
            cell.classList.add('green');
        } if (count == 3){
            cell.classList.add('red');
        } if (count == 4){
            cell.classList.add('darkBlue');
        }
}
}

function gameOver(){
    icon.innerHTML = '😢';

}


function makeHeaderBoard(width, height){
    makeHeader(width);
    makeBoard(width, height);
}
let selectionNivel;

function inicio(){
    makeHeaderBoard(8,8);
    startGame(10);
}

window.addEventListener('load', inicio);



for(let bomb of bombs){
    bomb.addEventListener('click', function(){
        selectionNivel = this.dataset.bomb;
        if(selectionNivel == 10){
            renovarTimer();
            makeHeaderBoard(8,8);
            startGame(10);
        } else if (selectionNivel == 40){
            renovarTimer();
            makeHeaderBoard(16,16);
            startGame(40);
        } else if (selectionNivel == 99){
            timer.innerHTML = '000';
            interval = clearInterval(interval);
            seconds = 0;
            makeHeaderBoard(30,16);
            startGame(99);
        }
    })
}



icon.addEventListener('click', function () {
    if(icon.innerHTML == '😢'){
        icon.innerHTML = '😃';
    }
    renovarTimer()
    
    if(selectionNivel != 40 && selectionNivel != 99){
        makeHeaderBoard(8,8);
        startGame(10);
    } else if (selectionNivel == 40){
        makeHeaderBoard(16,16);
        startGame(40);
    } else if (selectionNivel == 99){
        makeHeaderBoard(30,16);
        startGame(99);
    }
});

function renovarTimer(){
    timer.innerHTML = '000';
    interval = clearInterval(interval);
    seconds = 0;
}