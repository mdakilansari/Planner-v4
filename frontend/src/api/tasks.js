// frontend/src/api/tasks.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Assuming backend runs on 8000

// Helper function to handle API errors consistently
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTasks = async () => {
  const { data } = await apiClient.get('/tasks/');
  return data;
};

export const createTask = async (newTask) => {
  const { data } = await apiClient.post('/tasks/', newTask);
  return data;
};

export const updateTask = async ({ taskId, updates }) => {
  const { data } = await apiClient.put(`/tasks/${taskId}`, updates);
  return data;
};

export const deleteTask = async (taskId) => {
  const { data } = await apiClient.delete(`/tasks/${taskId}`);
  return data;
};

export const completeTask = async (taskId) => {
  // Use the update endpoint to mark as complete
  const { data } = await apiClient.put(`/tasks/${taskId}`, { is_completed: true });
  return data;
};

// Step 11 Support
export const snoozeTaskReminder = async (taskId) => {
  // This assumes the backend handles the 'snooze' logic via a specific endpoint
  // A simple POST to acknowledge (and schedule next) is typically used.
  const { data } = await apiClient.post(`/tasks/${taskId}/acknowledge`);
  return data;
};

export default apiClient;
