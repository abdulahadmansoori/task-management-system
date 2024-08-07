import { useApi } from "../contexts/ApiContext";
import { getUserLogin, registerUser } from "./MockApi";
// import { getUserLogin, registerUser } from "./mockApi";
import { fetchApi } from "./utils";

export const authService = {
    registerUser: async (name: string, phone: string, email: string, password: string) => {
        try {
            // const res = await fetchApi("register", "POST", {
            //     name: name,
            //     phone: phone,
            //     email: email,
            //     password: password,
            // });
            localStorage.setItem("user", JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                password: password,
            }));

            const res = registerUser(name, phone, email, password);

            return res;
        } catch (error) {
            return error;
        }
    },
    loginUser: async (email: string, password: string, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi("login", "POST", {
                username: email,
                // username: username,
                password: password,
                token: token,
            });

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    logout: async () => {
        try {
            // const res = await fetchApi("logout", "DELETE", undefined, { Accept: 'application/json', Authorization: 'Bearer 123' });
            localStorage.removeItem("token");

            return "";
        } catch (error) {
            return error;
        }
    },
};


