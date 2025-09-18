import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthorizationHeader = (accesToken: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${accesToken}`;
};

export const removeAuthorizationHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;