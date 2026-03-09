import axios from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

export default API;
