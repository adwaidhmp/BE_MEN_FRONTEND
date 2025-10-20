import axios from "axios";

const adminapi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/admin",
  withCredentials: true, // include cookies in every request
});


export default adminapi;