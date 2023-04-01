let brightness = new Map();
brightness.set("2", 85);
brightness.set("4", 82);
brightness.set("8", 79);
brightness.set("16", 76);
brightness.set("32", 73);
brightness.set("64", 70);
brightness.set("128", 67);
brightness.set("256", 64);
brightness.set("512", 61);
brightness.set("1024", 58);
brightness.set("2048", 55);

let score = localStorage.getItem("1");
    document.getElementById("Best-score").innerHTML = score;

let value = [[" "," "," "," "], [" "," "," "," "], [" "," "," "," "], [" "," "," "," "]];

let add = 0;

function empty() {
    let temp = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (value[i][j] == " ")
                return true;
        }
    }
    if (temp === 0) 
        return false;
}

function is_move() {
    let ans = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (value[i][j] === value[i][j + 1] || value[j][i] === value[j + 1][i]){
                ans = 1;
                return true;
            }
        }
    }
    if (ans === 0) {
        if (!empty()) {
            document.getElementsByClassName("font-result")[0].innerHTML = "You Lose";
            document.getElementsByClassName("grid-container")[0].style = `opacity: ${`${50}%`}`;
            document.getElementsByClassName("result")[0].style = (`opacity: ${100}%; visibility: visible;`);
            return false;
        } else 
            return true;
    }
}

function is_win() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (value[i][j] === 2048) {
                document.getElementById("play").innerHTML = "Play Again";
                document.getElementsByClassName("grid-container")[0].style = `opacity: ${`${50}%`}`;
                document.getElementsByClassName("result")[0].style = (`opacity: ${100}%; visibility: visible;`);
                return true;
            }
        }
    }
}

function random_num() {
    if (empty()) {
        let ans = false;
        let index_row = Math.floor(Math.random() * 4);
        let index_col = Math.floor(Math.random() * 4);
        for(let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i == index_row && j == index_col && value[i][j] == " ") {
                    let num = Math.floor(Math.random() * 5);
                    if (num <= 0.5) 
                        num = 4;
                    else 
                        num = 2;
                    value[i][j] = num; 

                    let g1 = [];
                    g1 = document.getElementsByClassName("grid-container");
                    let g = document.createElement('div');
                    g.setAttribute("class", "tile");
                    g.setAttribute("id",`${i * 4 + (j + 1)}`);
                    g.innerHTML = num;
                    g1[0].appendChild(g);

                    document.getElementById(`${i * 4 + (j + 1)}`).innerHTML = num;                    
                    document.getElementById(`${i * 4 + (j + 1)}`).style = `--x: ${i};--y: ${j}`;
                    return;
                }
            }
        } 
        if (ans == false) 
            random_num();
    }
}

function upper_move() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (value[j][i] == " ") {
                for (let k = j + 1; k < 4; k++) {
                    if (value[k][i] != " ") {
                        value[j][i] = value[k][i];
                        document.getElementById(`${k * 4 + (i + 1)}`).setAttribute("id", `${j * 4 + (i + 1)}`);
                        document.getElementById(`${j * 4 + (i + 1)}`).style = `--x: ${j};--y: ${i}`;
                        value[k][i] = " ";
                        break;
                    }
                }
            }
        }
        for (let j = 0; j < 3; j++) {
            if (value[j][i] != " " && value[j][i] == value[j + 1][i]) {
                value[j + 1][i] += value[j][i];
                value[j][i] = " ";
                document.getElementById(`${(j + 1) * 4 + (i + 1)}`).style = `--x: ${j};--y: ${i}`;
                document.getElementById(`${(j + 1) * 4 + (i + 1)}`).innerHTML = value[j + 1][i];
                document.getElementById(`${j * 4 + (i + 1)}`).remove();
                add += value[j + 1][i];
            }
        }
        for (let j = 0; j < 4; j++) {
            if (value[j][i] == " ") {
                for (let k = j + 1; k < 4; k++) {
                    if (value[k][i] != " ") {
                        value[j][i] = value[k][i];
                        value[k][i] = " ";
                        document.getElementById(`${k * 4 + (i + 1)}`).setAttribute("id", `${j * 4 + (i + 1)}`);
                        document.getElementById(`${j * 4 + (i + 1)}`).style = `--x: ${j};--y: ${i}`;
                        break;
                    }
                }
            }
        }
    }
}

function lower_move() {
    for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
            if (value[j][i] == " ") {
                for (let k = j - 1; k >= 0; k--) {
                    if (value[k][i] != " ") {
                        value[j][i] = value[k][i];
                        document.getElementById(`${k * 4 + (i + 1)}`).setAttribute("id", `${j * 4 + (i + 1)}`);
                        document.getElementById(`${j * 4 + (i + 1)}`).style = `--x: ${j};--y: ${i}`;
                        value[k][i] = " ";
                        break;
                    }
                }
            }
        }
        for (let j = 3; j > 0; j--) {
            if (value[j][i] != " " && value[j][i] == value[j - 1][i]) {
                value[j - 1][i] += value[j][i];
                value[j][i] = " ";
                document.getElementById(`${(j - 1) * 4 + (i + 1)}`).style = `--x: ${j - 1};--y: ${i}`;
                document.getElementById(`${(j - 1) * 4 + (i + 1)}`).innerHTML = value[j - 1][i];
                document.getElementById(`${j * 4 + (i + 1)}`).remove();
                add += value[j - 1][i];
            }
        }
        for (let j = 3; j >= 0; j--) {
            if (value[j][i] == " ") {
                for (let k = j - 1; k >= 0; k--) {
                    if (value[k][i] != " ") {
                        value[j][i] = value[k][i];
                        document.getElementById(`${k * 4 + (i + 1)}`).setAttribute("id", `${j * 4 + (i + 1)}`);
                        document.getElementById(`${j * 4 + (i + 1)}`).style = `--x: ${j};--y: ${i}`;
                        value[k][i] = " ";
                        break;
                    }
                }
            }
        }
    }
}

function left_move() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (value[i][j] == " ") {
                for (let k = j + 1; k < 4; k++) {
                    if (value[i][k] != " ") {
                        value[i][j] = value[i][k];
                        document.getElementById(`${i * 4 + (k + 1)}`).setAttribute("id", `${i * 4 + (j + 1)}`);
                        document.getElementById(`${i * 4 + (j + 1)}`).style = `--x: ${i};--y: ${j}`;
                        value[i][k] = " ";
                        break;
                    }
                }
            }
        }
        for (let j = 0; j < 3; j++) {
            if (value[i][j] != " " && value[i][j] == value[i][j + 1]) {
                value[i][j + 1] += value[i][j];
                value[i][j] = " ";
                document.getElementById(`${i * 4 + (j + 2)}`).style = `--x: ${i};--y: ${j + 1}`;
                document.getElementById(`${i * 4 + (j + 2)}`).innerHTML = value[i][j + 1];
                document.getElementById(`${i * 4 + (j + 1)}`).remove();
                add += value[i][j + 1];
            }
        }
        for (let j = 0; j < 4; j++) {
            if (value[i][j] == " ") {
                for (let k = j + 1; k < 4; k++) {
                    if (value[i][k] != " ") {
                        value[i][j] = value[i][k];
                        document.getElementById(`${i * 4 + (k + 1)}`).setAttribute("id", `${i * 4 + (j + 1)}`);
                        document.getElementById(`${i * 4 + (j + 1)}`).style = `--x: ${i};--y: ${j}`;
                        value[i][k] = " ";
                        break;
                    }
                }
            }
        }
    }
}

function right_move() {
    for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
            if (value[i][j] == " ") {
                for (let k = j - 1; k >= 0; k--) {
                    if (value[i][k] != " ") {
                        value[i][j] = value[i][k];
                        document.getElementById(`${i * 4 + (k + 1)}`).setAttribute("id", `${i * 4 + (j + 1)}`);
                        document.getElementById(`${i * 4 + (j + 1)}`).style = `--x: ${i};--y: ${j}`;
                        value[i][k] = " ";
                        break;
                    }
                }
            }
        }
        for (let j = 3; j > 0; j--) {
            if (value[i][j] != " " && value[i][j] == value[i][j - 1]) {
                value[i][j - 1] += value[i][j];
                value[i][j] = " ";
                document.getElementById(`${i * 4 + (j)}`).style = `--x: ${i};--y: ${j - 1}`;
                document.getElementById(`${i * 4 + (j)}`).innerHTML = value[i][j - 1];
                document.getElementById(`${i * 4 + (j + 1)}`).remove();
                add += value[i][j - 1];
            }
        }
        for (let j = 3; j >= 0; j--) {
            if (value[i][j] == " ") {
                for (let k = j - 1; k >= 0; k--) {
                    if (value[i][k] != " ") {
                        value[i][j] = value[i][k];
                        document.getElementById(`${i * 4 + (k + 1)}`).setAttribute("id", `${i * 4 + (j + 1)}`);
                        document.getElementById(`${i * 4 + (j + 1)}`).style = `--x: ${i};--y: ${j}`;
                        value[i][k] = " ";
                        break;
                    }
                }
            }
        }
    }
}

function reset() {
    value = [[" "," "," "," "], [" "," "," "," "], [" "," "," "," "], [" "," "," "," "]];
    for (let i = 1; i <= 16; i++) {
        let remov_ele = document.getElementById(`${i}`);
        if (remov_ele != null) {
            remov_ele.remove();
        }
    }
    if (localStorage.getItem("1") < add) {
        localStorage.setItem("1",add);        
    }
    document.getElementById("score").innerHTML = 0;
    add = 0;
    let score = localStorage.getItem("1");
    document.getElementById("Best-score").innerHTML = score;
    document.getElementsByClassName("grid-container")[0].style = `opacity: ${`${100}%`}`;
    document.getElementsByClassName("result")[0].style = (`opacity: ${0}%; visibility: hidden;`);
    random_num();
    random_num();
    get_input();
}    

random_num();
random_num();
get_input();

function get_tiles_colored() {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            let element = document.getElementById(`${i * 4 + (j + 1)}`);
            if (element != null) {
                let color = brightness.get(element.innerHTML);
                document.getElementById(`${i * 4 + (j + 1)}`).style = `background: hsl(180, 80%, ${color}%);--x: ${i};--y: ${j}`;
            }
        }
    }
}

get_tiles_colored();

function get_input() {
    window.addEventListener("keydown",input, {once: true});
    window.addEventListener("ontouchmove",input, {once: true});
}

function input(e) {
    if (e.key === "ArrowDown") {
        lower_move();
        random_num();
    }   
    else if (e.key === "ArrowUp") {
        upper_move();
        random_num();
    }
    else if (e.key === "ArrowLeft") { 
        left_move();
        random_num();
    }
    else if (e.key === "ArrowRight") {
        right_move();
        random_num();
    } 
    get_tiles_colored();
    document.getElementById("score").innerHTML = add;
    if (localStorage.getItem("1", add) < add) {
        document.getElementById("Best-score").innerHTML = add;
    }
    if (!is_win() && is_move()) {
        get_input();
    }
}

document.getElementById("reset").onclick = reset;
document.getElementsByClassName("play-again")[0].onclick = reset;