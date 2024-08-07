export interface DataType {
    id: number;
    key: string;
    name: string;
    age: number;
    address: string;
    timestamp: Date;
    tags: string[];
}

export interface TaskDataType {
    key: React.ReactNode;
    parent_task: string;
    project: string;
    title: string;
    description: string;
    status: string;
    assigned_to: string;
    children?: TaskDataType[];
}

export interface ProjectDataType {
    id: number;
    key: number;
    name: string;
    timestamp: string;
}
export interface UserDataType {
    id: number;
    key: number;
    name: string;
    email: string;
    role: string;
    // password: string;
    timestamp: string;
}