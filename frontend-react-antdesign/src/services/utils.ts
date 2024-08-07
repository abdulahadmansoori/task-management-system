import axios from "axios";
import { useAuth } from "../contexts/authContext";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const fetchApi = async (endpoint: string, method: string, body?: object, headers?: object, token: string) => {
    try {
        const combinedHeaders = {
            "Content-Type": endpoint == "login" ? "application/x-www-form-urlencoded" : "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...headers,
        };

        const response = await axios({
            method: method,
            url: `${BASE_URL}${endpoint}`,
            headers: combinedHeaders,
            data: body,
        });

        return response.data;
    } catch (error) {
        return error;
    }
};


