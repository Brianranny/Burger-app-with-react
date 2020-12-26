import axios from "axios";

const instance = axios.create({
  baseURL: "https://myburger-cd783.firebaseio.com/",
});

export default instance;
