import React, { useState } from 'react';
import { createProject, updateProject } from '../../api/projectsApi';

interface Project {
    id?: string;  // `id` is optional because it might not exist when creating a new project
    name: string;
    description: string;
}

interface ProjectFormProps {
  existingProject?: Project | null;  // Pass this prop if editing an existing project
  onSuccess: () => void;  // Callback to be triggered after successful form submission
}

const ProjectForm: React.FC<ProjectFormProps> = ({ existingProject, onSuccess }) => {
  const [name, setName] = useState(existingProject?.name || '');
  const [description, setDescription] = useState(existingProject?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = { name, description };

    if (existingProject) {
      // If editing an existing project
      await updateProject(existingProject.id!, projectData);
    } else {
      // If creating a new project
      await createProject(projectData);
    }

    // Reset form fields
    setName('');
    setDescription('');

    // Trigger the onSuccess callback
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">Project Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base lg:text-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base lg:text-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-all duration-300 ease-in-out text-sm sm:text-base lg:text-lg"
      >
        {existingProject ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;
