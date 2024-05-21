const { contextBridge, ipcRenderer} = require("electron");
const path = require("path");
("use strict");
const { Client, Server, Message } = require("node-osc");
const OBSWebSocket = require("obs-websocket-js").default;

console.log('path',path.join(__dirname,"hi"))
contextBridge.exposeInMainWorld("electronAPI", {
  
  setOBSconnection: (IP, Port, PW) =>
    ipcRenderer.send("set-obs-connection", IP, Port, PW),
  getOBSconnection: () => ipcRenderer.invoke("get-obs-connection"),
  
  setZoomOSCconnection: (IP, Port, PW, oscIP, oscInPORT, oscOutPORT) =>
    setZoomOSCconnection(IP, Port, PW, oscIP, oscInPORT, oscOutPORT),
  saveZoomOSCsettings: (oscIP, oscInPORT, oscOutPORT) => 
    ipcRenderer.send("save-zosc-settings", oscIP, oscInPORT, oscOutPORT),
  getZoomOSCdetails: () => ipcRenderer.invoke("get-zoomosc-connection"),

  setTouchOSCconnection: (IP, Port, PW, oscIP, oscInPORT, oscOutPORT) =>
    setTouchOSCconnection(IP, Port, PW, oscIP, oscInPORT, oscOutPORT),
  saveTouchOSCsettings: (oscIP, oscInPORT, oscOutPORT) => 
    ipcRenderer.send("save-tosc-settings", oscIP, oscInPORT, oscOutPORT),
  getTouchOSCdetails: () => ipcRenderer.invoke("get-touchosc-connection")
});

var windowId, Sources;
var scripts = ["./obs-ws.js", "./obsConnect.js", "./renderer.js"];

window.addEventListener("DOMContentLoaded", async () => {
  scripts.forEach((script) => {
    const scriptElem = document.createElement("script");
    scriptElem.src = script;
    scriptElem.async = false;
    scriptElem.onload = () => {
      console.log(`${script} Script loaded successfuly`);
    };
    scriptElem.onerror = () => {
      console.log(`${script} Error occurred while loading script`);
    };
    document.body.appendChild(scriptElem);
  });
});

/*
 *Create ZoomOSC OSC Server and client
 */
//#region Create ZoomOSC Connections

async function setZoomOSCconnection(
  websocketIP,
  websocketPort,
  websocketPassword,
  oscIP,
  oscInPORT,
  oscOutPORT
) {
  /*
   *Create a ZoomOSC to OBS connection
   */
  console.log("Made it to main function set zosc connection");
  const zobs = new OBSWebSocket(websocketIP, websocketPort, websocketPassword);
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await zobs.connect(
      `ws://${websocketIP}:${websocketPort}`,
      websocketPassword,
      {
        rpcVersion: 1,
      }
    );
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    );
    //document.title = "connection set";
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
  }
  zobs.on("error", (err) => {
    console.error("Socket error:", err);
  });
  console.log(`ws://${websocketIP}:${websocketPort}`);

  console.log(typeof oscInPORT, typeof oscIP);
  console.log(oscInPORT, oscIP);

  var zoscServer = new Server(oscInPORT, oscIP);

  zoscServer.on("listening", () => {
    console.log("ZoomOSC Server is listening.");
  });

  zoscServer.on("message", (msg) => {
    console.log(`Message: ${msg}`);
    //window.document.getElementById("messages").innerHTML = `${msg} <br> ${window.document.getElementById("messages").innerHTML}`;
    window.document.getElementById("zoomInMessages").innerHTML = `${msg}`;
    sendToOBS(msg, zobs, "zoomOSC-message");
  });

  /*
   *Create OSC Client Out Port
   *message from OBS to Zoom
   */
  const zoomClient = new Client(oscIP, oscOutPORT);
  console.log("zoomClient", zoomClient, oscIP, oscOutPORT, oscInPORT);

  zobs.on("CustomEvent", function (event) {
    console.log(event);
    if (event.event_name === "OSC-out") {
      const message = new Message(event.address);
      if (Object.hasOwn(event, "arg1")) {
        message.append(event.arg1);
        console.log("arg1", message);
      }
      if (Object.hasOwn(event, "arg2")) {
        message.append(event.arg2);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg3")) {
        message.append(event.arg3);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg4")) {
        message.append(event.arg4);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg5")) {
        message.append(event.arg5);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg6")) {
        message.append(event.arg6);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg7")) {
        message.append(event.arg7);
        console.log(message);
      }
      console.log(message);
      window.document.getElementById(
        "zoomOutMessages"
      ).innerHTML = `${JSON.stringify(message)}`;
      zoomClient.send(message, (err) => {
        if (err) {
          console.error(new Error(err));
        }
      });
      //client.send(`${event.command} "${event.data}"`)
    }
  });
}

//#endregion

/*
 *Forward In Port messages to OBS
 */

function sendToOBS(msgParam, obsParam, eventName) {
  console.log("sending message:", JSON.stringify(msgParam));
  const webSocketMessage = JSON.stringify(msgParam);
  //send results to OBS Browser Source
  obsParam.call("CallVendorRequest", {
    vendorName: "obs-browser",
    requestType: "emit_event",
    requestData: {
      event_name: eventName,
      event_data: { webSocketMessage },
    },
  });

  //send results to Advanced Scene Switcher

  obsParam.call("CallVendorRequest", {
    vendorName: "AdvancedSceneSwitcher",
    requestType: "AdvancedSceneSwitcherMessage",
    requestData: {
      message: webSocketMessage,
    },
  });
}

/*
 *Create TouchOSC OSC Server and client
 */
//#region Create TouchOSC Connections

async function setTouchOSCconnection(
  websocketIP,
  websocketPort,
  websocketPassword,
  oscIP,
  oscInPORT,
  oscOutPORT
) {
  /*
   *Create a TouchOSC to OBS connection
   */
  console.log("Made it to main function set zosc connection");
  const tobs = new OBSWebSocket(websocketIP, websocketPort, websocketPassword);
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await tobs.connect(
      `ws://${websocketIP}:${websocketPort}`,
      websocketPassword,
      {
        rpcVersion: 1,
      }
    );
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    );
    //document.title = "connection set";
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
  }
  tobs.on("error", (err) => {
    console.error("Socket error:", err);
  });
  console.log(`ws://${websocketIP}:${websocketPort}`);

  console.log(typeof oscInPORT, typeof oscIP);
  console.log(oscInPORT, oscIP);

  var toscServer = new Server(oscInPORT, oscIP);

  toscServer.on("listening", () => {
    console.log("ZoomOSC Server is listening.");
  });

  toscServer.on("message", (msg) => {
    console.log(`Message: ${msg}`);
    //window.document.getElementById("messages").innerHTML = `${msg} <br> ${window.document.getElementById("messages").innerHTML}`;
    window.document.getElementById("touchInMessages").innerHTML = `${msg}`;
    sendToOBS(msg, tobs, "touchOSC-message");
  });

  /*
   *Create touchOSC Client Out Port
   *message from OBS to Zoom
   */
  const touchClient = new Client(oscIP, oscOutPORT);
  console.log("touchClient", touchClient, oscIP, oscOutPORT, oscInPORT);

  tobs.on("CustomEvent", function (event) {
    console.log(event);
    if (event.event_name === "TOSC-out") {
      const message = new Message(event.address);
      if (Object.hasOwn(event, "arg1")) {
        message.append(event.arg1);
        console.log("arg1", message);
      }
      if (Object.hasOwn(event, "arg2")) {
        message.append(event.arg2);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg3")) {
        message.append(event.arg3);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg4")) {
        message.append(event.arg4);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg5")) {
        message.append(event.arg5);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg6")) {
        message.append(event.arg6);
        console.log(message);
      }
      if (Object.hasOwn(event, "arg7")) {
        message.append(event.arg7);
        console.log(message);
      }
      console.log(message);
      window.document.getElementById(
        "touchOutMessages"
      ).innerHTML = `${JSON.stringify(message)}`;
      touchClient.send(message, (err) => {
        if (err) {
          console.error(new Error(err));
        }
      });
      //client.send(`${event.command} "${event.data}"`)
    }
  });
}
//#endregion
