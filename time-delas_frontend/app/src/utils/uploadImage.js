import api from "../services/api";

export default async function ({ result, id, path }) {
  console.log("result", id, path);
  const localUri = result.uri;
  const filename = localUri.split("/").pop();

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append("file", { uri: localUri, name: filename, type });

  const upload = await api.post(`/uploads/${path}/${id}`, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });

  const image = upload.data.url.split("\\").pop();
  console.log("IMAGE", image);

  return image;
}
