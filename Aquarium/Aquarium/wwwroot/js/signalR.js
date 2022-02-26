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

//signalR connection settings
let connection = new signalR.HubConnectionBuilder()
    .withUrl("/aquarium")
    .build();
connection.start().then(() => {
    connection.invoke("TryCleanDictionaryFishes").then(data => {
        if (data === false)
            alert("Словарь не очистился");
    });
});

//start data and settings
let delay = 16;
let map = new Map(800, 400);
let fishImg = new Image(75, 50);
let serverMap = new Map(map.SizeX - fishImg.Width, map.SizeY);

setAquariumSize(map);

//button listeners
document.getElementById("addFishBtn").addEventListener("click", function (e) {
    document.getElementById("informationForm1").className = "text-success";
    changeElementTextById("informationForm1", "");
    document.getElementById("informationForm2").innerHTML = "";
    addFish();
    return false;
});
document.getElementById("deleteFishBtn").addEventListener("click", function (e) {
    document.getElementById("informationForm2").className = "text-success";
    changeElementTextById("informationForm2", "")
    document.getElementById("informationForm1").innerHTML = "";
    deleteFish();
    return false;
});

//logic
function addFish() {
    let fishId = getFishId();
    let location = getLocation();
    let direction = getDirection();
    let speedX = getSpeedX();
    let colorOfFish = getFishColor();
    
    
    
    let fish = new FishBase(location, direction, parseInt(speedX), parseInt(fishId));
    let methodName = getMethodName(colorOfFish);
    startFishMoving(fish, methodName);
}

function startFishMoving(fish, methodName) {
    let json = JSON.stringify(new AquariumInfo(fish, serverMap));
    connection.invoke(methodName, json).then(data => {
        if (data === true) {
            createImageWithLabel(fish, methodName);
            document.getElementById("informationForm1").className = "text-success";
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
        } else {
            document.getElementById("informationForm1").className = "text-success";
            changeElementTextById("informationForm1", `Рыбка с id ${fish.FishId} уже существует`);
        }
    })
}

function deleteFish() {
    let fishId = getElementValueById("fishIdToDelete");
    let elementName = "informationForm2";
    connection.invoke("TryDeleteFishById", parseInt(fishId)).then(data => {
        if (data === true) {
            removeImage(getImageIdByFishId(fishId));
            document.getElementById("informationForm2").className = "text-success";
            changeElementTextById(elementName, `Рыбка с id ${fishId} удалена`)
        } else {
            document.getElementById("informationForm1").className = "text-danger";
            changeElementTextById(elementName, `Рыбки с id ${fishId} не существует`)
        }
    })
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

function redrawFish(fish) {
    let divId = getImageIdByFishId(fish.FishId);
    let div = document.getElementById(divId);
    div.style.left = `${fish.Location.X}px`;
    div.style.top = `${fish.Location.Y}px`;

    let labelId = getLabelIdByFishId(fish.FishId);
    let label = document.getElementById(labelId);

    let degree = parseInt(fish.Direction) * 180;
    label.style.transform = `rotate(${degree}deg)`;
    div.style.transform = `rotate(${degree}deg)`;
}

function updateLabelText(fish) {
    let labelId = getLabelIdByFishId(fish.FishId);
    changeElementTextById(labelId, fish.CurrentThreadId);
}

function createImageWithLabel(fish, methodName) {
    let parent = document.querySelector(".aquarium");
    let div = document.createElement('div');
    div.id = getImageIdByFishId(fish.FishId);
    div.className = "fishWithLabel";

    let img = document.createElement('img');
    img.className = "fish"
    img.style.width = `${fishImg.Width}px`;
    img.style.height = `${fishImg.Height}px`;
    img.src = getImageSrcByMethodName(methodName);

    let label = document.createElement('label');
    let labelForId = getImageIdByFishId(fish);
    let labelId = getLabelIdByFishId(fish.FishId);
    label.setAttribute('for', labelForId);
    label.className = "labelForFish"
    label.innerText = fish.CurrentThreadId;
    label.id = labelId;

    div.appendChild(img);
    div.appendChild(label);

    parent.appendChild(div);
}

function removeImage(imageId) {
    let img = document.getElementById(imageId);
    img.remove();
}

function getImageSrcByMethodName(methodName) {
    return methodName === 'TryCreateTaskFish'
        ? "../images/turquoisFish.png"
        : "../images/whiteFish.png";
}

function deserializeJsonToFish(data) {
    return JSON.parse(data);
}

function setAquariumSize(map) {
    let element = document.getElementById("backgroundImg");
    element.style.width = `${map.SizeX}px`;
    element.style.height = `${map.SizeY}px`;
}

function getMethodName(color) {

    return color === "Бирюзовый"
        ? "TryCreateTaskFish"
        : "TryCreateThreadFish";
}

function getImageIdByFishId(fishId) {
    return `image${fishId}`;
}

function getLabelIdByFishId(fishId) {
    return `label${fishId}`;
}

//functions-helpers
function changeElementTextById(elementId, text) {
    document.getElementById(elementId).innerText = text;
}

function getElementValueById(elementId) {
    return document.getElementById(elementId).value;
}

function getSpeedX() {
    return getElementValueById("speed_input");
}

function getFishId() {
    return getElementValueById("fishIdToAdd");
}

function getFishColor() {
    return document.querySelector('input[name="color"]:checked').value;
}

//validation for inputs
function validInput(location, speed) {
    let parsed = parseInt(number);
    return (!isNaN(parsed) && parsed > 0);
}

function isIdValid(id) {
    let parsed = parseInt(id);
    if (!isNaN(parsed) && parsed > 0)
        return true;
    else {
        document.getElementById("informationForm1").className = "text-danger";
        changeElementTextById("informationForm1", "id должен быть положительным числом");
    }
}

function isSpeedValid(speed) {
    let parsed = parseInt(speed);
    if (!isNaN(parsed) && parsed > 0)
        return true;
    else {
        document.getElementById("informationForm1").className = "text-danger";
        changeElementTextById("informationForm1", "Скорость должна быть положительным числом");
    }
}

function isLocationValid(location) {
    if (!isLocationXValid(location.X)) {
        document.getElementById("informationForm1").className = "text-danger";
        changeElementTextById("informationForm1", `Координата Х должна находиться в пределах от 0 до ${serverMap.SizeX}`)
        return false;
    }
    if (!isLocationYValid(location.Y)) {
        document.getElementById("informationForm1").className = "text-danger";
        changeElementTextById("informationForm1", `Координата Y должна находиться в пределах от 0 до ${serverMap.SizeY}`)
        return false;
    }
    return true;
}

const isLocationXValid = (x) => x >= 0 && x <= serverMap.SizeX;
const isLocationYValid = (y) => y >= 0 && y <= serverMap.SizeY;

