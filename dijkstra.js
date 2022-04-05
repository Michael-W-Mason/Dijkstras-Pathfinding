// Node IDs
// 0 - Blank
// 1 - Covered
// 2 - Start
// 3 - End

import { map, length, width } from './html-draw.js'

class Node {
    constructor(x, y, nodeID, parent, distance) {
        this.x = x;
        this.y = y;
        this.nodeID = nodeID;
        this.parent = parent;
        this.distance = distance;
    }
}

let visitedList = [];
let unVisitedList = [];
let shortestPath = [];


//Call This function to generate our List and Solution
function startPath() {
    createunVisitedList();
    let startIndex = findStartNode();
    let currentNode = unVisitedList[startIndex];

    while (true) {
        //Checking for minimum distance out of unvisited nodes
        let minDistance = Number.POSITIVE_INFINITY;
        let minDistanceIndex = -1;
        for (let i = 0; i < unVisitedList.length; i++) {
            if (unVisitedList[i].distance < minDistance) {
                minDistance = unVisitedList[i].distance;
                minDistanceIndex = i;
            }
        }
        
        //If our minimum distance from searching is positive infinity then there is no path to the end
        if (minDistance == Number.POSITIVE_INFINITY) {
            break;
        }
        
        //Set min distance node as the current node and add it to the visted list
        currentNode = unVisitedList[minDistanceIndex];
        visitedList.push(unVisitedList[minDistanceIndex]);
        unVisitedList.splice(minDistanceIndex, 1);
        
        //if current node is the final node then we are done!
        if (currentNode.nodeID == 3) {
            break;
        }

        //Check the neighbors to see if they are closer to final node
        let neighbors = [];
        let topNode = checkNodeNeighbors(currentNode, 0, 1);
        let rightNode = checkNodeNeighbors(currentNode, 1, 0);
        let botNode = checkNodeNeighbors(currentNode, 0, -1);
        let leftNode = checkNodeNeighbors(currentNode, -1, 0);
        neighbors.push(topNode, rightNode, botNode, leftNode);
        //Room for improvement here, this loop doesnt need to be iterated twice. We can pass index back from checkNodeNeighbors
        //We are looking at our neighbors distance compared to our current node. If the distance of the neighbor is better than the current node then we assign its parent to the current node.
        for (let i = 0; i < neighbors.length; i++) {
            for (let j = 0; j < unVisitedList.length; j++) {
                if (neighbors[i] == undefined) {
                    continue;
                }
                if (neighbors[i] == unVisitedList[j]) {
                    if (unVisitedList[j].distance > currentNode.distance) {
                        unVisitedList[j].parent = currentNode;
                    }
                }
            }
        }
        drawDistance(currentNode);
    }
    drawFunction(currentNode);
}

function drawDistance(currentNode){
    let cell = document.getElementById("xPos" + currentNode.x +"yPos" + currentNode.y);
    let para = document.createElement("p");
    let text = document.createTextNode(currentNode.distance);
    para.append(text);
    cell.appendChild(para);
}

function drawFunction(currentNode) {
    for(let i = 0; i < visitedList.length; i++){
        let block = document.getElementById("xPos" + visitedList[i].x + "yPos" + visitedList[i].y);
        if(!block.classList.contains("start") && !block.classList.contains("end")){
            block.classList.add("visit");
        }
    }
    let end = "";
    let node = currentNode;
    while(end != "Start"){
        let block = document.getElementById("xPos" + node.x + "yPos" + node.y);
        if(!block.classList.contains("start") && !block.classList.contains("end")){
            block.classList.add("path");
            block.classList.remove("visit");
        }
        end = node.parent;
        node = node.parent;
    }

}

function checkNodeNeighbors(currentNode, hor, vert) {
    let x = currentNode.x + hor;
    let y = currentNode.y + vert;
    //if coords out of bounds just return we are done with this node
    if ((y < 0 || y >= length) || (x < 0 || x >= width)) {
        return;
    }
    else {
        for (let i = 0; i < unVisitedList.length; i++) {
            //if the node we are looking at is a wall we are done looking at it
            if (x == unVisitedList[i].x && y == unVisitedList[i].y) {
                if (unVisitedList[i].nodeID == 1) {
                    return;
                }
                unVisitedList[i].distance = calcDistance(currentNode.distance);
                //return the index with the node so we dont have to loop over the unvisited list again
                return unVisitedList[i];
            }
        }
    }
}

//Because the distance is the same for every cell we can just increase the distance by one
function calcDistance(current) {
    current = current + 1;
    return current;
}



function findStartNode() {
    for (let i = 0; i < unVisitedList.length; i++) {
        if (unVisitedList[i].nodeID == 2) {
            unVisitedList[i].distance = 0;
            unVisitedList[i].parent = "Start";
            return i;
        }
    }
}

function createunVisitedList() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let newNode = new Node(j, i, map[i][j], undefined, undefined);
            unVisitedList.push(newNode);
        }
    }
}

export {startPath}