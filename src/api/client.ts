import axios from "axios";
import storage from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setAuthorizationHeader = (accesToken: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${accesToken}`;
};

export const removeAuthorizationHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};

const storedToken = storage.get("auth");
if (storedToken) {
  setAuthorizationHeader(storedToken);
}

export default api;
