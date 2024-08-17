import axios from "axios";

const API_URL = "https://trackify-backend-ylhf.onrender.com/projects";


export interface Project {
    id?: string;
    name: string;
    description: string;

}

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Failed to fetch projects.");
    }
};

// Create a new project
export const createProject = async (project: Project): Promise<Project> => {
    try {
        const response = await axios.post(API_URL, project);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project.");
    }
};

// Update an existing project
export const updateProject = async (projectId: string, updatedProject: Project): Promise<Project> => {
    try {
        const response = await axios.put(`${API_URL}/${projectId}`, updatedProject);
        return response.data;
    } catch (error) {
        console.error("Error updating project:", error);
        throw new Error("Failed to update project.");
    }
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${projectId}`);
    } catch (error) {
        console.error("Error deleting project:", error);
        throw new Error("Failed to delete project.");
    }
};

// Fetch a single project by ID
export const fetchProjectById = async (projectId: string): Promise<Project> => {
    try {
        const response = await axios.get(`${API_URL}/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project:", error);
        throw new Error("Failed to fetch project.");
    }
};
