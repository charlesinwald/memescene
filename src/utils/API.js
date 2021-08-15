import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:13337/api",
  responseType: "json"
});

