import { startPath } from './dijkstra.js'

//Gets button from HTML


//Draws Grid on screen and places start/end nodes in default position
let grid = document.getElementById("grid");
//Length and Width for Settings Pane
let length = Math.round(document.getElementById("length-input").value);
let width = Math.round(document.getElementById("width-input").value);
function generateNewGrid() {
    grid.innerHTML = ''
    grid.style.gridTemplateRows = "";
    grid.style.gridTemplateColumns = "";
    grid.style.gridTemplateRows += "repeat(" + length + ", 40px [row]";
    grid.style.gridTemplateColumns += "repeat(" + width + ", 40px [row]";
    //Draws Grid to HTML
    //Places Event Listeners for Drawing feature
    for (let y = 0; y < length; y++) {
        for (let x = 0; x < width; x++) {
            let block = document.createElement("div");
            block.classList.add("block");
            block.setAttribute('id', 'xPos' + x + 'yPos' + y);
            block.addEventListener("mousedown", function () { mouseDown(block) });
            block.addEventListener("mouseup", function (e) {
                e.stopPropagation(); //if this is removed then mouseup no longer works on mousemove event
                mouseup(block) });
            block.addEventListener("mousemove", function () { mouseOver(block) });
            block.addEventListener("click", function () { mouseClick(block) });
            grid.appendChild(block);
        }
    }

    //Adds Start-End Blocks by Default
    document.getElementById('xPos1yPos1').classList.remove("block");
    document.getElementById('xPos1yPos1').classList.add("start");
    document.getElementById('xPos' + (width - 2) + 'yPos' + (length - 2)).classList.remove("block");
    document.getElementById('xPos' + (width - 2) + 'yPos' + (length - 2)).classList.add("end");
}

function updateSettings() {
    length = Math.round(document.getElementById("length-input").value);
    width = Math.round(document.getElementById("width-input").value);
    document.getElementById("length-input").parentElement.lastElementChild.textContent = length;
    document.getElementById("width-input").parentElement.lastElementChild.textContent = width;
    generateNewGrid();
}

//Allows User to Place Covers Over Blocks
let isDrawing = false;
let moveStart = false;
let moveEnd = false;
function mouseOver(element) {
    if (isDrawing) {
        if (element.classList.contains("block")) {
            element.classList.add("cover");
            element.classList.remove("block");
        }
    }
    if (moveStart){
        element.classList = "";
        element.classList.add("start")
    }
}

function mouseDown(element) {
    isDrawing = true;
    if (element.classList.contains("start")){
        moveStart = true;
    }
    if(element.classList.contains("end")){
        moveEnd = true;
    }
}

function mouseup(element) {
    isDrawing = false;
    moveStart = false;
    moveEnd = false;
}

function mouseClick(element){
    if (element.classList.contains("block")) {
        element.classList.add("cover");
        element.classList.remove("block");
    }
    else if ((element.classList.contains("cover"))) {
        element.classList.add("block");
        element.classList.remove("cover");
    }
}

//Converts our HTML map to a 2D array that is parsed in our pathfinding script
//Node IDs:
// 0 - Blank
// 1 - Covered
// 2 - Start
// 3 - End
let map = [];
function turnMapIntoArray() {
    map = [];
    let gridHTML = document.getElementById("grid");
    for (let y = 0; y < length; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            let temp = document.getElementById('xPos' + x + 'yPos' + y).classList;
            if (temp.contains('block')) {
                row.push(0);
            }
            else if (temp.contains('cover')) {
                row.push(1);
            }
            else if (temp.contains('start')) {
                row.push(2);
            }
            else {
                row.push(3);
            }
        }
        map.push(row);
    }
    startPath();
}

//Adding Event Listners to document
window.addEventListener('load', generateNewGrid);
document.getElementById('length-input').addEventListener('change', updateSettings);
document.getElementById('width-input').addEventListener('change', updateSettings);
document.getElementById('start-but').addEventListener('click', turnMapIntoArray);
document.getElementById('reset-but').addEventListener('click', generateNewGrid);


//Allow Other Scripts access to these variables
export { map, length, width };