import React, { useState } from 'react';
import { createTask, updateTask } from '../../api/tasksApi';

interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  projectId: string;
}

interface TaskFormProps {
  existingTask?: Task | null;
  onSuccess: () => void;
  projectId: string; // Pass the projectId directly from the parent component
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask, onSuccess, projectId }) => {
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [completed, setCompleted] = useState(existingTask?.completed || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = { title, description, completed, projectId };

    if (existingTask) {
      // If editing an existing task
      await updateTask(existingTask.id!, taskData);
    } else {
      // If creating a new task
      await createTask(taskData);
    }

    // Reset form fields
    setTitle('');
    setDescription('');
    setCompleted(false);

    // Trigger the onSuccess callback
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-4">
        <label className="block text-gray-700">Task Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Completed:</label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        {existingTask ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
