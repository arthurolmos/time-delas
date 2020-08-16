import Constants from "expo-constants";

const { manifest } = Constants;

export const environment = {
  backend: `http://${manifest.debuggerHost.split(":").shift()}:3333`,
  // backend: "http://2ad5de067488.ngrok.io",
};
