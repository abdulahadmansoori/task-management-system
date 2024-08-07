import { fetchApi } from "./utils";

export const userService = {
    getUser: async (token: string) => {
        try {
            const res = await fetchApi("profile", "GET", {}, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    getUsers: async (token: string) => {
        try {
            const res = await fetchApi("users", "GET", {}, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    updateUser: async (id: number, data: any, token: string) => {
        try {
            const res = await fetchApi("users/" + id, "PUT", { ...data, hashed_password: 'null' }, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    createUser: async (data: any, token: string) => {
        try {
            const res = await fetchApi("register", "POST", { ...data, hashed_password: 'null' }, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    deleteUser: async (id: number, token: string) => {
        try {
            const res = await fetchApi("users/" + id, "DELETE", {}, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
}
