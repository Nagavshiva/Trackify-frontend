import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../../api/projectsApi';
import ProjectForm from './ProjectForm';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { deleteProject } from '../../api/projectsApi';
import { Link } from 'react-router-dom';

interface Project {
  id?: string;
  name: string;
  description: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const projects = await fetchProjects();
    setProjects(projects);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true); // Open modal for editing
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      await loadProjects();
    }
  };

  const handleFormSuccess = async () => {
    setSelectedProject(null);
    setIsModalOpen(false); // Close modal after success
    await loadProjects();
  };

  const handleCreateNewProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true); // Open modal for creating a new project
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* Create Project Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateNewProject}
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Create Project
        </button>
      </div>

      {/* Responsive table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-300 text-sm sm:text-base lg:text-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-700 border-b border-gray-300">Project Name</th>
              <th className="p-4 text-left text-gray-700 border-b border-gray-300">Description</th>
              <th className="p-4 text-center text-gray-700 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="p-4 text-gray-800 border-b border-gray-300 cursor-pointer hover:text-blue-500">
                  <Link to={`/tasks/${project.id}`}>{project.name}</Link>
                </td>
                <td className="p-4 text-gray-800 border-b border-gray-300">{project.description}</td>
                <td className="p-4 text-center border-b border-gray-300">
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-2 py-1 mr-2 text-yellow-500 hover:text-yellow-700"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (project.id) {
                        handleDelete(project.id);
                      } else {
                        console.error("Project ID is undefined");
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

      {/* Modal for Project Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative bg-white p-6 rounded shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <ProjectForm existingProject={selectedProject} onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
