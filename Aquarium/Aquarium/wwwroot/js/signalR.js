class Location {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }
}

class BaseFish {
    constructor(location, direction, speedX, fishId) {
        this.Location = location;
        this.Direction = direction;
        this.SpeedX = speedX;
        this.FishId = fishId;
    }
}

class TaskFish extends BaseFish{
    constructor(location, direction, speedX, fishId) {
        super(location, direction, speedX, fishId);
    }}

class ThreadFish extends BaseFish{
    constructor(location, direction, speedX, fishId) {
        super(location, direction, speedX, fishId);
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
let delay = 10;
let map = new Map(800, 400);
let fishImg = new Image(100, 75);
let serverMap = new Map(map.SizeX - fishImg.Width, map.SizeY);

setAquariumSize(map);

//button listeners
document.getElementById("addFishBtn").addEventListener("click", function (e) {
    clearInfoMessages();
    addFish();
    return false;
});
document.getElementById("deleteFishBtn").addEventListener("click", function (e) {
    clearInfoMessages();
    deleteFish();
    return false;
});

function clearInfoMessages() {
    changeElementTextById("informationForm1", "");
    changeElementTextById("informationForm2", "");
}

//logic
function addFish() {
    let fishId = getFishId();
    let location = getLocation();
    let direction = getDirection();
    let speedX = getSpeedX();
    let fishColor = getFishColor();

    if (!isFormValid(fishId, location, speedX))
        return false;

    let fish = getFish(location, direction, parseInt(speedX), parseInt(fishId), fishColor);
    let methodName = getMethodName(fishColor);
    startFishMoving(fish, methodName);
}

function startFishMoving(fish, methodName) {
    let json = JSON.stringify(new AquariumInfo(fish, serverMap));
    connection.invoke(methodName, json).then(data => {
        if (data === true) {
            createImageWithLabel(fish, methodName);
            showMessage("informationForm1", "text-success", `Рыбка с id ${fish.FishId} создана`);
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
            showMessage("informationForm1", "text-success", `Рыбка с id ${fish.FishId} уже существует`);
        }
    })
}

function deleteFish() {
    let fishId = getElementValueById("fishIdToDelete");
    let elementName = "informationForm2";
    connection.invoke("TryDeleteFishById", parseInt(fishId)).then(data => {
        if (data === true) {
            removeDiv(getDivIdByFishId(fishId));
            showMessage("informationForm2", "text-success", `Рыбка с id ${fishId} удалена`);
        } else {
            showMessage("informationForm2", "text-danger", `Рыбки с id ${fishId} не существует`);
        }
    })
}

function getLocation() {
    let locationX = getElementValueById("locationX");
    let locationY = getElementValueById("locationY");
    return new Location(parseInt(locationX), parseInt(locationY));
}

const getCheckedValueByRadioName = name => document.querySelector(`input[name = ${name}]:checked`).value;

function getDirection() {
    let direction = getCheckedValueByRadioName('direction');
    return (direction === getDefaultDirection())
        ? Direction.RIGHT
        : Direction.LEFT;
}

const getDefaultDirection = () => getElementValueById("rightRadio");

function redrawFish(fish) {
    let divId = getDivIdByFishId(fish.FishId);
    let div = document.getElementById(divId);
    div.style.left = `${fish.Location.X}px`;
    div.style.top = `${fish.Location.Y}px`;

    let degree = parseInt(fish.Direction) * 180;
    let img = document.getElementById(getImageIdByFishId(fish.FishId));
    img.style.transform = `rotate(${degree}deg)`;
}

function updateLabelText(fish) {
    let labelId = getLabelIdByFishId(fish.FishId);
    changeElementTextById(labelId, fish.CurrentThreadId);
}

function createImageWithLabel(fish, methodName) {
    let parent = document.querySelector(".aquarium");
    let div = document.createElement('div');
    div.className = "fishWithLabel";
    div.id = getDivIdByFishId(fish.FishId);

    let img = createImage(methodName);
    img.id = getImageIdByFishId(fish.FishId);

    let label = createLabel(fish);

    div.appendChild(img);
    div.appendChild(label);
    parent.appendChild(div);
}

function createImage(methodName) {
    let img = document.createElement('img');
    img.className = "fish"
    img.style.width = `${fishImg.Width}px`;
    img.style.height = `${fishImg.Height}px`;
    img.src = getImageSrcByMethodName(methodName);
    return img;
}

function createLabel(fish) {
    let label = document.createElement('label');
    let labelForId = getImageIdByFishId(fish);
    let labelId = getLabelIdByFishId(fish.FishId);
    label.setAttribute('for', labelForId);
    label.className = "labelForFish"
    label.innerText = fish.CurrentThreadId;
    label.id = labelId;
    return label;
}

function removeDiv(divId) {
    document.getElementById(divId).remove();
}

function showMessage(id, messageType, text) {
    document.getElementById(id).className = messageType;
    changeElementTextById(id, text);
}

const getDivIdByFishId = fishId => `divId${fishId}`;

function getImageSrcByMethodName(methodName) {
    return methodName === 'TryCreateTaskFish'
        ? "../images/turquoiseFish.png"
        : "../images/whiteFish.png";
}

const deserializeJsonToFish = data => JSON.parse(data);

function setAquariumSize(map) {
    let element = document.getElementById("backgroundImg");
    element.style.width = `${map.SizeX}px`;
    element.style.height = `${map.SizeY}px`;
}

function getMethodName(color) {
    return color === getDefaultColor()
        ? "TryCreateTaskFish"
        : "TryCreateThreadFish";
}

function getFish(location, direction, speedX, fishId, color){
    return color === getDefaultColor()
        ? new TaskFish(location, direction, speedX, fishId)
        : new ThreadFish(location, direction, speedX, fishId);
}

const getDefaultColor = () => getElementValueById("turquoiseRadio");

const getImageIdByFishId = fishId => `image${fishId}`;

const getLabelIdByFishId = fishId => `label${fishId}`;

//functions-helpers
function changeElementTextById(elementId, text) {
    document.getElementById(elementId).innerText = text;
}

const getElementValueById = elementId => document.getElementById(elementId).value;

const getSpeedX = () => getElementValueById("speed_input");

const getFishId = () => getElementValueById("fishIdToAdd");

const getFishColor = () => getCheckedValueByRadioName('color');



//validation for inputs
function isNumberPositive(number, errorMessage) {
    let parsedNumber = parseInt(number);
    if (!isNaN(parsedNumber) && parsedNumber > 0)
        return true;
    else {
        document.getElementById("informationForm1").className = "text-danger";
        changeElementTextById("informationForm1", errorMessage);
    }
}

const isIdValid = id => isNumberPositive(id, "id должен быть положительным числом");

const isSpeedValid = speed => isNumberPositive(speed, "Скорость должна быть положительным числом");

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

const isFormValid = (fishId, location, speed) =>
    isIdValid(fishId) && isLocationValid(location) && isSpeedValid(speed);