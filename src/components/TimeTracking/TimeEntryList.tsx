import React, { useState, useEffect } from 'react';
import { FaPlay, FaPlus, FaPause, FaStop, FaEdit, FaTrash } from 'react-icons/fa';
import ProjectModal from './ProjectModal';
import TimeEntryForm from './TimeEntryForm';
import { fetchTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry } from '../../api/timeEntriesApi';

interface TimeEntry {
  id: string;
  projectName: string;
  startTime: string;
  endTime: string;
  duration: string;
  isRunning: boolean;
  count: number;
}

const TimeEntryList: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>('00:00:00');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);

  useEffect(() => {
    const loadTimeEntries = async () => {
      try {
        const fetchedEntries = await fetchTimeEntries();
        const validEntries = fetchedEntries.filter((entry): entry is TimeEntry => entry.id !== undefined);
        setTimeEntries(validEntries);
      } catch (error) {
        console.error('Error loading time entries:', error);
      }
    };

    loadTimeEntries();
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const [hours, minutes, seconds] = prevTime.split(':').map(Number);
          const newSeconds = seconds + 1;
          const newMinutes = minutes + Math.floor(newSeconds / 60);
          const newHours = hours + Math.floor(newMinutes / 60);
          return `${String(newHours).padStart(2, '0')}:${String(newMinutes % 60).padStart(2, '0')}:${String(newSeconds % 60).padStart(2, '0')}`;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = async (entryId?: string) => {
    if (!selectedProject && !entryId) {
      alert('Please select a project first.');
      return;
    }

    let updatedEntries = [...timeEntries];

    if (entryId) {
      updatedEntries = updatedEntries.map(entry =>
        entry.id === entryId ? { ...entry, isRunning: true, startTime: new Date().toLocaleTimeString() } : entry
      );
      const entryToUpdate = updatedEntries.find(entry => entry.id === entryId);
      if (entryToUpdate) {
        try {
          await updateTimeEntry(entryToUpdate.id, entryToUpdate);
        } catch (error) {
          console.error('Error updating time entry:', error);
        }
      }
    } else {
      if (timeEntries.some(entry => entry.isRunning)) {
        alert('A timer is already running.');
        return;
      }

      const newEntry: TimeEntry = {
        id: new Date().toISOString(),
        projectName: selectedProject || "Unnamed Project",
        startTime: new Date().toLocaleTimeString(),
        endTime: '',
        duration: timer,
        isRunning: true,
        count: 0,
      };

      try {
        const createdEntry = await createTimeEntry(newEntry);
        if (createdEntry.id) {
          updatedEntries.push(createdEntry as TimeEntry);
        } else {
          console.error('Error: Created entry does not have a valid ID');
        }
      } catch (error) {
        console.error('Error creating time entry:', error);
      }
    }

    setIsRunning(true);
    setTimeEntries(updatedEntries);
  };

  const handleStop = async (entryId: string) => {
    setIsRunning(false);
    setTimer('00:00:00');
    const updatedEntries = timeEntries.map(entry =>
      entry.id === entryId ? { ...entry, endTime: new Date().toLocaleTimeString(), isRunning: false, duration: timer } : entry
    );

    setTimeEntries(updatedEntries);
    setSelectedProject(null);

    const entryToUpdate = updatedEntries.find(entry => entry.id === entryId);
    if (entryToUpdate) {
      try {
        await updateTimeEntry(entryToUpdate.id, entryToUpdate);
      } catch (error) {
        console.error('Error updating time entry:', error);
      }
    }
  };

  const handleEdit = (entryId: string) => {
    const entryToEdit = timeEntries.find(entry => entry.id === entryId);
    if (entryToEdit) {
      setCurrentEntry(entryToEdit);
      setIsFormOpen(true);
    }
  };

  const handleSave = async (updatedEntry: TimeEntry) => {
    try {
      await updateTimeEntry(updatedEntry.id, updatedEntry);
      setTimeEntries(timeEntries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      await deleteTimeEntry(entryId);
      setTimeEntries(timeEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
  };

  const handleProjectSelect = (project: { name: string }) => {
    setSelectedProject(project.name);
    setIsModalOpen(false);
  };

  const handleCountIncrement = (entryId: string) => {
    setTimeEntries(timeEntries.map(entry =>
      entry.id === entryId ? { ...entry, count: entry.count + 1 } : entry
    ));
  };

  return (
    <div className="container mx-auto px-4">

      <div className="border p-4 mb-4 rounded shadow flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <input
  type="text"
  placeholder="What are you working on?"
  className="
    flex-grow
    px-3 py-2 
    sm:px-4 sm:py-3 
    md:px-5 md:py-3.5
    lg:px-6 lg:py-4
    text-sm sm:text-base md:text-lg lg:text-xl
    border 
    rounded 
    mb-2 sm:mb-0
    w-full sm:w-auto
    focus:outline-none focus:ring-2 focus:ring-blue-500
  "
/>

        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:ml-4 w-full sm:w-auto">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center justify-center w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 sm:px-3 lg:px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="inline mr-2 md:mr-0" />
            <span className="md:text-center">{selectedProject || 'Project'}</span>
          </button>
          <span className="text-lg w-full sm:w-auto sm:mr-4 mb-2 sm:mb-0">{timer}</span>
          {!isRunning ? (
            <button
              onClick={() => handleStart()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto sm:px-3 lg:px-4"
            >
              <FaPlay className="inline mr-2 md:mr-0" />
              <span className="md:text-center">Start</span>
            </button>
          ) : (
            <button
              onClick={() => handleStop(timeEntries.find(entry => entry.isRunning)!.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 flex items-center justify-center w-full sm:w-auto sm:px-3 lg:px-4"
            >
              <FaStop className="inline mr-2 md:mr-0" />
              <span className="md:text-center">Stop</span>
            </button>
          )}
        </div>

      </div>

      {timeEntries.some(entry => !entry.isRunning) && (
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
          <table className="min-w-full bg-white text-sm sm:text-base lg:text-lg">
            <thead>
              <tr className="w-full bg-gray-100 text-left">
                <th className="p-2 sm:p-4 border-b border-gray-300">Project</th>
                <th className="p-2 sm:p-4 border-b border-gray-300">From</th>
                <th className="p-2 sm:p-4 border-b border-gray-300">To</th>
                <th className="p-2 sm:p-4 border-b border-gray-300">Duration</th>
                <th className="p-2 sm:p-4 border-b border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-2 sm:p-4 flex items-center text-xs sm:text-sm lg:text-base">
                    {entry.projectName}
                    {entry.count > 0 && (
                      <button
                        onClick={() => handleCountIncrement(entry.id)}
                        className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                      >
                        {entry.count}
                      </button>
                    )}
                  </td>
                  <td className="p-2 sm:p-4 text-xs sm:text-sm lg:text-base">{entry.startTime}</td>
                  <td className="p-2 sm:p-4 text-xs sm:text-sm lg:text-base">{entry.endTime || 'N/A'}</td>
                  <td className="p-2 sm:p-4 text-xs sm:text-sm lg:text-base">{entry.duration}</td>
                  <td className="p-2 sm:p-4 text-center flex items-center justify-center">
                    {entry.isRunning ? (
                      <button
                        onClick={() => handleStop(entry.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 mr-2"
                      >
                        <FaPause />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStart(entry.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
                      >
                        <FaPlay />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(entry.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          onClose={() => setIsModalOpen(false)}
          onSelectProject={handleProjectSelect}
        />
      )}

      {isFormOpen && currentEntry && (
        <TimeEntryForm
          timeEntry={currentEntry}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default TimeEntryList;
