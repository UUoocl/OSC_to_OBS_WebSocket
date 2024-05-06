const { contextBridge, ipcRenderer } = require('electron')

var windowId, Sources;
var scripts = [
              "./obs-ws.js",
              "./obsConnect.js",
              "./renderer.js"]

window.addEventListener('DOMContentLoaded', async () => { 
  scripts.forEach(script => {
    const scriptElem = document.createElement('script');
    scriptElem.src = script 
    scriptElem.async = false;
    scriptElem.onload = () => {
      console.log(`${script} Script loaded successfuly`);
    };
    scriptElem.onerror = () => {
      console.log(`${script} Error occurred while loading script`);
    };
    document.body.appendChild(scriptElem);
  });
})

contextBridge.exposeInMainWorld('electronAPI', {
  oscWindow: (IP, Port, PW, oscIP, oscInPORT,oscOutPORT) => ipcRenderer.send('open-osc-window',IP, Port, PW, oscIP, oscInPORT,oscOutPORT),
  setOBSconnection: (IP, Port, PW) => ipcRenderer.send('set-obs-connection', IP, Port, PW),
  getOBSconnection: () => ipcRenderer.invoke('get-obs-connection')
})