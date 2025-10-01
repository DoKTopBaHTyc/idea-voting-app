import axios from "axios";

const isBrowser = typeof window !== "undefined";
const isDevPort3000 = isBrowser && window.location.port === "3000";
const host = isBrowser ? window.location.hostname : "localhost";

// Если фронтенд открыт на 3000 (контейнер frontend), то API доступен через nginx на 8080
const baseURL = isDevPort3000 ? `http://${host}:8080/api` : "/api";

const api = axios.create({
  baseURL,
});

export default api;
