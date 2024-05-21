//variables
const wsConnectButton = document.getElementById("WSconnectButton");

//window.addEventListener('DOMContentLoaded', async () => {
  loadScript();
  async function loadScript() {
    setWSdefaults();
    setZOSCdefaults();
    setTOSCdefaults();
  }
  
  var userPath;
  
  //Connect to OBS Web Socket Server
  wsConnectButton.addEventListener("click", startWSconnection);
  
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
  
async function setWSdefaults() {
  console.log("set OBS connection defaults");
  const savedConnection = await window.electronAPI.getOBSconnection();
  console.log(savedConnection);
  console.log(typeof savedConnection);
  if (savedConnection) {
    document.getElementById("IP").value = savedConnection.websocketIP;
    document.getElementById("Port").value = savedConnection.websocketPort;
    document.getElementById("PW").value = savedConnection.websocketPassword;
  }
}

async function setZOSCdefaults() {
  console.log("set ZoomOSC connection defaults");
  const savedConnection = await window.electronAPI.getZoomOSCdetails();
  console.log(savedConnection);
  console.log(typeof savedConnection);
  if (savedConnection) {
    document.getElementById("oscIP").value = savedConnection.oscIP;
    document.getElementById("oscInPORT").value = savedConnection.oscInPort;
    document.getElementById("oscOutPORT").value = savedConnection.oscOutPort;
  }
}

async function setTOSCdefaults() {
  console.log("set TouchOSC connection defaults");
  const savedConnection = await window.electronAPI.getTouchOSCdetails();
  console.log(savedConnection);
  console.log(typeof savedConnection);
  if (savedConnection) {
    document.getElementById("toscIP").value = savedConnection.oscIP;
    document.getElementById("toscInPORT").value = savedConnection.oscInPort;
    document.getElementById("toscOutPORT").value = savedConnection.oscOutPort;
  }
}


//#region start ZoomOSC 
const oscButton = document.getElementById("oscButton");
oscButton.addEventListener("click", newOscConnection);

async function newOscConnection() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  const oscIP = document.getElementById("oscIP").value;
  const oscInPORT = document.getElementById("oscInPORT").value;
  const oscOutPORT = document.getElementById("oscOutPORT").value;

  console.log(`${IP}, ${Port}, ${PW}, ${oscIP}, ${oscInPORT},${oscOutPORT}`);
  //Save ZoomOSC Settings
  window.electronAPI.saveZoomOSCsettings(oscIP, oscInPORT, oscOutPORT);
  
  //create ZoomOSC OSC Server and Client
  window.electronAPI.setZoomOSCconnection(IP, Port, PW, oscIP, oscInPORT, oscOutPORT);
  
}
//#endregion

//#region start TouchOSC 
const toscButton = document.getElementById("toscButton");
toscButton.addEventListener("click", newTOSCconnection);

async function newTOSCconnection() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  const oscIP = document.getElementById("toscIP").value;
  const oscInPORT = document.getElementById("toscInPORT").value;
  const oscOutPORT = document.getElementById("toscOutPORT").value;

  console.log(`${IP}, ${Port}, ${PW}, ${oscIP}, ${oscInPORT},${oscOutPORT}`);
  //Save TouchOSC Settings
  console.log("call main");
  window.electronAPI.saveTouchOSCsettings(oscIP, oscInPORT, oscOutPORT);
  
  console.log("call preload");
  //create ZoomOSC OSC Server and Client
  window.electronAPI.setTouchOSCconnection(IP, Port, PW, oscIP, oscInPORT, oscOutPORT);
  
}
//#endregion