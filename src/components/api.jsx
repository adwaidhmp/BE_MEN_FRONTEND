import axios from "axios";

const api = axios.create({
  baseURL: "https://bemen.duckdns.org/api/v1/user/",
  withCredentials: true, // include cookies in every request
});


export default api;
