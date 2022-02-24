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
document.getElementById("addFishBtn").addEventListener("click", function (e) {
    addFish();
    return false;
});

function addFish() {
    let locationX = document.getElementById("locationX").value;
    let locationY = document.getElementById("locationY").value;
    let location = new Location(parseInt(locationX), parseInt(locationY));
    let directionInput = document.getElementById("direction").innerText;
    let direction;
    if (directionInput === "Left") direction = Direction.LEFT;
    else direction = Direction.RIGHT;

    let speedX = document.getElementById("speed_input").value;

    let fishId = document.getElementById("fishId").value;

    let colorOfFish = document.getElementById("color").value;
    if (colorOfFish === "Чёрный") {
        let fish = new TaskFish(location, direction, parseInt(speedX), parseInt(fishId));
        let json = JSON.stringify(fish);
        connection.invoke("TryCreateTaskFish", json).then(data => alert(data))
        //setTimeout(connection.invoke("GetFishJsonById", fishId).then(data => alert(data)), 2000);
    } else {
        let fish = new ThreadFish(location, direction, parseInt(speedX), parseInt(fishId));
        let json = JSON.stringify(fish);
        connection.invoke("TryCreateThreadFish", json).then(data => alert(data));
        setInterval (() => {
            connection.invoke("GetFishJsonById", fish.FishId).then(data => console.log(data))
        }, 1000);
    }
}


