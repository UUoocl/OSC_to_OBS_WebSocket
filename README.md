# OSC_to_OBS_WebSocket
An Electron App to transform OSC UDP messages to OBS Browser Source WebSocket messages

## OBS Setup
MediaPipe for OBS app requirements
1. Enable the OBS Web Socket Server ,
2. A Browser to receive the OSC data

### Turn on OBS WebSocket Server
- In OBS menu bar, click Tools --> WebSocket Server Settings
- Check "Enable WebSocket server"
- Press the "Show Connect Info" button.
  - Copy the Server Password

#### MacOS security warning
  Because this app is not "signed", MacOS may prevent the app from running. An error will appear that says the app is "damaged".    
![image](https://github.com/UUoocl/Transparent-Google-Slides/assets/99063397/1bb66bcb-c689-4da8-bb2e-d3c1b9ee2b20)

To run an app that is not signed, follow these steps. 
In the Finder, navigate to the folder containing the Transparent-Google-Slides app. 
Press "**Control" + click** on the folder, then click "New Terminal at Folder".  
In the Terminal type "**xattr -cr OSC_to_OBS_WebSocket_Server.app**" to remove the security warnings for this app. Now the app should run.  

For example, if the app is in the "Downloads" folder the terminal should look like "**userName@dhcp-##-##-####-### Downloads % xattr -cr OSC_to_OBS_WebSocket_Server.app**"


## Dev install

Steps to setup a developement environment. 
```
npm install electron --save-dev
npm install --save-dev @electron-forge/cli
npm install --save-dev @electron-forge/plugin-fuses
```
```
npm run start
```


```
npx electron-forge import
```

```
npm run make
```
