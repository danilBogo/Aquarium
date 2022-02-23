class Location {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }
}

const Direction = Enum({RIGHT: 'Right', LEFT: 'Left'});

class TaskFish {
    constructor(location, direction, speedX, fishId) {
        this.location = location;
        this.direction = direction;
        this.speedX = speedX;
        this.fishId = fishId;
    }
}

class ThreadFish {
    constructor(location, direction, speedX, fishId) {
        this.location = location;
        this.direction = direction;
        this.speedX = speedX;
        this.fishId = fishId;
    }
}


function subscribe(connection) {
    connection.on("TryCreateTaskFish", data => {
        console.log(data);
    });

    connection.on("TryCreateThreadFish", data => {
        console.log(data);
    });

    connection.on("TryDeleteFishById", data => {
        console.log(data);
    });
}

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/aquarium")
    .build();
connection.start()
subscribe();

document.getElementById("sendBtn").addEventListener("click", function (e) {
    addFish();
});

function addFish() {
    let locationX = document.getElementById("locationX");
    let locationY = document.getElementById("locationY");
    location = new Location(locationX, locationY);

    let directionInput = document.getElementById("direction");
    let direction;
    if (directionInput === "Left") direction = Direction.LEFT;
    else direction = Direction.RIGHT;

    let speedX = document.getElementById("speed_input");

    let fishId = document.getElementById("fishId");

    let colorOfFish = document.getElementById("color");
    if (colorOfFish === "Чёрный")
        connection.invoke("TryCreateTaskFish", new TaskFish(location, direction, speedX, fishId));
    else
        connection.invoke("TryCreateThreadFish", new ThreadFish(location, direction, speedX, fishId));
}


