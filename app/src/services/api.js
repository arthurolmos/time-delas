import axios from "axios";
import { environment } from "../config/env";

const api = axios.create({ baseURL: environment.backend });

export default api;
