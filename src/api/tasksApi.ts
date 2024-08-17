import axios from 'axios';

const API_URL = 'https://trackify-backend-ylhf.onrender.com/tasks';

export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  projectId: string; //  a task is associated with a project
}

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks.");
  }
};

// Create a new task
export const createTask = async (task: Task): Promise<Task> => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task.");
  }
};

// Update an existing task
export const updateTask = async (taskId: string, updatedTask: Task): Promise<Task> => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task.");
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task.");
  }
};
