import axios from "axios";
export const server =axios.create({
    baseURL:"http://localhost:3000",
    headers:{
        "Content-Type":"application/json",
        "accept-language":"ar",
    }
})