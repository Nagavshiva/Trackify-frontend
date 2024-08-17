import React, { useState } from 'react';

interface TimeEntry {
  id: string;
  projectName: string;
  startTime: string;
  endTime: string;
  duration: string;
  isRunning: boolean;
  count: number;
}

interface TimeEntryFormProps {
  timeEntry: TimeEntry;
  onSave: (updatedEntry: TimeEntry) => void;
  onClose: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ timeEntry, onSave, onClose }) => {
  const [projectName, setProjectName] = useState(timeEntry.projectName);
  const [startTime, setStartTime] = useState(timeEntry.startTime);
  const [endTime, setEndTime] = useState(timeEntry.endTime);

  const handleSave = () => {
    const updatedEntry: TimeEntry = {
      ...timeEntry,
      projectName,
      startTime,
      endTime,
    };
    onSave(updatedEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Time Entry</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm md:text-base lg:text-lg">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm md:text-base lg:text-lg">Start Time</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm md:text-base lg:text-lg">End Time</label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-300 ease-in-out"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition-all duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeEntryForm;
