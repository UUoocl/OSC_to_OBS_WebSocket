const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const fs = require("fs");

//window variables
let mainWindow, oscWindow;
var windowSetup, source;
var webSocketDetails = {
  websocketIP: "",
  websocketPort: "",
  websocketPassword: "",
};

//#region When app starts Create main window
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
//#endregion

//#region create main window
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    x: 0,
    y: 0,
    title: __dirname,
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}
//#endregion

//#region IPC APIs

//#region IPC set OBS connection
ipcMain.on("set-obs-connection", async (event, IP, Port, PW) => {
  console.log("setting OBS Connection");
  
  webSocketDetails = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW
  };
  console.log(
    webSocketDetails.websocketIP,
    webSocketDetails.websocketPort,
    webSocketDetails.websocketPassword
  );
  //write to file
  let sData = JSON.stringify(webSocketDetails);
  const userpath = app.getPath("userData");
  fs.writeFileSync(`${userpath}/webSocket_server_setting.txt`, sData);
});

ipcMain.handle("get-obs-connection", async (event) => {
  console.log("set OBS connection defaults");
  const userpath = app.getPath("userData");
  console.log(userpath);
  //console.log(fs.exists(`${userpath}/webSocket_server_setting.txt`))
  if (fs.existsSync(`${userpath}/webSocket_server_setting.txt`)) {
    let dt = fs.readFileSync(`${userpath}/webSocket_server_setting.txt`);
    let data = JSON.parse(dt);
    console.log(data);
    return data;
  }
});
//#endregion

//#region IPC set ZoomOSC connection
ipcMain.on("save-zosc-settings", async (event, oscIP, oscInPort, oscOutPort) => {
  console.log("save settings ZoomOSC");
  let zoscDetails = {
    oscIP: oscIP, 
    oscInPort: oscInPort,
    oscOutPort: oscOutPort
    };
  const sData = JSON.stringify(zoscDetails);
  const userpath = app.getPath("userData");
  fs.writeFileSync(`${userpath}/zoomOSC_setting.txt`, sData);
});

ipcMain.handle("get-zoomosc-connection", async (event) => {
  console.log("get ZoomOsc default settings");
  const userpath = app.getPath("userData");
  console.log(`${userpath}/zoomOSC_setting.txt`);
  console.log(fs.existsSync(`${userpath}/zoomOSC_setting.txt`));
  //console.log(fs.exists(`${userpath}/zoomOSC_setting.txt`))
  if (fs.existsSync(`${userpath}/zoomOSC_setting.txt`)) {
    let dt = fs.readFileSync(`${userpath}/zoomOSC_setting.txt`);
    let data = JSON.parse(dt);
    console.log(data);
    return data;
  }
});

//#region IPC set TouchOSC connection
ipcMain.on("save-tosc-settings", async (event, oscIP, oscInPort, oscOutPort) => {
  console.log("save settings TouchOSC");
  let toscDetails = {
    oscIP: oscIP, 
    oscInPort: oscInPort,
    oscOutPort: oscOutPort
    };
  const sData = JSON.stringify(toscDetails);
  const userpath = app.getPath("userData");
  fs.writeFileSync(`${userpath}/touchOSC_setting.txt`, sData);
});

ipcMain.handle("get-touchosc-connection", async (event) => {
  console.log("get touchOsc default settings");
  const userpath = app.getPath("userData");
  console.log(`${userpath}/touchOSC_setting.txt`);
  console.log(fs.existsSync(`${userpath}/touchOSC_setting.txt`));
  //console.log(fs.exists(`${userpath}/zoomOSC_setting.txt`))
  if (fs.existsSync(`${userpath}/touchOSC_setting.txt`)) {
    let dt = fs.readFileSync(`${userpath}/touchOSC_setting.txt`);
    let data = JSON.parse(dt);
    console.log(data);
    return data;
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
