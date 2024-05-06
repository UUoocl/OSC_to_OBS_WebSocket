//variables
const wsConnectButton = document.getElementById("WSconnectButton");

//window.addEventListener('DOMContentLoaded', async () => {
loadScript();
async function loadScript() {
  setWSdefaults();
}

//Connect to OBS Web Socket Server
wsConnectButton.addEventListener("click", startWSconnection);

async function setWSdefaults() {
  console.log("set OBS connection defaults");
  savedConnection = await window.electronAPI.getOBSconnection();
  console.log(savedConnection);
  console.log(typeof savedConnection);
  if (savedConnection) {
    document.getElementById("IP").value = savedConnection.websocketIP;
    document.getElementById("Port").value = savedConnection.websocketPort;
    document.getElementById("PW").value = savedConnection.websocketPassword;
  }
}

async function startWSconnection() {
  document.getElementById("WSconnectButton").style.background = "#ff0000";
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  console.log("obsConnect js called", IP, Port, PW);

  //connectOBS function in the obsConnect.js
  connectionResult = await connectOBS(IP, Port, PW);
  console.log(connectionResult.socket);
  if (connectionResult.socket) {
    document.getElementById("WSconnectButton").style.background = "#00ff00";
    var wssDetails = {
      IP: IP,
      PORT: Port,
      PW: PW,
    };
    //send websocket server connection details to OBS browser source(s)
    await obs.call("CallVendorRequest", {
      vendorName: "obs-browser",
      requestType: "emit_event",
      requestData: {
        event_name: "ws-details",
        event_data: { wssDetails },
      },
    });
  } else {
    document.getElementById("WSconnectButton").style.background = "#ff0000";
  }

  //Save IP, Port,PW to file
  console.log("calling ipc contextBridge.");
  window.electronAPI.setOBSconnection(IP, Port, PW);
}

//#region Create OSC windows
var oscInput;
const oscButton = document.getElementById("oscButton");
oscButton.addEventListener("click", newOscWindow);

async function newOscWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  const oscIP = document.getElementById("oscIP").value;
  const oscInPORT = document.getElementById("oscInPORT").value;
  const oscOutPORT = document.getElementById("oscOutPORT").value;

  console.log(`${IP}, ${Port}, ${PW}, ${oscIP}, ${oscInPORT},${oscOutPORT}`);
  console.log("call main");
  window.electronAPI.oscWindow(IP, Port, PW, oscIP, oscInPORT, oscOutPORT);
}
//#endregion