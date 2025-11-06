import axios from "axios";

const adminapi = axios.create({
  baseURL: "https://bemen.duckdns.org/api/v1/admin",
  withCredentials: true, // include cookies in every request
});


export default adminapi;