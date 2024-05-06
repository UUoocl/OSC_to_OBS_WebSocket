const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const fs = require("fs");
const oscServer = require("node-osc");


const { electron } = require("process");

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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
}
//#endregion

//#region Open-osc-windows
ipcMain.on(
  "open-osc-window",
  (event, IP, Port, PW, oscIP, oscInPORT, oscOutPORT) => {
    console.log("main received osc window IPC");
    oscWindow = new BrowserWindow({
      width: 400,
      height: 400,
      x: 200,
      y: 100,
      title: "osc window",
      frame: true,
      resizable: true,
      //roundedCorners: false,
      movable: true,
      titleBarOverlay: false,
      transparent: false,
      titleBarStyle: "default",
      webPreferences: {
        sandbox: false,
        nodeIntegration: true,
        backgroundThrottling: false,
        preload: path.join(__dirname, "osc-preload.js"),
      },
    });

    windowSetup = {
      websocketIP: IP,
      websocketPort: Port,
      websocketPassword: PW,
      oscInPORT: oscInPORT,
      oscOutPORT: oscOutPORT,
      oscIP: oscIP,
    };
    //console.log(windowSetup)
    oscWindow.loadFile("osc.html");
    //oscWindow.webContents.openDevTools()
  }
);
//#endregion

//#region IPC APIs
//Send websocket and projector window to renderer
ipcMain.handle("get-obsWSdetails", async () => {
  console.log("sending window details to a new window");
  console.log(windowSetup);
  return windowSetup;
});

//#region IPC set OBS connection
ipcMain.on("set-obs-connection", async (event, IP, Port, PW) => {
  console.log("setting OBS Connection");

  webSocketDetails = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW,
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

ipcMain.on("wsConnect", (event) => {
  console.log("sending websocket details to new window");
  console.log(webSocketDetails);
  event.returnValue = webSocketDetails;
});
//#endregion

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
