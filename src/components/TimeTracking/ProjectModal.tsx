import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../../api/projectsApi';
import { fetchTasks } from '../../api/tasksApi';
import { IoMdClose } from "react-icons/io";

interface Project {
  id?: string;
  name: string;
  description: string;
}

interface Task {
  id?: string;
  title: string;
  projectId: string;
}

interface ProjectModalProps {
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadProjectsAndTasks = async () => {
      const fetchedProjects = await fetchProjects();
      const fetchedTasks = await fetchTasks();
      setProjects(fetchedProjects);
      setTasks(fetchedTasks);
      setFilteredProjects(fetchedProjects);
    };

    loadProjectsAndTasks();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const handleProjectSelect = (project: Project) => {
    onSelectProject(project);
    onClose();
  };

  const getTaskCountForProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Select Project</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <IoMdClose size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search projects"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleProjectSelect(project)}
            >
              <span className="text-sm sm:text-base lg:text-lg">{project.name}</span>
              <span className="text-xs sm:text-sm lg:text-base text-gray-600">Tasks: {getTaskCountForProject(project.id ?? '')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

