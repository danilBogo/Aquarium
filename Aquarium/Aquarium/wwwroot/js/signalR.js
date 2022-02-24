class Location {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }
}

const Direction = {RIGHT: 'Right', LEFT: 'Left'};

class TaskFish {
    constructor(location, direction, speedX, fishId) {
        this.Location = location;
        this.Direction = direction;
        this.SpeedX = speedX;
        this.FishId = fishId;
    }
}

class ThreadFish {
    constructor(location, direction, speedX, fishId) {
        this.Location = location;
        this.Direction = direction;
        this.SpeedX = speedX;
        this.FishId = fishId;
    }
}

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/aquarium")
    .build();
connection.start()
let fishesId = new Map();
let delay = 100;

document.getElementById("addFishBtn").addEventListener("click", function (e) {
    changeElementTextById("errorForm1", "");
    addFish();
    return false;
});
document.getElementById("deleteFishBtn").addEventListener("click", function (e) {
    changeElementTextById("informationForm2", "")
    deleteFish();
    return false;
});

function addFish() {
    let location = getLocation();
    let direction = getDirection();
    let speedX = getSpeedX();
    let fishId = getFishId();
    let colorOfFish = getFishColor();
    let fish = createFish(colorOfFish, location, direction, speedX, fishId);
    let methodName = getMethodNameByFish(fish);
    startFishMoving(fish, methodName);
}

function startFishMoving(fish, methodName){
    let json = JSON.stringify(fish);
    connection.invoke(methodName, json).then(data => {
        if (data === true) {
            let imageId = `imageFish${fish.FishId}`;
            fishesId.set(fish.FishId, imageId);
            createImage(imageId, fish);
            let interval = setInterval(() => {
                connection.invoke("GetFishJsonById", fish.FishId).then(data => {
                    if (data === null)
                        clearInterval(interval);
                    else
                        redrawFishes(data)
                })
            }, delay);
        } else
            changeElementTextById("errorForm1", `Рыбка с id ${fish.FishId} уже существует`)
    })
}

function deleteFish() {
    let fishId = document.getElementById("fishIdToDelete").value;
    let elementName = "informationForm2";
    connection.invoke("TryDeleteFishById", parseInt(fishId)).then(data => {
        if (data === true){
            removeImage(fishesId.get(parseInt(fishId)));
            fishesId.delete(fishId)
            changeElementTextById(elementName, `Рыбка с id ${fishId} удалена`)
        }
        else
            changeElementTextById(elementName, `Рыбки с id ${fishId} не существует`)
    })
}

function changeElementTextById(elementId, text) {
    document.getElementById(elementId).innerText = text;
}

function getElementValueById(elementId){
    return document.getElementById(elementId).value;
}

function getLocation(){
    let locationX = getElementValueById("locationX");
    let locationY = getElementValueById("locationY");
    return new Location(parseInt(locationX), parseInt(locationY));
}

function getDirection(){
    let directionInput = getElementValueById("direction");
    if (directionInput === "Left") return Direction.LEFT;
    else return Direction.RIGHT;
}

function getSpeedX(){
    return getElementValueById("speed_input");
}

function getFishId(){
    return getElementValueById("fishIdToAdd");
}

function getFishColor(){
    return getElementValueById("color");
}

function createFish(colorOfFish, location, direction, speedX, fishId){
    if (colorOfFish === "Чёрный")
        return new TaskFish(location, direction, parseInt(speedX), parseInt(fishId));
    else
        return new ThreadFish(location, direction, parseInt(speedX), parseInt(fishId));
}

function getMethodNameByFish(fish){
    if (fish instanceof TaskFish)
        return "TryCreateTaskFish";
    else
        return "TryCreateThreadFish";
}

function redrawFishes(data){
    let fish = JSON.parse(data);
    for (let imageId of fishesId.values()) {
        let image = document.getElementById(imageId)
        image.style.left = `${fish.Location.X}px`;
        image.style.top = `${fish.Location.Y}px`;
        let degree = parseInt(fish.Direction) * 180;
        image.style.transform = `rotate(${degree}deg)`;
    }
}

function createImage(imageId, fish){
    let parent = document.querySelector(".aquarium");
    let img = document.createElement('img');
    img.className = "fish"
    img.id = imageId;
    img.src = getImageNameByFish(fish);
    parent.appendChild(img);
}

function removeImage(imageId){
    let img = document.getElementById(imageId);
    img.remove();
}

function getImageNameByFish(fish){
    if (fish instanceof TaskFish)
        return "../images/fishBlack.svg"
    else
        return "../images/fishWhite.svg"
}