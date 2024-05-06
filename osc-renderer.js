console.log("Document Loaded");
var setupDetails,
  sourceWidth,
  sourceHeight,
  eltWidth,
  eltHeight,
  windowID,
  sourceName,
  MPvalues;
var frameRate, FPSElement, canvasElement, IP, PORT, PW, oscIP, oscInPORT, oscOutPORT;
var now;
var then = Date.now();
var interval;
var delta;

loadRenderer();
//window.addEventListener("DOMContentLoaded", async () => {
async function loadRenderer() {
  //get obs ws socket details
  setupDetails = await window.electronAPI.handleGetOBSWSdetails();
  console.log("IPC connect details");
  console.log(
    setupDetails.websocketIP,
    setupDetails.websocketPort,
    setupDetails.websocketPassword,
    setupDetails.inputID,
    setupDetails.oscInPORT
    ,setupDetails.oscOutPORT)

    IP = setupDetails.websocketIP
    PORT = setupDetails.websocketPort
    PW =  setupDetails.websocketPassword
    oscIP = setupDetails.oscIP
    oscInPORT = setupDetails.oscInPORT
    oscOutPORT = setupDetails.oscOutPORT

    //connect to OBS WebSocket Server and Create OSC Server
    await window.electronAPI.createOCSserver(IP,PORT,PW, oscIP, oscInPORT,oscOutPORT);
}
