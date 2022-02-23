let connection = new signalR.HubConnectionBuilder()
    .withUrl("/aquarium")
    .build();
connection.start()

document.getElementById("sendBtn").addEventListener("click", function (e) {
    addFish();
});

function addFish() {
    let fishId = document.getElementById("fishId");
}


connection.on("send", data => {
    console.log(data);
});

    .then(() => connection.invoke("send", "Hello"));


