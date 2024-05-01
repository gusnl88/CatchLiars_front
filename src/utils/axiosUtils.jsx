// axios.js

import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8089",
    withCredentials: true,
});

export default instance;
