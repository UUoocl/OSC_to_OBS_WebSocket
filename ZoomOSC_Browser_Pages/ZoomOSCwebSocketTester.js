window.addEventListener("osc-message", function (event) {
  console.log("osc-message received: ", event);
  document.getElementById("osc-message").innerText = JSON.stringify(
    event.detail.webSocketMessage
  );
});

document.getElementById("lowerHands").addEventListener("click", function callZoom() {
console.log("lower hands")
  obs.call("BroadcastCustomEvent", {
    eventData: {
      event_name: `OSC-out`,
//      command with no arguments
     address: "/zoom/lowerAllHands",

    },
  });
})
document.getElementById("turnOnVideo").addEventListener("click", function callZoom() {
console.log("lower hands")
  obs.call("BroadcastCustomEvent", {
    eventData: {
      event_name: `OSC-out`,
      
      //command with 1 arguments
     address: "/zoom/userName/videoOn",
      	"arg1":"Jonathan Wood"
    },
  });
})
document.getElementById("sendChat").addEventListener("click", function callZoom() {
  obs.call("BroadcastCustomEvent", {
    eventData: {
      event_name: `OSC-out`,
      
      address: "/zoom/userName/chat",
      	"arg1":"Jonathan Wood",
      	"arg2":"Hello!"
    },
  });
})
