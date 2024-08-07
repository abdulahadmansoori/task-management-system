import { useApi } from "../contexts/ApiContext";
import { getUserLogin, registerUser } from "./MockApi";
// import { getUserLogin, registerUser } from "./mockApi";
import { fetchApi } from "./utils";

export const projectService = {
    getProjects: async (token: string) => {
        try {
            const res = await fetchApi("admin/project", "GET", {}, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    getUserProjects: async (user_id: number, token: string) => {
        try {
            const res = await fetchApi(`admin/project/user/${user_id}`, "GET", {}, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    createProject: async (data: any, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi("admin/project", "POST", {
                name: data.name
            }, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    assignUserToProject: async (project_id: number, user_id: number, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi(`admin/project/${project_id}/assign?user_id=${user_id}`, "POST", {}, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    unassignUserToProject: async (project_id: number, user_id: number, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi(`admin/project/${project_id}/unassign?user_id=${user_id}`, "POST", {}, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    updateProject: async (id: number, data: any, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi("admin/project/" + id, "PUT", data, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    deleteProject: async (id: number, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi("admin/project/" + id, "DELETE", {}, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
};


