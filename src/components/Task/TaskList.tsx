import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTasks, deleteTask } from '../../api/tasksApi';
import { fetchProjectById } from '../../api/projectsApi';
import TaskForm from './TaskForm';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  projectId: string;
}

interface Project {
  id?: string;
  name: string;
  description: string;
}

const TaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Retrieve projectId from the route parameters
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null); // State to store project details

  useEffect(() => {
    loadProjectDetails();
    loadTasks();
  }, [projectId]); // Reload tasks and project details when the projectId changes

  const loadProjectDetails = async () => {
    try {
      const project = await fetchProjectById(projectId!);
      setProject(project);
    } catch (error) {
      console.error("Failed to load project details:", error);
    }
  };

  const loadTasks = async () => {
    const tasks = await fetchTasks();
    const filteredTasks = tasks.filter(task => task.projectId === projectId);
    setTasks(filteredTasks);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true); // Open modal for editing
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      await loadTasks();
    }
  };

  const handleFormSuccess = async () => {
    setSelectedTask(null);
    setIsModalOpen(false); // Close modal after success
    await loadTasks();
  };

  const handleCreateNewTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true); // Open modal for creating a new task
  };

  return (
    <div className="container mx-auto">
      {project && <h2 className="text-2xl font-bold mb-4">Tasks for {project.name}</h2>}

      {/* Create Task Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateNewTask}
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Create Task
        </button>
      </div>

      {/* Single table for all tasks */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-700 border-b border-gray-300">Task Name</th>
              <th className="p-4 text-left text-gray-700 border-b border-gray-300">Description</th>
              <th className="p-4 text-left text-gray-700 border-b border-gray-300">Completed</th>
              <th className="p-4 text-center text-gray-700 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="p-4 text-gray-800 border-b border-gray-300">{task.title}</td>
                <td className="p-4 text-gray-800 border-b border-gray-300">{task.description}</td>
                <td className="p-4 text-gray-800 border-b border-gray-300">{task.completed ? 'Yes' : 'No'}</td>
                <td className="p-4 text-center border-b border-gray-300">
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-2 py-1 mr-2 text-yellow-500 hover:text-yellow-700"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (task.id) {
                        handleDelete(task.id);
                      } else {
                        console.error("Task ID is undefined");
                      }
                    }}
                    className="px-2 py-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Task Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <TaskForm
              existingTask={selectedTask}
              onSuccess={handleFormSuccess}
              projectId={projectId!} // Pass projectId to TaskForm
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
