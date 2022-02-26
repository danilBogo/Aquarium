﻿// const hubConnection = new signalR.HubConnectionBuilder()
//     .withUrl("/chat")
//     .build();
//
// hubConnection.on("Send", function (data) {
//
//     let elem = document.createElement("p");
//     elem.appendChild(document.createTextNode(data));
//     let firstElem = document.getElementById("chatroom").firstChild;
//     document.getElementById ("chatroom").insertBefore(elem, firstElem);
//
// });
//
// document.getElementById("sendBtn").addEventListener("click", function (e) {
//     let message = document.getElementById("message").value;
//     hubConnection.invoke("Send", message);
// });
//
// hubConnection.start();

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/aquarium")
    .build();

connection.on("send", data => {
    console.log(data);
});

connection.start()
    .then(() => connection.invoke("send", "Hello"));