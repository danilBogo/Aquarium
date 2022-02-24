class Location {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }
}

class FishBase {
    constructor(location, direction, speedX, fishId, currentThreadId) {
        this.Location = location;
        this.Direction = direction;
        this.SpeedX = speedX;
        this.FishId = fishId;
        this.CurrentThreadId = currentThreadId
    }
}

class Map {
    constructor(sizeX, sizeY) {
        this.SizeX = sizeX;
        this.SizeY = sizeY;
    }
}

class Image {
    constructor(width, height) {
        this.Width = width;
        this.Height = height;
    }
}

class AquariumInfo {
    constructor(fishBase, map) {
        this.FishBase = fishBase;
        this.Map = map;
    }
}

const Direction = {RIGHT: 'Right', LEFT: 'Left'};

class TaskFish {
    constructor(location, direction, speedX, fishId, currentThreadId) {
        this.Location = location;
        this.Direction = direction;
        this.SpeedX = speedX;
        this.FishId = fishId;
        this.CurrentThreadId = currentThreadId;
    }
}

class ThreadFish {
    constructor(location, direction, speedX, fishId, currentThreadId) {
        this.Location = location;
        this.Direction = direction;
        this.SpeedX = speedX;
        this.FishId = fishId;
        this.CurrentThreadId = currentThreadId;
    }
}

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/aquarium")
    .build();
connection.start().then(() => {
    connection.invoke("TryCleanDictionaryFishes").then(data => {
        if (data === false)
            alert("Словарь не очистился");
    });
});

let delay = 16;
let map = new Map(800, 400);
let fishImg = new Image(75, 50);
let serverMap = new Map(map.SizeX - fishImg.Width, map.SizeY);

setAquariumSize(map);

document.getElementById("addFishBtn").addEventListener("click", function (e) {
    changeElementTextById("informationForm1", "");
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
    if (!isLocationValid(location))
        return false;
    let direction = getDirection();
    let speedX = getSpeedX();
    let fishId = getFishId();
    let colorOfFish = getFishColor();
    let fish = createFish(colorOfFish, location, direction, speedX, fishId);
    let methodName = getMethodName(fish);
    startFishMoving(fish, methodName);
}

function startFishMoving(fish, methodName) {
    let json = JSON.stringify(new AquariumInfo(fish, serverMap));
    connection.invoke(methodName, json).then(data => {
        if (data === true) {
            createImageLabel(fish)
            createImage(fish);
            changeElementTextById("informationForm1", `Рыбка с id ${fish.FishId} создана`);
            let interval = setInterval(() => {
                connection.invoke("GetFishJsonById", fish.FishId).then(data => {
                    if (data === null)
                        clearInterval(interval);
                    else {
                        let deserializedFish = deserializeJsonToFish(data);
                        redrawFish(deserializedFish);
                        updateLabelText(deserializedFish);
                    }
                })
            }, delay);
        } else
            changeElementTextById("informationForm1", `Рыбка с id ${fish.FishId} уже существует`);
    })
}

function deleteFish() {
    let fishId = getElementValueById("fishIdToDelete");
    let elementName = "informationForm2";
    connection.invoke("TryDeleteFishById", parseInt(fishId)).then(data => {
        if (data === true) {
            removeImage(getImageIdByFishId(fishId));
            changeElementTextById(elementName, `Рыбка с id ${fishId} удалена`)
        } else
            changeElementTextById(elementName, `Рыбки с id ${fishId} не существует`)
    })
}

function changeElementTextById(elementId, text) {
    document.getElementById(elementId).innerText = text;
}

function getElementValueById(elementId) {
    return document.getElementById(elementId).value;
}

function getLocation() {
    let locationX = getElementValueById("locationX");
    let locationY = getElementValueById("locationY");
    return new Location(parseInt(locationX), parseInt(locationY));
}

function getDirection() {
    let directionInput = getElementValueById("direction");
    if (directionInput === "Left") return Direction.LEFT;
    else return Direction.RIGHT;
}

function getSpeedX() {
    return getElementValueById("speed_input");
}

function getFishId() {
    return getElementValueById("fishIdToAdd");
}

function getFishColor() {
    return getElementValueById("color");
}

function createFish(colorOfFish, location, direction, speedX, fishId) {
    if (colorOfFish === "Чёрный")
        return new TaskFish(location, direction, parseInt(speedX), parseInt(fishId));
    else
        return new ThreadFish(location, direction, parseInt(speedX), parseInt(fishId));
}

function redrawFish(fish) {
    let imgId = getImageIdByFishId(fish.FishId);
    let image = document.getElementById(imgId)
    image.style.left = `${fish.Location.X}px`;
    image.style.top = `${fish.Location.Y}px`;
    let degree = parseInt(fish.Direction) * 180;
    image.style.transform = `rotate(${degree}deg)`;
}

function updateLabelText(fish){
    let labelId = getLabelIdByFishId(fish.FishId);
    changeElementTextById(labelId, fish.CurrentThreadId);
}

function createImage(fish) {
    let parent = document.querySelector(".aquarium");
    let img = document.createElement('img');
    img.className = "fish"
    img.style.width = `${fishImg.Width}px`;
    img.style.height = `${fishImg.Height}px`;
    img.id = getImageIdByFishId(fish.FishId);
    img.src = getImageNameByFish(fish);
    parent.appendChild(img);
}

function createImageLabel(fish){
    let parent = document.querySelector(".aquarium");
    let label = document.createElement('label');
    let labelForId = getImageIdByFishId(fish.FishId);
    let labelId = getLabelIdByFishId(fish.FishId);
    label.setAttribute('for', labelForId);
    label.innerText = fish.CurrentThreadId;
    label.id = labelId;
    parent.appendChild(label);
}

function removeImage(imageId) {
    let img = document.getElementById(imageId);
    img.remove();
}

function getImageNameByFish(fish) {
    if (fish instanceof TaskFish)
        return "../images/fishBlack.svg"
    else
        return "../images/fishWhite.svg"
}

function deserializeJsonToFish(data) {
    return JSON.parse(data);
}

function setAquariumSize(map) {
    let element = document.getElementById("backgroundImg");
    element.style.width = `${map.SizeX}px`;
    element.style.height = `${map.SizeY}px`;
}

function getMethodName(fish) {
    if (fish instanceof TaskFish)
        return "TryCreateTaskFish";
    else
        return "TryCreateThreadFish";
}

function isLocationValid(location) {
    if (!isLocationXValid(location.X)) {
        changeElementTextById("informationForm1", `Координата Х должна находиться в пределах от 0 до ${serverMap.SizeX}`)
        return false;
    }
    if (!isLocationYValid(location.Y)) {
        changeElementTextById("informationForm1", `Координата Y должна находиться в пределах от 0 до ${serverMap.SizeY}`)
        return false;
    }
    return true;
}

function isLocationXValid(x) {
    return x >= 0 && x <= serverMap.SizeX
}

function isLocationYValid(y) {
    return y >= 0 && y <= serverMap.SizeY
}

function getImageIdByFishId(fishId){
    return `image${fishId}`;
}

function getLabelIdByFishId(fishId){
    return `label${fishId}`;
}