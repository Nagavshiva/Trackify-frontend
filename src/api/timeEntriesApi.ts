import axios from 'axios';

const API_URL = 'https://trackify-backend-ylhf.onrender.com/timeEntries'; // Adjust this to your actual API URL

export interface TimeEntry {
    id: string;
    taskId?: string;
    taskName?: string;
    projectName?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    isRunning?: boolean;
    count?: number;
}

// Fetch all time entries
export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching time entries:", error);
    throw new Error("Failed to fetch time entries.");
  }
};

// Create a new time entry
export const createTimeEntry = async (timeEntry: TimeEntry): Promise<TimeEntry> => {
  try {
    const response = await axios.post(API_URL, timeEntry);
    return response.data;
  } catch (error) {
    console.error("Error creating time entry:", error);
    throw new Error("Failed to create time entry.");
  }
};

// Update an existing time entry
export const updateTimeEntry = async (timeEntryId: string, updatedTimeEntry: TimeEntry): Promise<TimeEntry> => {
  try {
    const response = await axios.put(`${API_URL}/${timeEntryId}`, updatedTimeEntry);
    return response.data;
  } catch (error) {
    console.error("Error updating time entry:", error);
    throw new Error("Failed to update time entry.");
  }
};

// Delete a time entry
export const deleteTimeEntry = async (timeEntryId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${timeEntryId}`);
  } catch (error) {
    console.error("Error deleting time entry:", error);
    throw new Error("Failed to delete time entry.");
  }
};
