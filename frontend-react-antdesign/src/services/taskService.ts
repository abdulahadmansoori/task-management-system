import { fetchApi } from "./utils";

export const tasksService = {
    getTasks: async (projectId: number, token: string) => {
        try {
            const res = await fetchApi(`project/${projectId}/task`, "GET", {}, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    getTaskOptions: async (projectId: number, token: string) => {
        try {
            const res = await fetchApi(`project/${projectId}/task-option`, "GET", {}, {}, token);
            return res;
        } catch (error) {
            return error;
        }
    },
    createTask: async (project_id: number, data: any, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi(`project/${project_id}/task`, "POST", data, {}, token);
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    updateTask: async (project_id: number, task_id: number, data: any, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi(`project/${project_id}/task/${task_id}`, "PUT", data, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    deleteTask: async (project_id: number, task_id: number, token: string) => {
        try {
            // const { fetchApi } = useApi();
            const res = await fetchApi(`project/${project_id}/task/${task_id}`, "DELETE", {}, {}, token);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
}