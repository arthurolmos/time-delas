import * as firebase from "firebase";
import "firebase/firebase-storage";

export default async function ({ result, id, path }) {
  const localUri = result.uri;
  const filename = localUri.split("/").pop();

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  const response = await fetch(localUri);
  const blob = await response.blob();

  const storageRef = firebase
    .storage()
    .ref()
    .child(`images/${path}/${id}/${filename}`);

  const upload = await storageRef.put(blob).catch((err) => {
    console.log("ERROR ON UPLOAD IMAGE", err);
    throw new Error(err.message);
  });

  const url = await upload.ref.getDownloadURL();

  return url;
}
