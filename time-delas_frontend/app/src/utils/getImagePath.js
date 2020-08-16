import { environment } from "../config/env";

export default function ({ id, file, path }) {
  return `${environment.backend}/pictures/${path}/${id}/${file}`;
}
